/**
 * Catalogue de lancement 1+1=3 — 23 thèmes, 2 parcours chacun (46 parcours).
 * Source : « 1+1=3 — Le couple — catalogue de lancement ».
 * Chaque parcours contiendra un podcast et un PDF d'exercices (URLs à renseigner,
 * idéalement dans Supabase : tables `themes` / `parcours`, voir supabase/migrations).
 */
export type Parcours = {
  title: string;
  podcastUrl?: string;
  pdfUrl?: string;
};

export type Theme = {
  slug: string;
  name: string;
  parcours: [Parcours, Parcours];
  /** Thème sensible : parcours à faire seul·e, accès de sécurité, sortie rapide. */
  safety?: boolean;
};

const t = (slug: string, name: string, a: string, b: string, safety = false): Theme => ({
  slug,
  name,
  parcours: [{ title: a }, { title: b }],
  safety,
});

export const THEMES: Theme[] = [
  t('amour', 'Amour', 'Ne plus se sentir aimé ou choisi', 'Doutes sur l’amour et évolution des sentiments'),
  t('argent', 'Argent', 'Désaccords sur les dépenses et le budget', 'Dettes, crédits et difficultés financières'),
  t('attachement', 'Attachement', 'Peur de l’abandon et de perdre l’autre', 'Dépendance affective, fusion et oubli de soi'),
  t('cohabitation', 'Cohabitation', 'Rangement, propreté et habitudes domestiques', 'Espace personnel et règles de vie'),
  t('communication', 'Communication', 'Ne pas réussir à se parler ou à s’écouter', 'Non-dits, attentes implicites et besoins inexprimés'),
  t('complicite', 'Complicité', 'Manque de temps de qualité et de présence', 'Routine, ennui et relation devenue logistique'),
  t('confiance', 'Confiance', 'Mensonges, secrets et engagements non tenus', 'Infidélité sexuelle ou émotionnelle'),
  t('conflits', 'Conflits', 'Disputes répétitives et escalade', 'Reproches, critiques et mépris'),
  t('desir', 'Désir', 'Baisse du désir, de l’attirance et de la séduction', 'Différences de libido et de besoins sexuels'),
  t('emotions', 'Émotions', 'Difficulté à réguler la colère et les réactions', 'Anxiété, insécurité et peur du rejet'),
  t('equilibre', 'Équilibre', 'Donner plus que recevoir et efforts à sens unique', 'Manque de reconnaissance et de gratitude'),
  t('evolution', 'Évolution', 'Changer à des rythmes différents', 'Réinventer la relation après une épreuve'),
  t('famille', 'Famille', 'Belle-famille, parents et ingérences', 'Loyautés familiales et difficulté à poser des limites'),
  t('grossesse', 'Grossesse', 'Fatigue, récupération et post-partum', 'Intimité et désir pendant ou après la grossesse'),
  t('jalousie', 'Jalousie', 'Jalousie, comparaison et peur d’être remplacé', 'Réseaux sociaux et relations avec les ex'),
  t('parentalite', 'Parentalité', 'Désaccords éducatifs et règles parentales', 'Charge parentale, fatigue et répartition des rôles'),
  t('pardon', 'Pardon', 'Rancœur et ressentiment accumulés', 'Blessures anciennes et disputes jamais réparées'),
  t('projets', 'Projets', 'Désaccord sur l’avenir et les priorités', 'Différences de valeurs, de croyances ou de culture'),
  t('quotidien', 'Quotidien', 'Tout porter : charge mentale et responsabilités invisibles', 'Répartition des tâches et manque d’initiative'),
  t('respect', 'Respect', 'Manque de respect et de considération', 'Savoir dire non et poser ses limites'),
  t('rupture', 'Rupture', 'Rester ou partir : doutes et ambivalence', 'Ne plus être heureux ensemble'),
  t('stress', 'Stress', 'Stress professionnel, surcharge et burn-out', 'Maladie, santé et épuisement'),
  t('violence', 'Violence', 'Contrôle, isolement et emprise', 'Humiliations, menaces et intimidation', true),
];

export const themeNumber = (slug: string) => {
  const i = THEMES.findIndex((x) => x.slug === slug);
  return String(i + 1).padStart(2, '0');
};

export const findTheme = (slug: string) => THEMES.find((x) => x.slug === slug);

/** Recherche insensible aux accents et à la casse, sur le nom et les parcours. */
export const searchThemes = (query: string) => {
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const q = norm(query.trim());
  if (!q) return THEMES;
  return THEMES.filter((th) => norm(`${th.name} ${th.parcours[0].title} ${th.parcours[1].title}`).includes(q));
};

/** Numéros d'urgence (France). */
export const SAFETY_NUMBERS = [
  { label: 'Police secours', number: '17' },
  { label: 'Violences Femmes Info — gratuit, anonyme, 24 h/24', number: '3919' },
  { label: 'Urgence par SMS (personnes sourdes ou ne pouvant pas parler)', number: '114' },
];
