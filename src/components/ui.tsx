/** Briques d'interface réutilisables, dans l'identité 1+1=3. */
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { Colors, Fonts, GoldGradient } from '@/constants/theme';

export function Eyebrow({ children, color = Colors.eyebrow, style }: { children: React.ReactNode; color?: string; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.eyebrow, { color }, style]}>{children}</Text>;
}

export function TitleSerif({ children, size = 36, color = Colors.ivory, style }: { children: React.ReactNode; size?: number; color?: string; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.serif, { fontSize: size, lineHeight: size * 1.08, color }, style]}>{children}</Text>;
}

export function Body({ children, color = Colors.textSoft, size = 14, style }: { children: React.ReactNode; color?: string; size?: number; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, { color, fontSize: size, lineHeight: size * 1.55 }, style]}>{children}</Text>;
}

/** Bouton principal : métal champagne → or rose, Cinzel très gras. */
export function GoldButton({ label, onPress, height = 56, style }: { label: string; onPress?: () => void; height?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}>
      <LinearGradient
        colors={GoldGradient}
        locations={[0, 0.38, 0.72, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.btn, { height, borderRadius: height / 2 }]}>
        <Text style={styles.goldLabel}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

/** Bouton secondaire : bordeaux, liseré or rose. */
export function WineButton({ label, onPress, height = 54, style }: { label: string; onPress?: () => void; height?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.btn, styles.wine, { height, borderRadius: height / 2, opacity: pressed ? 0.85 : 1 }, style]}>
      <Text style={styles.wineLabel}>{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Eyebrow>{children}</Eyebrow>
      <View style={styles.sectionRule} />
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  eyebrow: { fontFamily: Fonts.caps, fontSize: 11, letterSpacing: 2.6 },
  serif: { fontFamily: Fonts.serifItalic },
  body: { fontFamily: Fonts.body },
  btn: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  goldLabel: { fontFamily: Fonts.capsBold, fontSize: 14, letterSpacing: 2.2, color: '#2A0A10' },
  wine: { backgroundColor: Colors.wine, borderWidth: 1, borderColor: Colors.roseGold },
  wineLabel: { fontFamily: Fonts.caps, fontSize: 13, letterSpacing: 1.8, color: '#F4DFC8' },
  section: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  sectionRule: { flex: 1, height: 1, backgroundColor: 'rgba(217,179,143,0.25)' },
  card: { borderRadius: 24, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder, padding: 20 },
});
