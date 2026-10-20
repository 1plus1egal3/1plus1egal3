/** 04 · Souvenirs — « Notre histoire » (écran clair, papier ivoire). */
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { BackButton } from '@/components/back-button';
import { TitleSerif } from '@/components/ui';
import { Colors, Fonts } from '@/constants/theme';
import { addSouvenir, listSouvenirs, SAMPLE_SOUVENIRS, type Souvenir, type SouvenirKind } from '@/lib/souvenirs';

const SINCE = new Date(2025, 7, 24); // à remplacer par la date du couple (Supabase)
const ME = 'Léa'; // à remplacer par le prénom de l'utilisateur connecté

const todayLabel = () => new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

function PhotoPlaceholder({ seed }: { seed: number }) {
  const bg = ['#C98E73', '#7A2A33', '#B97A63'][seed % 3];
  const art = [
    'M0,200 L0,140 C60,110 90,150 140,120 C190,90 230,130 334,100 L334,200 Z',
    'M0,200 L0,150 L60,120 L110,150 L170,95 L240,140 L334,110 L334,200 Z',
    'M0,200 L0,160 C80,130 160,170 240,135 C280,120 310,130 334,125 L334,200 Z',
  ][seed % 3];
  return (
    <View style={[styles.photo, { backgroundColor: bg }]}>
      <Svg width="100%" height="100%" viewBox="0 0 334 200" preserveAspectRatio="none">
        <Circle cx={seed % 2 ? 90 : 250} cy={62} r={26} fill="rgba(255,236,214,0.55)" />
        <Path d={art} fill="rgba(58,11,19,0.35)" />
      </Svg>
    </View>
  );
}

function Stat({ value, label, dark }: { value: number; label: string; dark?: boolean }) {
  return (
    <View style={[styles.stat, dark ? { backgroundColor: Colors.paperInk } : { backgroundColor: Colors.paperCard, borderWidth: 1, borderColor: Colors.champagne }]}>
      <Text style={[styles.statValue, { color: dark ? '#F7DFC6' : Colors.paperInk }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: dark ? '#E8C7A4' : Colors.paperMuted }]}>{label}</Text>
    </View>
  );
}

