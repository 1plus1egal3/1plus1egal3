-- 1+1=3 — schéma initial
-- À exécuter dans Supabase : SQL Editor → coller ce fichier → Run
-- (ou via la CLI : supabase db push)

-- =========================================================
-- 1. Profils, couples, invitations
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  started_on date,                 -- date de début de l'histoire (compteur « jour N »)
  signs text,                      -- ex. « Bélier · Balance » (ciel du couple)
  created_at timestamptz not null default now()
);

create table if not exists public.couple_members (
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (couple_id, user_id)
);

create table if not exists public.couple_invitations (
  code text primary key,           -- code d'invitation partagé au/à la partenaire
  couple_id uuid not null references public.couples(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  accepted_by uuid references auth.users(id),
  expires_at timestamptz not null default now() + interval '7 days',
  created_at timestamptz not null default now()
);

-- Appartenance au couple (utilisée par les règles de sécurité)
create or replace function public.is_couple_member(cid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.couple_members
    where couple_id = cid and user_id = auth.uid()
  );
$$;

-- Créer son couple + un code d'invitation
create or replace function public.create_couple(p_started_on date default null)
returns table (couple_id uuid, invite_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple uuid;
  v_code text := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
begin
  if auth.uid() is null then raise exception 'Non connecté'; end if;
  insert into public.couples (started_on) values (p_started_on) returning id into v_couple;
  insert into public.couple_members (couple_id, user_id) values (v_couple, auth.uid());
  insert into public.couple_invitations (code, couple_id, created_by) values (v_code, v_couple, auth.uid());
  return query select v_couple, v_code;
end;
$$;

-- Rejoindre le couple avec le code reçu
create or replace function public.join_couple(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inv public.couple_invitations;
begin
  if auth.uid() is null then raise exception 'Non connecté'; end if;
  select * into v_inv from public.couple_invitations
   where code = upper(p_code) and accepted_by is null and expires_at > now();
  if not found then raise exception 'Invitation invalide ou expirée'; end if;
  if (select count(*) from public.couple_members where couple_id = v_inv.couple_id) >= 2 then
    raise exception 'Ce couple est déjà complet';
  end if;
  insert into public.couple_members (couple_id, user_id) values (v_inv.couple_id, auth.uid())
    on conflict do nothing;
  update public.couple_invitations set accepted_by = auth.uid() where code = v_inv.code;
  return v_inv.couple_id;
end;
$$;

-- =========================================================
-- 2. Catalogue : 23 thèmes, 46 parcours (podcast + PDF)
-- =========================================================
create table if not exists public.themes (
  slug text primary key,
  position smallint not null,
  name text not null,
  safety boolean not null default false   -- « Violence » : parcours seul·e, accès sécurité
);

create table if not exists public.parcours (
  id uuid primary key default gen_random_uuid(),
  theme_slug text not null references public.themes(slug) on delete cascade,
  position smallint not null check (position in (1, 2)),
  title text not null,
  podcast_path text,               -- chemin dans le bucket « contenus »
  podcast_duration_sec integer,
  pdf_path text,                   -- chemin dans le bucket « contenus »
  unique (theme_slug, position)
);

create table if not exists public.parcours_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  parcours_id uuid not null references public.parcours(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, parcours_id)
);

-- =========================================================
-- 3. Souvenirs — « Notre histoire »
-- =========================================================
create table if not exists public.souvenirs (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_name text,
  kind text not null check (kind in ('photo', 'pensee', 'moment')),
  happened_on date,
  happened_on_label text,          -- date telle qu'affichée (« 12 juil. 2026 »)
  place text,
  phrase text,
  body text,                       -- texte de « La pensée de l'instant »
  photo_path text,                 -- chemin dans le bucket « souvenirs »
  created_at timestamptz not null default now()
);
create index if not exists souvenirs_couple_idx on public.souvenirs (couple_id, created_at desc);

-- =========================================================
-- 4. Sécurité (RLS) : chaque couple ne voit que ses données
-- =========================================================
alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.couple_invitations enable row level security;
alter table public.themes enable row level security;
alter table public.parcours enable row level security;
alter table public.parcours_progress enable row level security;
alter table public.souvenirs enable row level security;

create policy "profil : lecture/écriture de soi" on public.profiles
  for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "couple : lecture par ses membres" on public.couples
  for select to authenticated using (public.is_couple_member(id));
create policy "couple : modification par ses membres" on public.couples
  for update to authenticated using (public.is_couple_member(id)) with check (public.is_couple_member(id));

create policy "membres : visibles par le couple" on public.couple_members
  for select to authenticated using (public.is_couple_member(couple_id));

create policy "invitations : visibles par le couple" on public.couple_invitations
  for select to authenticated using (public.is_couple_member(couple_id));

create policy "catalogue : lecture thèmes" on public.themes
  for select to authenticated using (true);
create policy "catalogue : lecture parcours" on public.parcours
  for select to authenticated using (true);

create policy "progression : la sienne" on public.parcours_progress
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "souvenirs : lecture par le couple" on public.souvenirs
  for select to authenticated using (public.is_couple_member(couple_id));
create policy "souvenirs : ajout par un membre" on public.souvenirs
  for insert to authenticated with check (public.is_couple_member(couple_id) and author_id = auth.uid());
create policy "souvenirs : modification par l'auteur" on public.souvenirs
  for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "souvenirs : suppression par l'auteur" on public.souvenirs
  for delete to authenticated using (author_id = auth.uid());

-- =========================================================
-- 5. Stockage : photos des souvenirs (privé) et contenus (podcasts, PDF)
-- =========================================================
insert into storage.buckets (id, name, public) values ('souvenirs', 'souvenirs', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('contenus', 'contenus', false)
  on conflict (id) do nothing;

-- Photos rangées par couple : souvenirs/<couple_id>/<fichier>
create policy "photos : lecture par le couple" on storage.objects
  for select to authenticated
  using (bucket_id = 'souvenirs' and public.is_couple_member(((storage.foldername(name))[1])::uuid));
create policy "photos : ajout par le couple" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'souvenirs' and public.is_couple_member(((storage.foldername(name))[1])::uuid));

-- Podcasts et PDF : lisibles par les utilisateurs connectés (abonnement géré côté app)
create policy "contenus : lecture connectés" on storage.objects
  for select to authenticated using (bucket_id = 'contenus');

-- =========================================================
-- 6. Données du catalogue de lancement
-- =========================================================
insert into public.themes (slug, position, name, safety) values
  ('amour', 1, 'Amour', false),
  ('argent', 2, 'Argent', false),
  ('attachement', 3, 'Attachement', false),
  ('cohabitation', 4, 'Cohabitation', false),
  ('communication', 5, 'Communication', false),
  ('complicite', 6, 'Complicité', false),
  ('confiance', 7, 'Confiance', false),
  ('conflits', 8, 'Conflits', false),
  ('desir', 9, 'Désir', false),
  ('emotions', 10, 'Émotions', false),
  ('equilibre', 11, 'Équilibre', false),
  ('evolution', 12, 'Évolution', false),
  ('famille', 13, 'Famille', false),
  ('grossesse', 14, 'Grossesse', false),
  ('jalousie', 15, 'Jalousie', false),
  ('parentalite', 16, 'Parentalité', false),
  ('pardon', 17, 'Pardon', false),
  ('projets', 18, 'Projets', false),
  ('quotidien', 19, 'Quotidien', false),
  ('respect', 20, 'Respect', false),
  ('rupture', 21, 'Rupture', false),
  ('stress', 22, 'Stress', false),
  ('violence', 23, 'Violence', true)
on conflict (slug) do update set position = excluded.position, name = excluded.name, safety = excluded.safety;

insert into public.parcours (theme_slug, position, title) values
  ('amour', 1, 'Ne plus se sentir aimé ou choisi'),
  ('amour', 2, 'Doutes sur l’amour et évolution des sentiments'),
  ('argent', 1, 'Désaccords sur les dépenses et le budget'),
  ('argent', 2, 'Dettes, crédits et difficultés financières'),
  ('attachement', 1, 'Peur de l’abandon et de perdre l’autre'),
  ('attachement', 2, 'Dépendance affective, fusion et oubli de soi'),
  ('cohabitation', 1, 'Rangement, propreté et habitudes domestiques'),
  ('cohabitation', 2, 'Espace personnel et règles de vie'),
  ('communication', 1, 'Ne pas réussir à se parler ou à s’écouter'),
  ('communication', 2, 'Non-dits, attentes implicites et besoins inexprimés'),
  ('complicite', 1, 'Manque de temps de qualité et de présence'),
  ('complicite', 2, 'Routine, ennui et relation devenue logistique'),
  ('confiance', 1, 'Mensonges, secrets et engagements non tenus'),
  ('confiance', 2, 'Infidélité sexuelle ou émotionnelle'),
  ('conflits', 1, 'Disputes répétitives et escalade'),
  ('conflits', 2, 'Reproches, critiques et mépris'),
  ('desir', 1, 'Baisse du désir, de l’attirance et de la séduction'),
  ('desir', 2, 'Différences de libido et de besoins sexuels'),
  ('emotions', 1, 'Difficulté à réguler la colère et les réactions'),
  ('emotions', 2, 'Anxiété, insécurité et peur du rejet'),
  ('equilibre', 1, 'Donner plus que recevoir et efforts à sens unique'),
  ('equilibre', 2, 'Manque de reconnaissance et de gratitude'),
  ('evolution', 1, 'Changer à des rythmes différents'),
  ('evolution', 2, 'Réinventer la relation après une épreuve'),
  ('famille', 1, 'Belle-famille, parents et ingérences'),
  ('famille', 2, 'Loyautés familiales et difficulté à poser des limites'),
  ('grossesse', 1, 'Fatigue, récupération et post-partum'),
  ('grossesse', 2, 'Intimité et désir pendant ou après la grossesse'),
  ('jalousie', 1, 'Jalousie, comparaison et peur d’être remplacé'),
  ('jalousie', 2, 'Réseaux sociaux et relations avec les ex'),
  ('parentalite', 1, 'Désaccords éducatifs et règles parentales'),
  ('parentalite', 2, 'Charge parentale, fatigue et répartition des rôles'),
  ('pardon', 1, 'Rancœur et ressentiment accumulés'),
  ('pardon', 2, 'Blessures anciennes et disputes jamais réparées'),
  ('projets', 1, 'Désaccord sur l’avenir et les priorités'),
  ('projets', 2, 'Différences de valeurs, de croyances ou de culture'),
  ('quotidien', 1, 'Tout porter : charge mentale et responsabilités invisibles'),
  ('quotidien', 2, 'Répartition des tâches et manque d’initiative'),
  ('respect', 1, 'Manque de respect et de considération'),
  ('respect', 2, 'Savoir dire non et poser ses limites'),
  ('rupture', 1, 'Rester ou partir : doutes et ambivalence'),
  ('rupture', 2, 'Ne plus être heureux ensemble'),
  ('stress', 1, 'Stress professionnel, surcharge et burn-out'),
  ('stress', 2, 'Maladie, santé et épuisement'),
  ('violence', 1, 'Contrôle, isolement et emprise'),
  ('violence', 2, 'Humiliations, menaces et intimidation')
on conflict (theme_slug, position) do update set title = excluded.title;
