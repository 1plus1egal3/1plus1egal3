import { router } from 'expo-router';
import { Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export function BackButton({ color = '#F4ECE2', border = 'rgba(217,179,143,0.35)', onPress }: { color?: string; border?: string; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Retour"
      onPress={onPress ?? (() => (router.canGoBack() ? router.back() : router.replace('/accueil')))}
      style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: border, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={20} height={20} viewBox="0 0 24 24">
        <Path d="M15 6l-6 6 6 6" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}
