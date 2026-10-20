/** 03b · Un thème et ses deux parcours. */
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import { BackButton } from '@/components/back-button';
import { SafetyPanel } from '@/components/safety-panel';
import { Body, Eyebrow, TitleSerif } from '@/components/ui';
import { Colors, Fonts } from '@/constants/theme';
import { findTheme, themeNumber } from '@/data/themes';

function Chip({ kind }: { kind: 'podcast' | 'pdf' }) {
  return (
    <View style={styles.chip}>
      <Svg width={14} height={14} viewBox="0 0 24 24">
        {kind === 'podcast' ? (
          <>
            <Path d="M4 14v-2a8 8 0 0 1 16 0v2" fill="none" stroke={Colors.champagneLight} strokeWidth={1.4} />
            <Rect x={3} y={14} width={4} height={6} rx={1.5} fill="none" stroke={Colors.champagneLight} strokeWidth={1.4} />
            <Rect x={17} y={14} width={4} height={6} rx={1.5} fill="none" stroke={Colors.champagneLight} strokeWidth={1.4} />
          </>
        ) : (
          <Path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" fill="none" stroke={Colors.champagneLight} strokeWidth={1.4} />
        )}
      </Svg>
      <Text style={styles.chipText}>{kind === 'podcast' ? 'Podcast' : 'PDF d’exercices'}</Text>
    </View>
  );
}

export default function ThemeScreen() {
  const { theme } = useLocalSearchParams<{ theme: string }>();
  const th = findTheme(theme);
  if (!th) return null;
  const num = themeNumber(th.slug);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.ink }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
        <View style={styles.header}>
          <BackButton />
          <Eyebrow>{`THÈME ${num} / 23`}</Eyebrow>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.ghostNum}>{num}</Text>
          <Eyebrow color="#F1D2B2">1+1=3 · THÈME</Eyebrow>
          <TitleSerif size={54} color="#FBF1E6" style={{ marginTop: 8 }}>{th.name}</TitleSerif>
          <Body color="#E3CDBE" style={{ marginTop: 12 }}>
            Deux parcours pour comprendre ce qui se joue, et agir. Chacun contient un podcast et un cahier d’exercices.
          </Body>
        </View>

        {th.parcours.map((p, k) => (
          <Pressable
            key={p.title}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/parcours/[theme]/[sub]', params: { theme: th.slug, sub: String(k) } })}
            style={styles.parcours}>
            <View style={styles.rowBetween}>
              <Eyebrow color="#BFA088" style={{ fontSize: 10.5 }}>{`PARCOURS ${k + 1}`}</Eyebrow>
              <Body size={12} color={Colors.textMuted}>Podcast + exercices</Body>
            </View>
            <TitleSerif size={26} style={{ marginTop: 10 }}>{p.title}</TitleSerif>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
              <Chip kind="podcast" />
              <Chip kind="pdf" />
            </View>
          </Pressable>
        ))}

        {th.safety && <SafetyPanel />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { padding: 22, paddingTop: 30, borderRadius: 28, backgroundColor: Colors.wine, borderWidth: 1, borderColor: 'rgba(226,194,155,0.4)', overflow: 'hidden' },
  ghostNum: { position: 'absolute', right: -6, top: -30, fontFamily: Fonts.serifItalic, fontSize: 170, color: 'rgba(241,210,178,0.10)' },
  parcours: { padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(217,179,143,0.24)', backgroundColor: Colors.card },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 11, borderRadius: 14, backgroundColor: 'rgba(226,194,155,0.14)' },
  chipText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.champagneLight },
});
