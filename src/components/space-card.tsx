import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Colors, Fonts } from '@/constants/theme';

type Variant = 'dark' | 'wine' | 'crisis' | 'paper';

const V: Record<Variant, { bg: string; border: string; eyebrow: string; title: string; sub: string; accent: string; iconBg?: string }> = {
  dark: { bg: Colors.card, border: 'rgba(217,179,143,0.24)', eyebrow: '#BFA088', title: Colors.ivory, sub: '#BBA999', accent: Colors.champagne },
  wine: { bg: Colors.wine, border: 'rgba(226,194,155,0.45)', eyebrow: '#BFA088', title: Colors.ivory, sub: '#E3CDBE', accent: Colors.champagne },
  crisis: { bg: '#1E080B', border: 'rgba(214,110,110,0.45)', eyebrow: '#BFA088', title: Colors.ivory, sub: '#BBA999', accent: Colors.crisis },
  paper: { bg: '#F1E3D0', border: Colors.champagne, eyebrow: Colors.paperMuted, title: Colors.paperInk, sub: '#6E4A3C', accent: '#8E1B2A', iconBg: '#FBF5EC' },
};

export function SpaceCard({
  eyebrow,
  title,
  subtitle,
  icon,
  variant = 'dark',
  onPress,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  variant?: Variant;
  onPress?: () => void;
}) {
  const v = V[variant];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, { backgroundColor: v.bg, borderColor: v.border, opacity: pressed ? 0.9 : 1 }]}>
      <View style={[styles.icon, { borderColor: variant === 'paper' ? 'rgba(58,11,19,0.3)' : v.border, backgroundColor: v.iconBg ?? 'transparent' }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.eyebrow, { color: v.eyebrow }]}>{eyebrow}</Text>
        <Text style={[styles.title, { color: v.title }]}>{title}</Text>
        <Text style={[styles.sub, { color: v.sub }]}>{subtitle}</Text>
      </View>
      <Svg width={18} height={18} viewBox="0 0 24 24">
        <Path d="M9 6l6 6-6 6" fill="none" stroke={v.accent} strokeWidth={1.4} strokeLinecap="round" />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 22, borderWidth: 1 },
  icon: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontFamily: Fonts.caps, fontSize: 10, letterSpacing: 2.6 },
  title: { fontFamily: Fonts.serifItalic, fontSize: 24, lineHeight: 26, marginTop: 3 },
  sub: { fontFamily: Fonts.body, fontSize: 12.5, lineHeight: 18, marginTop: 4 },
});
