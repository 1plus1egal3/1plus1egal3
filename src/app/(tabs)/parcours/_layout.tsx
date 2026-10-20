import Stack from 'expo-router/stack';

import { Colors } from '@/constants/theme';

export default function ParcoursLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.ink } }} />;
}
