/**
 * 01 · Intro (validée).
 * Le mouvement horloger photoréaliste plein écran ; au scroll, le rouage accélère,
 * la caméra plonge, les deux cœurs apparaissent (MOI, TOI), se relient (NOUS),
 * puis le logo 1+1=3 se révèle.
 */
import { router } from 'expo-router';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Movement } from '@/components/movement';
import { Body, GoldButton, TitleSerif, WineButton } from '@/components/ui';
import { Colors, Fonts } from '@/constants/theme';

const CHAPTERS = [
  { a: 0.08, b: 0.26, eyebrow: 'MOI', title: 'Mon cœur, avec toute son histoire.', body: 'Mes émotions, mes besoins, mes blessures. Me comprendre avant de parler de nous.' },
  { a: 0.26, b: 0.44, eyebrow: 'TOI', title: 'Ton cœur, que j’apprends à lire.', body: 'Ta façon d’aimer, de te protéger, de demander. Te découvrir sans t’interpréter.' },
  { a: 0.44, b: 0.62, eyebrow: 'NOUS', title: 'Nos engrenages.', body: 'Communication, complicité, désir, réparation : ce qui tourne entre nous, et comment le faire tourner juste.' },
  { a: 0.62, b: 0.8, eyebrow: 'NOTRE VIE', title: 'Des souvenirs, pas seulement des mots.', body: 'Des jeux, des rituels, des aventures choisies pour ce que vous êtes vraiment.' },
  { a: 0.8, b: 9, eyebrow: '1 + 1 = 3', title: 'Deux personnes ne fusionnent pas.', body: 'Elles créent ce qui n’existait pas avant elles : leur relation.' },
];

function Chapter({ p, i }: { p: SharedValue<number>; i: number }) {
  const c = CHAPTERS[i];
  const style = useAnimatedStyle(() => {
    const o =
      interpolate(p.value, [c.a, c.a + 0.03], [0, 1], Extrapolation.CLAMP) *
      interpolate(p.value, [c.b - 0.03, c.b], [1, 0], Extrapolation.CLAMP);
    return { opacity: o, transform: [{ translateY: (1 - o) * 16 }] };
  });
  return (
    <Animated.View style={[styles.chapter, style]} pointerEvents="none">
      <Text style={styles.chapterEyebrow}>{c.eyebrow}</Text>
      <View style={styles.chapterRule} />
      <TitleSerif size={32} style={{ textAlign: 'center', marginTop: 14 }}>{c.title}</TitleSerif>
      <Body style={{ textAlign: 'center', marginTop: 12 }}>{c.body}</Body>
    </Animated.View>
  );
}

