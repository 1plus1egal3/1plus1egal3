import { isSupabaseConfigured, supabase } from './supabase';

export type SouvenirKind = 'photo' | 'pensee' | 'moment';

export type Souvenir = {
  id: string;
  kind: SouvenirKind;
  date: string; // texte libre affiché, ex. « 12 juil. 2026 »
  place: string;
  phrase: string;
  /** Texte de « La pensée de l'instant » */
  text?: string;
  photoUri?: string;
  author: string;
};

export const SAMPLE_SOUVENIRS: Souvenir[] = [
  { id: 's1', kind: 'photo', date: '12 juil. 2026', place: 'Cassis', phrase: 'Les calanques au lever du jour, rien que nous deux.', author: 'Léa' },
  { id: 's2', kind: 'pensee', date: '7 oct. 2026', place: 'À la maison', phrase: '', text: 'Merci d’avoir tout géré mardi soir. Je te vois, même quand je ne le dis pas.', author: 'Hugo' },
  { id: 's3', kind: 'photo', date: '24 août 2025', place: 'Nice, vieille ville', phrase: 'Notre premier rendez-vous. Tu étais en retard, je t’ai attendu quand même.', author: 'Léa' },
];

/**
 * Lecture des souvenirs du couple (table `souvenirs`, protégée par RLS).
 * Retourne les exemples si Supabase n'est pas encore configuré.
 */
export async function listSouvenirs(coupleId?: string): Promise<Souvenir[]> {
  if (!isSupabaseConfigured || !supabase || !coupleId) return SAMPLE_SOUVENIRS;
  const { data, error } = await supabase
    .from('souvenirs')
    .select('id, kind, happened_on_label, place, phrase, body, photo_path, author_name')
    .eq('couple_id', coupleId)
    .order('created_at', { ascending: false });
  if (error || !data) return SAMPLE_SOUVENIRS;
  return data.map((r: any) => ({
    id: r.id,
    kind: r.kind,
    date: r.happened_on_label ?? '',
    place: r.place ?? '',
    phrase: r.phrase ?? '',
    text: r.body ?? undefined,
    photoUri: r.photo_path ?? undefined,
    author: r.author_name ?? '',
  }));
}

export async function addSouvenir(coupleId: string | undefined, s: Omit<Souvenir, 'id'>): Promise<Souvenir> {
  const local: Souvenir = { ...s, id: `local-${Date.now()}` };
  if (!isSupabaseConfigured || !supabase || !coupleId) return local;
  const { data, error } = await supabase
    .from('souvenirs')
    .insert({
      couple_id: coupleId,
      kind: s.kind,
      happened_on_label: s.date,
      place: s.place,
      phrase: s.phrase,
      body: s.text ?? null,
      photo_path: s.photoUri ?? null,
      author_name: s.author,
    })
    .select('id')
    .single();
  if (error || !data) return local;
  return { ...s, id: data.id };
}
