/**
 * Symboles animés de 1+1=3 (barre d'onglets et cartes « Vos espaces »).
 * - HeartBeat     : le cœur doré du logo qui bat (1+1=3)
 * - EcgLine       : la ligne de battement qui défile (Crise)
 * - CoupleRings   : deux anneaux dont l'intersection s'illumine d'or (Couple — animation D)
 * - SpinningArc   : petit arc doré qui tourne autour d'un médaillon
 * - Pulse         : halo qui s'élargit puis s'efface
 * - SunMountain   : soleil qui se lève au-dessus de la montagne (Activité)
 * - PolaroidTilt  : polaroïd avec un cœur qui se balance (Souvenirs)
 */
import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { Colors } from '@/constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const HEART = require('@/assets/images/brand/heart_gold.webp');

export const ECG_PATH = 'M0,20 L40,20 L48,20 L54,8 L60,32 L66,2 L72,36 L78,20 L120,20';
const LENS = 'M12,7.39 A5.5,5.5 0 0,1 12,16.61 A5.5,5.5 0 0,1 12,7.39 Z';

/** Cœur doré du logo qui bat (double battement, ~50 bpm). */
export function HeartBeat({ width = 30, height = 46 }: { width?: number; height?: number }) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withRepeat(
      withSequence(
        withTiming(1.14, { duration: 140, easing: Easing.out(Easing.quad) }),
        withTiming(0.98, { duration: 140 }),
        withTiming(1.1, { duration: 140 }),
        withTiming(1, { duration: 780, easing: Easing.inOut(Easing.quad) })
      ),
      -1
    );
  }, [s]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return <Animated.Image source={HEART} style={[{ width, height }, style]} resizeMode="contain" />;
}

/** Ligne de battement de cœur qui défile. */
export function EcgLine({
  width = 30,
  height = 14,
  color = Colors.crisis,
  strokeWidth = 4.5,
  duration = 1500,
}: {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
}) {
  const offset = useSharedValue(0);
  useEffect(() => {
    offset.value = withRepeat(withTiming(-210.4, { duration, easing: Easing.linear }), -1);
  }, [offset, duration]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: offset.value }));
  return (
    <Svg width={width} height={height} viewBox="0 0 120 40">
      <Path d={ECG_PATH} fill="none" stroke={color} strokeOpacity={0.3} strokeWidth={3} />
      <AnimatedPath
        d={ECG_PATH}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        // longueur réelle du tracé ≈ 210,4 : un segment lumineux de ~23 % qui défile
        strokeDasharray="48.4 162"
        animatedProps={props}
      />
    </Svg>
  );
}

/** Animation D : l'espace commun des deux anneaux s'illumine d'or. */
export function CoupleRings({ size = 24, color = Colors.champagne }: { size?: number; color?: string }) {
  const glow = useSharedValue(0);
  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1440, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 480 }),
        withTiming(0, { duration: 1280, easing: Easing.inOut(Easing.quad) })
      ),
      -1
    );
  }, [glow]);
  const lensProps = useAnimatedProps(() => ({ fillOpacity: glow.value }));
  const ringProps = useAnimatedProps(() => ({ opacity: 1 - glow.value * 0.45 }));
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <AnimatedPath d={LENS} fill={Colors.champagneLight} animatedProps={lensProps} />
      <AnimatedG animatedProps={ringProps}>
        <Circle cx={9} cy={12} r={5.5} fill="none" stroke={color} strokeWidth={1.3} />
        <Circle cx={15} cy={12} r={5.5} fill="none" stroke={color} strokeWidth={1.3} />
      </AnimatedG>
    </Svg>
  );
}

/** Petit arc doré qui tourne autour d'un médaillon. */
export function SpinningArc({ size = 42, duration = 3000 }: { size?: number; duration?: number }) {
  const r = useSharedValue(0);
  useEffect(() => {
    r.value = withRepeat(withTiming(360, { duration, easing: Easing.linear }), -1);
  }, [r, duration]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value}deg` }] }));
  const rad = size / 2 - 1;
  const circ = 2 * Math.PI * rad;
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke="rgba(217,154,126,0.35)" strokeWidth={1.5} />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={rad}
          fill="none"
          stroke={Colors.champagneLight}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={`${circ * 0.22} ${circ * 0.78}`}
        />
      </Svg>
    </Animated.View>
  );
}

/** Halo qui s'élargit puis s'efface autour d'un médaillon. */
export function Pulse({ size, color, duration = 1500 }: { size: number; color: string; duration?: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withRepeat(withTiming(1, { duration, easing: Easing.out(Easing.quad) }), -1);
  }, [p, duration]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.55 * (1 - p.value),
    transform: [{ scale: 1 + p.value * 0.6 }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]}
    />
  );
}

/** Soleil qui monte et descend au-dessus de la montagne. */
export function SunMountain({ size = 26, color = Colors.champagne }: { size?: number; color?: string }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [y]);
  const sunProps = useAnimatedProps(() => ({ cy: 7.5 - y.value * 3, opacity: 0.55 + y.value * 0.45 }));
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 20l6-10 4 6 3-4 5 8z" fill="none" stroke={color} strokeWidth={1.3} strokeLinejoin="round" />
      <AnimatedCircle cx={17} r={2} fill="none" stroke={color} strokeWidth={1.3} animatedProps={sunProps} />
    </Svg>
  );
}

/** Polaroïd avec un cœur, qui se balance (Souvenirs). */
export function PolaroidTilt({ size = 28 }: { size?: number }) {
  const r = useSharedValue(-7);
  useEffect(() => {
    r.value = withRepeat(withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [r]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value}deg` }] }));
  return (
    <Animated.View style={style}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Rect x={5} y={3.5} width={14} height={17} rx={1.2} fill="none" stroke="#8E1B2A" strokeWidth={1.3} />
        <Rect x={7} y={5.5} width={10} height={9} rx={0.5} fill="none" stroke="#8E1B2A" strokeWidth={1.3} />
        <Path d="M12 12.6s-2.6-1.6-2.6-3.3a1.4 1.4 0 0 1 2.6-.7 1.4 1.4 0 0 1 2.6.7c0 1.7-2.6 3.3-2.6 3.3z" fill="#C2283E" />
      </Svg>
    </Animated.View>
  );
}

/** Médaillon rond (Crise, Couple, 1+1=3). */
export function Medallion({
  size,
  background,
  borderColor,
  children,
  style,
}: {
  size: number;
  background: string;
  borderColor: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: background,
          borderWidth: 1.5,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      {children}
    </View>
  );
}

