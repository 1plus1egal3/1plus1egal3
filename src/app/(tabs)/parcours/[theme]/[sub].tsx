/** 03c · Un parcours : podcast + PDF d'exercices. */
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import { BackButton } from '@/components/back-button';
import { Body, Eyebrow, TitleSerif } from '@/components/ui';
import { Colors, Fonts, GoldGradient } from '@/constants/theme';
import { findTheme } from '@/data/themes';

const fmt = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export default function ParcoursScreen() {
  const { theme, sub } = useLocalSearchParams<{ theme: string; sub: string }>();
  const th = findTheme(theme);
  const k = Number(sub) === 1 ? 1 : 0;
  const p = th?.parcours[k];

  const player = useAudioPlayer(p?.podcastUrl ? { uri: p.podcastUrl } : null);
  const status = useAudioPlayerStatus(player);
  const [done, setDone] = useState(false);

  if (!th || !p) return null;
  const other = th.parcours[1 - k];
  const hasAudio = Boolean(p.podcastUrl);
  const playing = hasAudio && status.playing;
  const progress = hasAudio && status.duration ? status.currentTime / status.duration : 0.22;

  const toggle = () => {
    if (!hasAudio) return;
    if (status.playing) player.pause();
    else player.play();
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.ink }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
        <View style={styles.header}>
          <BackButton />
          <Eyebrow style={{ fontSize: 10.5 }}>{`${th.name.toUpperCase()} · PARCOURS ${k + 1}`}</Eyebrow>
          {th.safety ? (
            <Pressable accessibilityRole="button" onPress={() => router.replace('/accueil')} style={styles.exit}>
              <Text style={styles.exitText}>SORTIE RAPIDE</Text>
            </Pressable>
          ) : (
            <View style={{ width: 44 }} />
          )}
        </View>

        <TitleSerif size={36}>{p.title}</TitleSerif>

        {/* Le podcast */}
        <View style={styles.podcast}>
          <Eyebrow color="#F1D2B2" style={{ fontSize: 10.5 }}>LE PODCAST</Eyebrow>
          <TitleSerif size={22} color="#FBF1E6" style={{ marginTop: 10 }}>{p.title}</TitleSerif>
          <Body size={12.5} color="#E3CDBE" style={{ marginTop: 4 }}>
            {hasAudio ? `Avec Julia Laureau · ${fmt(status.duration)}` : 'Avec Julia Laureau · bientôt disponible'}
          </Body>
          <View style={styles.wave}>
            {Array.from({ length: 40 }).map((_, i) => {
              const h = 8 + Math.round(24 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));
              return <View key={i} style={{ flex: 1, height: h, borderRadius: 2, backgroundColor: i / 40 < progress ? Colors.champagneLight : 'rgba(241,216,188,0.25)' }} />;
            })}
          </View>
          <View style={styles.rowBetween}>
            <Body size={11} color="#E3CDBE">{fmt(hasAudio ? status.currentTime : 0)}</Body>
            <Body size={11} color="#E3CDBE">{hasAudio ? fmt(status.duration) : '--:--'}</Body>
          </View>
          <View style={styles.controls}>
            <Pressable accessibilityLabel="Reculer de 15 secondes" onPress={() => hasAudio && player.seekTo(Math.max(0, status.currentTime - 15))} style={styles.skip}>
              <Svg width={26} height={26} viewBox="0 0 24 24"><Path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" fill="none" stroke="#F1D2B2" strokeWidth={1.4} /></Svg>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Pause' : 'Lecture'} onPress={toggle}>
              <LinearGradient colors={GoldGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.play}>
                <Svg width={26} height={26} viewBox="0 0 24 24">
                  {playing ? (
                    <>
                      <Rect x={6} y={5} width={4} height={14} rx={1} fill="#2A0A10" />
                      <Rect x={14} y={5} width={4} height={14} rx={1} fill="#2A0A10" />
                    </>
                  ) : (
                    <Path d="M8 5l11 7-11 7z" fill="#2A0A10" />
                  )}
                </Svg>
              </LinearGradient>
            </Pressable>
            <Pressable accessibilityLabel="Avancer de 15 secondes" onPress={() => hasAudio && player.seekTo(status.currentTime + 15)} style={styles.skip}>
              <Svg width={26} height={26} viewBox="0 0 24 24"><Path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" fill="none" stroke="#F1D2B2" strokeWidth={1.4} /></Svg>
            </Pressable>
          </View>
          <Body size={12} color="#E3CDBE" style={{ textAlign: 'center', marginTop: 8 }}>
            {th.safety ? 'À écouter seul·e, au calme, quand tu es en sécurité.' : 'À écouter seul·e ou à deux'}
          </Body>
        </View>

        {/* Le cahier d'exercices */}
        <View style={styles.pdf}>
          <Text style={styles.pdfEyebrow}>LE CAHIER D’EXERCICES</Text>
          <TitleSerif size={24} color={Colors.paperInk} style={{ marginTop: 8 }}>{`Exercices pratiques · ${th.name}`}</TitleSerif>
          <Body size={12.5} color="#6E4A3C" style={{ marginTop: 6 }}>
            {th.safety ? 'Pour toi, à garder en lieu sûr' : 'À faire chacun, puis à deux'}
          </Body>
          <Pressable
            accessibilityRole="button"
            onPress={() => p.pdfUrl && Linking.openURL(p.pdfUrl)}
            style={[styles.pdfBtn, !p.pdfUrl && { opacity: 0.6 }]}>
            <Text style={styles.pdfBtnText}>{p.pdfUrl ? 'OUVRIR LE PDF' : 'PDF BIENTÔT DISPONIBLE'}</Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => setDone(!done)}
          style={[styles.done, done && { backgroundColor: Colors.champagne, borderColor: Colors.champagne }]}>
          <Text style={[styles.doneText, done && { color: '#2A0A10' }]}>{done ? 'PARCOURS TERMINÉ ✓' : 'MARQUER COMME TERMINÉ'}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace({ pathname: '/parcours/[theme]/[sub]', params: { theme: th.slug, sub: String(1 - k) } })}
          style={styles.other}>
          <View style={{ flex: 1 }}>
            <Eyebrow color="#BFA088" style={{ fontSize: 10 }}>L’AUTRE PARCOURS DU THÈME</Eyebrow>
            <TitleSerif size={20} style={{ marginTop: 4 }}>{other.title}</TitleSerif>
          </View>
          <Svg width={18} height={18} viewBox="0 0 24 24"><Path d="M9 6l6 6-6 6" fill="none" stroke={Colors.eyebrow} strokeWidth={1.4} /></Svg>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  exit: { height: 36, paddingHorizontal: 12, borderRadius: 18, backgroundColor: Colors.wineCrisis, justifyContent: 'center' },
  exitText: { fontFamily: Fonts.capsBold, fontSize: 10, letterSpacing: 1, color: '#FFE3DA' },
  podcast: { padding: 20, borderRadius: 26, backgroundColor: Colors.wine, borderWidth: 1, borderColor: 'rgba(226,194,155,0.4)' },
  wave: { marginTop: 18, flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 34 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  controls: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 26 },
  skip: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  play: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  pdf: { padding: 22, borderRadius: 24, backgroundColor: '#F1E3D0' },
  pdfEyebrow: { fontFamily: Fonts.caps, fontSize: 10.5, letterSpacing: 2.3, color: Colors.paperMuted },
  pdfBtn: { marginTop: 16, height: 48, borderRadius: 24, backgroundColor: Colors.paperInk, alignItems: 'center', justifyContent: 'center' },
  pdfBtnText: { fontFamily: Fonts.capsBold, fontSize: 12, letterSpacing: 1.8, color: '#F4DFC8' },
  done: { height: 54, borderRadius: 27, borderWidth: 1, borderColor: 'rgba(226,194,155,0.5)', alignItems: 'center', justifyContent: 'center' },
  doneText: { fontFamily: Fonts.capsBold, fontSize: 13, letterSpacing: 1.8, color: Colors.champagneLight },
  other: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(217,179,143,0.22)', backgroundColor: Colors.card },
});
