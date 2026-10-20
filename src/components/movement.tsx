/**
 * Le mouvement horloger photoréaliste de 1+1=3.
 * Photo macro (1170 × 2096) + pièces découpées animées :
 *  - la cage du tourbillon tourne (vue légèrement en perspective : ellipse 0,9)
 *  - le balancier oscille sous son coq fixe
 *  - la roue en acier tourne en sens inverse
 * `drive` (en degrés, ex. lié au scroll) accélère le rouage.
 */
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const IMG_W = 1170;
const IMG_H = 2096;

const SRC = {
  base: require('@/assets/images/movement/mv_base.jpg'),
  tourb: require('@/assets/images/movement/mv_tourb.webp'),
  balance: require('@/assets/images/movement/mv_balance.webp'),
  steel: require('@/assets/images/movement/mv_steel.webp'),
  cock: require('@/assets/images/movement/mv_cock.webp'),
};

type Props = {
  width: number;
  height: number;
  /** 1 = l'image couvre la hauteur ; > 1 = zoom */
  zoom?: number;
  /** Point de l'image (en px image) placé au centre du cadre */
  focusX?: number;
  focusY?: number;
  /** Rotation additionnelle du rouage (degrés), typiquement pilotée par le scroll */
  drive?: SharedValue<number>;
};

export function Movement({ width, height, zoom = 1, focusX = 585, focusY = 1048, drive }: Props) {
  const s = Math.max(width / IMG_W, height / IMG_H) * zoom;
  const left = width / 2 - focusX * s;
  const top = height / 2 - focusY * s;
  const box = (x: number, y: number, w: number, h: number) => ({ position: 'absolute' as const, left: x * s, top: y * s, width: w * s, height: h * s });

  const idle = useSharedValue(0);
  const swing = useSharedValue(-34);
  useEffect(() => {
    idle.value = withRepeat(withTiming(360, { duration: 60000, easing: Easing.linear }), -1);
    swing.value = withRepeat(withTiming(34, { duration: 380, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [idle, swing]);

  const tourbStyle = useAnimatedStyle(() => {
    const d = drive ? drive.value : 0;
    return { transform: [{ scaleY: 0.9 }, { rotate: `${idle.value + d}deg` }, { scaleY: 1 / 0.9 }] };
  });
  const steelStyle = useAnimatedStyle(() => {
    const d = drive ? drive.value : 0;
    return { transform: [{ rotate: `${-(idle.value * 2) - d * 2.5}deg` }] };
  });
  const balanceStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${swing.value}deg` }] }));

  return (
    <View style={{ width, height, overflow: 'hidden', backgroundColor: '#070304' }}>
      <View style={{ position: 'absolute', left, top, width: IMG_W * s, height: IMG_H * s }}>
        <Image source={SRC.base} style={StyleSheet.absoluteFill} />
        <Animated.Image source={SRC.tourb} style={[box(340, 675, 504, 504), tourbStyle]} />
        <Animated.Image source={SRC.steel} style={[box(1036, 819, 252, 252), steelStyle]} />
        <Animated.Image source={SRC.balance} style={[box(328, 1198, 524, 524), balanceStyle]} />
        <Image source={SRC.cock} style={box(432, 1322, 595, 364)} />
      </View>
    </View>
  );
}
