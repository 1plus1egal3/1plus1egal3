import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/tab-bar';
import { Colors } from '@/constants/theme';

/** Ordre validé : Accueil · Crise · 1+1=3 · Couple · Activité (+ Souvenirs, sans onglet). */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: Colors.ink } }}>
      <Tabs.Screen name="accueil" />
      <Tabs.Screen name="crise" />
      <Tabs.Screen name="parcours" />
      <Tabs.Screen name="couple" />
      <Tabs.Screen name="activite" />
      <Tabs.Screen name="souvenirs" options={{ href: null }} />
    </Tabs>
  );
}
