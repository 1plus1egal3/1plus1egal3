/** 02 · Accueil (validé). */
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CoupleRings, EcgLine, HeartBeat, PolaroidTilt, SunMountain } from '@/components/animated-icons';
import { Movement } from '@/components/movement';
import { SpaceCard } from '@/components/space-card';
import { Body, Card, Eyebrow, SectionTitle, TitleSerif } from '@/components/ui';
import { Colors, Fonts } from '@/constants/theme';

// Données d'exemple — à remplacer par le profil du couple (Supabase).
const COUPLE = { names: 'Léa & Hugo', since: '24 août 2025', sinceDate: new Date(2025, 7, 24), signs: 'Bélier · Balance' };
const QUOTE = '« Vénus traverse votre maison commune : ce soir, la douceur dira plus que les mots. »';

function greeting(names: string) {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return { title: `Bonjour, ${names}`, sub: 'Un mot doux avant que la journée ne vous emporte ?' };
  if (h >= 11 && h < 18) return { title: `Belle journée, ${names}`, sub: 'Une pensée pour l’autre, là, maintenant ?' };
  if (h >= 18 && h < 23) return { title: `Bonsoir, ${names}`, sub: 'La journée se pose. Prenez un moment rien que pour vous deux.' };
  return { title: 'Vous ne dormez pas ?', sub: 'Si ça chauffe, le mode crise est là. Sinon… profitez de la nuit.' };
}

export default function Accueil() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const g = greeting(COUPLE.names);
  const days = useMemo(() => Math.floor((Date.now() - COUPLE.sinceDate.getTime()) / 86400000) + 1, []);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const drive = useDerivedValue(() => scrollY.value * 0.5);

  return (
    <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} style={{ flex: 1, backgroundColor: Colors.ink }} showsVerticalScrollIndicator={false}>
      <View style={{ height: 380, overflow: 'hidden' }}>
        <Movement width={width} height={380} zoom={1.45} focusX={592} focusY={960} drive={drive} />
        <LinearGradient
          colors={['rgba(11,6,7,0.75)', 'rgba(11,6,7,0.2)', 'rgba(11,6,7,0.88)', Colors.ink]}
          locations={[0, 0.38, 0.8, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.topRow, { top: insets.top + 8 }]}>
          <Text style={styles.brand}>1+1=3</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Notifications" style={styles.bell}>
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0" fill="none" stroke={Colors.text} strokeWidth={1.4} />
            </Svg>
            <View style={styles.dot} />
          </Pressable>
        </View>
        <View style={styles.heroText}>
          <Eyebrow>{`JOUR ${days} DE VOTRE HISTOIRE · DEPUIS LE ${COUPLE.since.toUpperCase()}`}</Eyebrow>
          <TitleSerif size={42} style={{ marginTop: 8 }}>{g.title}</TitleSerif>
          <Body color="#D8C6B5" size={13.5} style={{ marginTop: 8 }}>{g.sub}</Body>
        </View>
      </View>

      <View style={styles.content}>
        <Card>
          <View style={styles.rowBetween}>
            <Eyebrow color="#BFA088" style={{ fontSize: 10.5 }}>LE CIEL DE VOTRE COUPLE</Eyebrow>
            <Body size={11.5} color={Colors.textMuted}>{COUPLE.signs}</Body>
          </View>
          <TitleSerif size={25} style={{ marginTop: 10, lineHeight: 32 }}>{QUOTE}</TitleSerif>
        </Card>

        <SectionTitle>VOS ESPACES</SectionTitle>
        <SpaceCard eyebrow="COUPLE" title="Le calibre du couple" subtitle="Réserve de marche, balanciers, défis, attentions secrètes." icon={<CoupleRings size={28} />} onPress={() => router.push('/couple')} />
        <SpaceCard
          variant="wine"
          eyebrow="1+1=3"
          title="Les parcours du nous"
          subtitle="23 thèmes, 46 parcours : un podcast et des exercices pour chacun."
          icon={<HeartBeat width={24} height={36} />}
          onPress={() => router.push('/parcours')}
        />
        <SpaceCard eyebrow="ACTIVITÉ" title="Vivre quelque chose ensemble" subtitle="Des sorties choisies pour ce que vous êtes." icon={<SunMountain size={28} />} onPress={() => router.push('/activite')} />
        <SpaceCard variant="crisis" eyebrow="CRISE" title="Quand ça déraille" subtitle="Un protocole pas à pas pour se retrouver." icon={<EcgLine width={30} height={14} />} onPress={() => router.push('/crise')} />
        <SpaceCard
          variant="paper"
          eyebrow="SOUVENIRS"
          title="Notre histoire"
          subtitle="Photos, pensées de l’instant, moments : une date, un lieu, une phrase."
          icon={<PolaroidTilt size={28} />}
          onPress={() => router.push('/souvenirs')}
        />
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  topRow: { position: 'absolute', left: 22, right: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontFamily: Fonts.caps, fontSize: 11, letterSpacing: 4, color: Colors.champagne },
  bell: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(217,179,143,0.4)', backgroundColor: 'rgba(11,6,7,0.5)', alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', right: 9, top: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.crisisSoft },
  heroText: { position: 'absolute', left: 22, right: 22, bottom: 22 },
  content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40, gap: 14 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
