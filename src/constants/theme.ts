/**
 * Identité visuelle 1+1=3 — validée par Julia.
 * Règle : jamais de jaune. L'or est champagne / or rose.
 */
export const Colors = {
  ink: '#0B0607', // noir velours (fond)
  card: '#150A0C', // cartes sombres
  cardBorder: 'rgba(217,179,143,0.22)',
  wine: '#3A0B13', // bordeaux
  wineDeep: '#2E050B', // grenat (onglet Couple)
  wineCrisis: '#5C0F1C', // médaillon Crise
  champagne: '#E2C29B',
  champagneLight: '#F1D8BC',
  roseGold: '#C9956F',
  roseGoldLight: '#D9AE88',
  eyebrow: '#D9B38F',
  ivory: '#F7EDE1',
  text: '#F4ECE2',
  textSoft: '#CDBBAB',
  textMuted: '#A89788',
  paper: '#F4EADC', // Souvenirs
  paperCard: '#FFFDF8',
  paperInk: '#3A0B13',
  paperMuted: '#8E5A44',
  crisis: '#FF9C9C',
  crisisSoft: '#E0707E',
  navBg: '#0E0708',
} as const;

/** Dégradé métal des boutons principaux (champagne → or rose). */
export const GoldGradient = ['#F7E7D2', '#E0B994', '#B98264', '#EACCAE'] as const;

export const Fonts = {
  // Titres romantiques
  serifItalic: 'CormorantGaramond_500Medium_Italic',
  serifItalicLight: 'CormorantGaramond_400Regular_Italic',
  // Sur-titres et boutons (capitales, audacieux)
  caps: 'Cinzel_700Bold',
  capsBold: 'Cinzel_800ExtraBold',
  // Texte courant
  body: 'Montserrat_400Regular',
  bodyMedium: 'Montserrat_500Medium',
  bodySemi: 'Montserrat_600SemiBold',
} as const;

export const Radius = { card: 24, pill: 999, small: 16 } as const;
