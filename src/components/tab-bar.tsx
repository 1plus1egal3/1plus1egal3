/**
 * Barre d'onglets 1+1=3 (validée) :
 * Accueil · Crise (médaillon ECG) · 1+1=3 (cœur qui bat, surélevé) · Couple (médaillon grenat, arc doré) · Activité
 */
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Colors, Fonts } from '@/constants/theme';

import { CoupleRings, EcgLine, HeartBeat, Medallion, Pulse, SpinningArc, SunMountain } from './animated-icons';

const ORDER = ['accueil', 'crise', 'parcours', 'couple', 'activite'] as const;

export function TabBar({ state, navigateToTab, insets }: BottomTabBarProps) {
  const current = state.routes[state.index]?.name;
  const go = (name: string) => {
    const route = state.routes.find((r) => r.name === name);
    if (route) navigateToTab(route.key);
  };
  const isOn = (name: string) => current === name || (name === 'parcours' && current?.startsWith('parcours'));

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      {ORDER.map((name) => {
        const on = isOn(name);
        if (name === 'parcours') {
          return (
            <Pressable key={name} accessibilityRole="button" accessibilityLabel="1+1=3" onPress={() => go(name)} style={styles.item}>
              <View style={styles.centerWrap}>
                <Medallion size={66} background="#2A0A10" borderColor={Colors.roseGoldLight} style={styles.centerMedallion}>
                  <HeartBeat width={30} height={46} />
                </Medallion>
              </View>
              <Text style={[styles.centerLabel]}>1+1=3</Text>
            </Pressable>
          );
        }
        if (name === 'crise') {
          return (
            <Pressable key={name} accessibilityRole="button" accessibilityLabel="Mode crise" onPress={() => go(name)} style={styles.item}>
              <View style={styles.medalWrap}>
                <Pulse size={42} color="rgba(214,70,92,0.6)" />
                <Medallion size={42} background={Colors.wineCrisis} borderColor="#D99A7E">
                  <EcgLine width={28} height={16} color="#FFE3DA" />
                </Medallion>
              </View>
              <Text style={[styles.label, { color: '#F2B9B9', fontFamily: Fonts.bodySemi }]}>Crise</Text>
            </Pressable>
          );
        }
        if (name === 'couple') {
          return (
            <Pressable key={name} accessibilityRole="button" accessibilityLabel="Couple" onPress={() => go(name)} style={styles.item}>
              <View style={styles.medalWrap}>
                <Pulse size={42} color="rgba(226,194,155,0.5)" duration={2200} />
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.wineDeep, alignItems: 'center', justifyContent: 'center' }}>
                  <SpinningArc size={42} />
                  <CoupleRings size={24} />
                </View>
              </View>
              <Text style={[styles.label, { color: '#E8C7A4', fontFamily: Fonts.bodySemi }]}>Couple</Text>
            </Pressable>
          );
        }
        const color = on ? '#E8C7A4' : '#9C8C80';
        return (
          <Pressable key={name} accessibilityRole="button" accessibilityLabel={name === 'accueil' ? 'Accueil' : 'Activité'} onPress={() => go(name)} style={styles.item}>
            {name === 'accueil' ? (
              <Svg width={23} height={23} viewBox="0 0 24 24">
                <Path d="M4 11l8-7 8 7v9H4z" fill="none" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
              </Svg>
            ) : (
              <SunMountain size={23} color={color} />
            )}
            <Text style={[styles.label, { color, fontFamily: on ? Fonts.bodySemi : Fonts.bodyMedium }]}>{name === 'accueil' ? 'Accueil' : 'Activité'}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingHorizontal: 8,
    backgroundColor: Colors.navBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(217,179,143,0.2)',
  },
  item: { width: 66, alignItems: 'center', gap: 5 },
  label: { fontSize: 11 },
  medalWrap: { width: 42, height: 42, marginTop: -8, alignItems: 'center', justifyContent: 'center' },
  centerWrap: { marginTop: -34 },
  centerMedallion: {
    borderColor: Colors.roseGoldLight,
    shadowColor: '#C9956F',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  centerLabel: { fontFamily: Fonts.capsBold, fontSize: 11, letterSpacing: 1.3, color: Colors.champagneLight },
});