export default function Souvenirs() {
  const [items, setItems] = useState<Souvenir[]>(SAMPLE_SOUVENIRS);
  const [composing, setComposing] = useState(false);
  const [kind, setKind] = useState<SouvenirKind>('photo');
  const [date, setDate] = useState(todayLabel());
  const [place, setPlace] = useState('');
  const [phrase, setPhrase] = useState('');
  const [text, setText] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();

  useEffect(() => {
    listSouvenirs().then(setItems);
  }, []);

  const days = useMemo(() => Math.floor((Date.now() - SINCE.getTime()) / 86400000) + 1, []);
  const nPhotos = items.filter((x) => x.kind === 'photo').length;
  const nThoughts = items.filter((x) => x.kind === 'pensee').length;

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (!res.canceled) setPhotoUri(res.assets[0].uri);
  };

  const save = async () => {
    const s = await addSouvenir(undefined, {
      kind,
      date,
      place: place || 'Quelque part',
      phrase: phrase || (kind === 'pensee' ? '' : 'Un moment à nous.'),
      text: kind === 'pensee' ? text || 'Je pense à toi.' : undefined,
      photoUri: kind === 'photo' ? photoUri : undefined,
      author: ME,
    });
    setItems([s, ...items]);
    setComposing(false);
    setPlace('');
    setPhrase('');
    setText('');
    setPhotoUri(undefined);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.paper }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <BackButton color={Colors.paperInk} border="rgba(58,11,19,0.3)" />
          <View>
            <Text style={styles.eyebrow}>SOUVENIRS</Text>
            <TitleSerif size={38} color={Colors.paperInk}>Notre histoire</TitleSerif>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Stat value={days} label="JOURS ENSEMBLE" dark />
          <Stat value={nPhotos} label={nPhotos > 1 ? 'PHOTOS' : 'PHOTO'} />
          <Stat value={nThoughts} label={nThoughts > 1 ? 'PENSÉES' : 'PENSÉE'} />
        </View>
        <TitleSerif size={19} color="#6E4A3C" style={{ textAlign: 'center', lineHeight: 26 }}>
          {`${days} jours… et combien de souvenirs encore à créer ? Ce week-end, offrez-vous-en un.`}
        </TitleSerif>

        {!composing ? (
          <Pressable accessibilityRole="button" onPress={() => setComposing(true)} style={styles.addBtn}>
            <Text style={styles.addText}>+ AJOUTER UN SOUVENIR</Text>
          </Pressable>
        ) : (
          <View style={styles.composer}>
            <View style={styles.kinds}>
              {(
                [
                  ['photo', 'PHOTO'],
                  ['pensee', 'PENSÉE'],
                  ['moment', 'MOMENT'],
                ] as const
              ).map(([k, l]) => (
                <Pressable key={k} accessibilityRole="button" onPress={() => setKind(k)} style={[styles.kind, kind === k && { backgroundColor: Colors.paperInk }]}>
                  <Text style={[styles.kindText, { color: kind === k ? '#F4DFC8' : '#6E4A3C' }]}>{l}</Text>
                </Pressable>
              ))}
            </View>

            {kind === 'photo' &&
              (photoUri ? (
                <Pressable onPress={pickPhoto}>
                  <Image source={{ uri: photoUri }} style={styles.photo} />
                </Pressable>
              ) : (
                <Pressable accessibilityRole="button" onPress={pickPhoto} style={styles.dropzone}>
                  <Svg width={28} height={28} viewBox="0 0 24 24">
                    <Rect x={3} y={6} width={18} height={14} rx={2} fill="none" stroke={Colors.paperMuted} strokeWidth={1.4} />
                    <Circle cx={12} cy={13} r={3.5} fill="none" stroke={Colors.paperMuted} strokeWidth={1.4} />
                    <Path d="M8 6l1.5-2h5L16 6" fill="none" stroke={Colors.paperMuted} strokeWidth={1.4} />
                  </Svg>
                  <Text style={styles.dropText}>Ajouter une photo</Text>
                </Pressable>
              ))}

            {kind === 'pensee' && (
              <View>
                <Text style={styles.label}>LA PENSÉE DE L’INSTANT</Text>
                <TextInput
                  multiline
                  value={text}
                  onChangeText={setText}
                  placeholder="Ce que tu ressens pour l’autre, là, maintenant…"
                  placeholderTextColor="#B59A88"
                  style={[styles.field, styles.thought]}
                />
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>DATE</Text>
                <TextInput value={date} onChangeText={setDate} style={styles.field} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>LIEU</Text>
                <TextInput value={place} onChangeText={setPlace} placeholder="Où étiez-vous ?" placeholderTextColor="#B59A88" style={styles.field} />
              </View>
            </View>
            <View>
              <Text style={styles.label}>UNE PHRASE</Text>
              <TextInput
                value={phrase}
                onChangeText={setPhrase}
                placeholder="Ce qu’on veut retenir de ce moment"
                placeholderTextColor="#B59A88"
                style={[styles.field, { fontFamily: Fonts.serifItalic, fontSize: 18 }]}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable accessibilityRole="button" onPress={() => setComposing(false)} style={[styles.formBtn, styles.cancel]}>
                <Text style={[styles.formBtnText, { color: Colors.paperInk }]}>ANNULER</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={save} style={[styles.formBtn, { backgroundColor: Colors.paperInk }]}>
                <Text style={[styles.formBtnText, { color: '#F4DFC8' }]}>GARDER CE SOUVENIR</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
          <Text style={styles.eyebrow}>NOTRE HISTOIRE, MOMENT APRÈS MOMENT</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(58,11,19,0.18)' }} />
        </View>

        {items.map((it, i) => (
          <View key={it.id} style={[styles.polaroid, { transform: [{ rotate: `${[-1.2, 1, -0.6, 0.8][i % 4]}deg` }] }]}>
            {it.kind === 'photo' && (it.photoUri ? <Image source={{ uri: it.photoUri }} style={styles.photo} /> : <PhotoPlaceholder seed={i} />)}
            {it.kind === 'pensee' && (
              <View style={{ paddingTop: 10, paddingHorizontal: 8 }}>
                <Text style={[styles.eyebrow, { color: '#8E1B2A' }]}>LA PENSÉE DE L’INSTANT</Text>
                <TitleSerif size={24} color={Colors.paperInk} style={{ marginTop: 10, lineHeight: 31 }}>{`« ${it.text} »`}</TitleSerif>
              </View>
            )}
            {!!it.phrase && <TitleSerif size={22} color={Colors.paperInk} style={{ marginTop: 14, lineHeight: 27 }}>{it.phrase}</TitleSerif>}
            <View style={styles.meta}>
              <Text style={styles.metaText}>{it.date}</Text>
              <Text style={styles.metaText}>· {it.place}</Text>
              <Text style={[styles.metaText, { flex: 1, textAlign: 'right' }]}>{it.author}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontFamily: Fonts.caps, fontSize: 11, letterSpacing: 2.6, color: Colors.paperMuted },
  stat: { flex: 1, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 6, alignItems: 'center' },
  statValue: { fontFamily: Fonts.serifItalic, fontSize: 38, lineHeight: 40 },
  statLabel: { marginTop: 6, fontFamily: Fonts.caps, fontSize: 9, letterSpacing: 1.4 },
  addBtn: { height: 56, borderRadius: 28, backgroundColor: Colors.paperInk, alignItems: 'center', justifyContent: 'center' },
  addText: { fontFamily: Fonts.capsBold, fontSize: 13, letterSpacing: 1.8, color: '#F4DFC8' },
  composer: { padding: 18, borderRadius: 22, backgroundColor: '#FBF5EC', borderWidth: 1, borderColor: Colors.champagne, gap: 14 },
  kinds: { flexDirection: 'row', gap: 6, padding: 4, borderRadius: 20, backgroundColor: '#EFE2D0' },
  kind: { flex: 1, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  kindText: { fontFamily: Fonts.caps, fontSize: 10.5, letterSpacing: 0.8 },
  dropzone: { height: 120, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(58,11,19,0.35)', backgroundColor: Colors.paperCard, alignItems: 'center', justifyContent: 'center', gap: 8 },
  dropText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.paperMuted },
  label: { fontFamily: Fonts.caps, fontSize: 10, letterSpacing: 2, color: Colors.paperMuted, marginBottom: 6 },
  field: { minHeight: 46, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(58,11,19,0.25)', backgroundColor: Colors.paperCard, color: Colors.paperInk, fontFamily: Fonts.body, fontSize: 14 },
  thought: { minHeight: 110, paddingTop: 12, textAlignVertical: 'top', fontFamily: Fonts.serifItalic, fontSize: 19 },
  formBtn: { flex: 1, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  cancel: { borderWidth: 1, borderColor: 'rgba(58,11,19,0.4)' },
  formBtnText: { fontFamily: Fonts.capsBold, fontSize: 11, letterSpacing: 1.2 },
  polaroid: { padding: 14, paddingBottom: 18, borderRadius: 6, backgroundColor: Colors.paperCard, shadowColor: '#3A0B13', shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  photo: { height: 200, borderRadius: 3, overflow: 'hidden', width: '100%' },
  meta: { marginTop: 8, flexDirection: 'row', gap: 8 },
  metaText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.paperMuted },
});