export default function Intro() {
  const { width, height } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const travel = height * 3.4;
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const p = useDerivedValue(() => Math.min(1, Math.max(0, scrollY.value / travel)));
  const drive = useDerivedValue(() => p.value * 720);

  const camera = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(p.value, [0, 0.4, 0.62, 0.8, 1], [1, 1.25, 1.9, 1.2, 1], Extrapolation.CLAMP) }],
  }));
  const veil = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [0, 0.44, 0.58, 0.8, 0.9], [0.32, 0.3, 0.18, 0.2, 0.78], Extrapolation.CLAMP),
  }));
  const intro = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [0, 0.06], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(p.value, [0, 0.06], [0, -30], Extrapolation.CLAMP) }],
  }));
  const gold = useAnimatedStyle(() => {
    const moi = interpolate(p.value, [0.08, 0.16], [0, 1], Extrapolation.CLAMP);
    const fin = interpolate(p.value, [0.8, 0.9], [0, 1], Extrapolation.CLAMP);
    const x = interpolate(p.value, [0.26, 0.34, 0.44, 0.58], [0, -70, -70, -32], Extrapolation.CLAMP);
    return { opacity: moi * (1 - fin), transform: [{ translateX: x }, { scale: 0.7 + 0.3 * moi }] };
  });
  const red = useAnimatedStyle(() => {
    const toi = interpolate(p.value, [0.26, 0.34], [0, 1], Extrapolation.CLAMP);
    const fin = interpolate(p.value, [0.8, 0.9], [0, 1], Extrapolation.CLAMP);
    const x = interpolate(p.value, [0.44, 0.58], [70, 32], Extrapolation.CLAMP);
    return { opacity: toi * (1 - fin), transform: [{ translateX: x }, { translateY: -24 }, { scale: 0.7 + 0.3 * toi }] };
  });
  const logo = useAnimatedStyle(() => {
    const fin = interpolate(p.value, [0.82, 0.92], [0, 1], Extrapolation.CLAMP);
    return { opacity: fin, transform: [{ scale: 0.9 + 0.1 * fin }] };
  });
  const hint = useAnimatedStyle(() => ({ opacity: interpolate(p.value, [0, 0.05], [1, 0], Extrapolation.CLAMP) }));

  return (
    <View style={{ flex: 1, backgroundColor: Colors.ink }}>
      {/* Couche fixe : le mouvement et la mise en scène */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[StyleSheet.absoluteFill, camera]}>
          <Movement width={width} height={height} focusX={592} focusY={960} drive={drive} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.ink }, veil]} />
        <View style={[styles.bottomShade, { height: height * 0.45 }]} />

        <Animated.View style={[styles.introBlock, { top: height * 0.3 }, intro]}>
          <Text style={styles.bigTitle}>1+1=3</Text>
          <TitleSerif size={23} color={Colors.text} style={{ textAlign: 'center', marginTop: 16 }}>
            Deux âmes. Un nous. Infiniment plus.
          </TitleSerif>
        </Animated.View>

        <View style={[styles.hearts, { top: height * 0.28 }]}>
          <Animated.Image source={require('@/assets/images/brand/heart_gold.webp')} style={[styles.heart, gold]} resizeMode="contain" />
          <Animated.Image source={require('@/assets/images/brand/heart_red.webp')} style={[styles.heart, red]} resizeMode="contain" />
        </View>

        <Animated.View style={[styles.logoWrap, { top: height * 0.16 }, logo]}>
          <Image source={require('@/assets/images/brand/logo_main.jpg')} style={{ width: width * 0.8, height: width * 0.8, mixBlendMode: 'lighten' }} />
        </Animated.View>

        <View style={[styles.chapters, { top: height * 0.64 }]}>
          {CHAPTERS.map((_, i) => (
            <Chapter key={i} p={p} i={i} />
          ))}
        </View>

        <Animated.View style={[styles.hint, hint]}>
          <Text style={styles.hintText}>FAITES DÉFILER</Text>
          <View style={styles.hintLine} />
        </Animated.View>
      </View>

      {/* Scroll qui pilote la scène, puis l'appel à l'action */}
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
        <View style={{ height: travel + height }} />
        <SafeAreaView edges={['bottom']} style={styles.cta}>
          <TitleSerif size={38} style={{ textAlign: 'center' }}>Prenez soin de ce qui existe entre vous.</TitleSerif>
          <Body style={{ textAlign: 'center', marginBottom: 14 }}>Un écrin privé pour deux. Un seul abonnement pour vous deux.</Body>
          <GoldButton label="CRÉER NOTRE ÉCRIN" onPress={() => router.replace('/accueil')} />
          <WineButton label="J’AI REÇU UNE INVITATION" onPress={() => router.replace('/accueil')} />
          <Body size={12} color={Colors.textMuted} style={{ textAlign: 'center', marginTop: 8 }}>
            Pas une application de rencontres. Pas un substitut à une thérapie.
          </Body>
        </SafeAreaView>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomShade: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11,6,7,0.75)' },
  introBlock: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  bigTitle: { fontFamily: Fonts.serifItalic, fontSize: 104, color: Colors.champagneLight, textShadowColor: 'rgba(201,149,111,0.5)', textShadowRadius: 30 },
  hearts: { position: 'absolute', left: 0, right: 0, height: 190, alignItems: 'center', justifyContent: 'center' },
  heart: { position: 'absolute', width: 124, height: 188 },
  logoWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  chapters: { position: 'absolute', left: 30, right: 30, height: 230 },
  chapter: { position: 'absolute', left: 0, right: 0, top: 0, alignItems: 'center' },
  chapterEyebrow: { fontFamily: Fonts.caps, fontSize: 12, letterSpacing: 4, color: Colors.eyebrow },
  chapterRule: { width: 36, height: 1, backgroundColor: 'rgba(217,179,143,0.6)', marginTop: 12 },
  hint: { position: 'absolute', bottom: 36, left: 0, right: 0, alignItems: 'center', gap: 8 },
  hintText: { fontFamily: Fonts.caps, fontSize: 11, letterSpacing: 3, color: Colors.eyebrow },
  hintLine: { width: 1, height: 34, backgroundColor: Colors.eyebrow },
  cta: { backgroundColor: Colors.ink, paddingHorizontal: 26, paddingTop: 36, paddingBottom: 40, gap: 16 },
});
