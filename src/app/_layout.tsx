import { useFonts } from 'expo-font';
import { DarkTheme, ThemeProvider } from 'expo-router';
import Stack from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: Colors.ink, card: Colors.ink, text: Colors.text, primary: Colors.champagne },
};

export default function RootLayout() {
  // Seules les graisses utilisées sont chargées (évite d'embarquer toutes les variantes).
  const [ready] = useFonts({
    Cinzel_700Bold: require('@expo-google-fonts/cinzel/700Bold/Cinzel_700Bold.ttf'),
    Cinzel_800ExtraBold: require('@expo-google-fonts/cinzel/800ExtraBold/Cinzel_800ExtraBold.ttf'),
    CormorantGaramond_400Regular_Italic: require('@expo-google-fonts/cormorant-garamond/400Regular_Italic/CormorantGaramond_400Regular_Italic.ttf'),
    CormorantGaramond_500Medium_Italic: require('@expo-google-fonts/cormorant-garamond/500Medium_Italic/CormorantGaramond_500Medium_Italic.ttf'),
    Montserrat_400Regular: require('@expo-google-fonts/montserrat/400Regular/Montserrat_400Regular.ttf'),
    Montserrat_500Medium: require('@expo-google-fonts/montserrat/500Medium/Montserrat_500Medium.ttf'),
    Montserrat_600SemiBold: require('@expo-google-fonts/montserrat/600SemiBold/Montserrat_600SemiBold.ttf'),
  });

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.ink } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
