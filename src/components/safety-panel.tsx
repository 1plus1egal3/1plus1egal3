import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { SAFETY_NUMBERS } from '@/data/themes';

/** Encadré de sécurité du thème Violence : parcours à faire seul·e + numéros d'urgence. */
export function SafetyPanel() {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>
        Ces parcours s’écoutent <Text style={styles.strong}>seul·e</Text>, jamais en exercice à deux. Si tu es en danger, appelle :
      </Text>
      {SAFETY_NUMBERS.map((n) => (
        <Pressable key={n.number} accessibilityRole="button" onPress={() => Linking.openURL(`tel:${n.number}`)} style={styles.row}>
          <Text style={styles.num}>{n.number}</Text>
          <Text style={styles.label}>{n.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(214,110,110,0.45)', backgroundColor: '#1E080B', gap: 10 },
  text: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 20, color: '#E4C9C2' },
  strong: { fontFamily: Fonts.bodySemi, color: '#FFD3CB' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  num: { fontFamily: Fonts.capsBold, fontSize: 18, color: '#FFD3CB', minWidth: 52 },
  label: { flex: 1, fontFamily: Fonts.body, fontSize: 12.5, color: '#E4C9C2' },
});

