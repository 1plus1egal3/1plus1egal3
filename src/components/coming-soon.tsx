/** Écran d'attente élégant pour les espaces encore en conception. */
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Body, Card, Eyebrow, TitleSerif } from './ui';
import { Colors } from '@/constants/theme';

export function ComingSoon({
  eyebrow,
  title,
  intro,
  icon,
  planned,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  icon: React.ReactNode;
  planned: string[];
  children?: React.ReactNode;
}) {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.ink }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
        <View style={styles.iconWrap}>{icon}</View>
        <Eyebrow>{eyebrow}</Eyebrow>
        <TitleSerif size={40}>{title}</TitleSerif>
        <Body>{intro}</Body>
        {children}
        <Card style={{ gap: 10 }}>
          <Eyebrow color="#BFA088" style={{ fontSize: 10 }}>EN CONCEPTION</Eyebrow>
          {planned.map((p) => (
            <Body key={p} color={Colors.text}>{`·  ${p}`}</Body>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconWrap: { width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderColor: 'rgba(217,179,143,0.35)', alignItems: 'center', justifyContent: 'center' },
});
