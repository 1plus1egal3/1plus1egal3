/** 03 · Les parcours du nous — catalogue des 23 thèmes. */
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { HeartBeat, Medallion } from '@/components/animated-icons';
import { Body, Eyebrow, TitleSerif } from '@/components/ui';
import { Colors, Fonts } from '@/constants/theme';
import { searchThemes, themeNumber } from '@/data/themes';

export default function Catalogue() {
  const [q, setQ] = useState('');
  const list = searchThemes(q);

  const header = (
    <View style={{ gap: 14, paddingBottom: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Medallion size={54} background="#2A0A10" borderColor="rgba(217,174,136,0.6)">
          <HeartBeat width={24} height={37} />
        </Medallion>
        <View>
          <Eyebrow>1+1=3 · LES PARCOURS DU NOUS</Eyebrow>
          <TitleSerif size={36}>Vos thèmes</TitleSerif>
        </View>
      </View>
      <Body>23 thèmes, 46 parcours. Dans chacun, un podcast à écouter et un cahier d’exercices à faire, seul ou à deux.</Body>

      <View style={styles.search}>
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Circle cx={11} cy={11} r={6.5} fill="none" stroke="#9C8C80" strokeWidth={1.4} />
          <Path d="M16 16l4.5 4.5" stroke="#9C8C80" strokeWidth={1.4} />
        </Svg>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Jalousie, belle-famille, budget…"
          placeholderTextColor="#7E6F64"
          style={styles.input}
          accessibilityLabel="Rechercher un thème"
        />
      </View>

      {/* Accès de sécurité permanent, indépendant de l'ordre alphabétique */}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/parcours/[theme]', params: { theme: 'violence' } })}
        style={styles.safety}>
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" fill="none" stroke={Colors.crisis} strokeWidth={1.4} />
        </Svg>
        <Text style={styles.safetyText}>
          Tu ne te sens pas en sécurité dans ta relation ? <Text style={{ fontFamily: Fonts.bodySemi, color: '#FFD3CB' }}>Accès confidentiel</Text>
        </Text>
      </Pressable>
      {list.length === 0 && (
        <TitleSerif size={20} color={Colors.textSoft} style={{ textAlign: 'center', paddingVertical: 20 }}>
          Aucun thème ne correspond. Essayez un autre mot.
        </TitleSerif>
      )}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.ink }}>
      <FlatList
        data={list}
        keyExtractor={(t) => t.slug}
        ListHeaderComponent={header}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/parcours/[theme]', params: { theme: item.slug } })}
            style={styles.row}>
            <Text style={[styles.num, item.safety && { color: Colors.crisis }]}>{themeNumber(item.slug)}</Text>
            <View style={{ flex: 1 }}>
              <TitleSerif size={27}>{item.name}</TitleSerif>
              <Body size={12.5} color={Colors.textMuted} style={{ marginTop: 6 }}>{item.parcours[0].title}</Body>
              <Body size={12.5} color={Colors.textMuted}>{item.parcours[1].title}</Body>
            </View>
            <Svg width={18} height={18} viewBox="0 0 24 24" style={{ marginTop: 10 }}>
              <Path d="M9 6l6 6-6 6" fill="none" stroke={Colors.eyebrow} strokeWidth={1.4} />
            </Svg>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, paddingHorizontal: 16, borderRadius: 25, backgroundColor: Colors.card, borderWidth: 1, borderColor: 'rgba(217,179,143,0.28)' },
  input: { flex: 1, color: Colors.text, fontFamily: Fonts.body, fontSize: 14 },
  safety: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(214,110,110,0.45)', backgroundColor: '#1E080B' },
  safetyText: { flex: 1, color: Colors.text, fontFamily: Fonts.body, fontSize: 13, lineHeight: 18 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(217,179,143,0.16)' },
  num: { width: 34, paddingTop: 6, fontFamily: Fonts.caps, fontSize: 13, letterSpacing: 0.8, color: Colors.eyebrow },
});

