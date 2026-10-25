// ujian-list.tsx — Layar "Daftar Ujian"
// Dependensi: npx expo install react-native-svg
// Navbar: ./bottom-nav.tsx (taruh di folder yang sama, atau sesuaikan path import)

import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { BottomNav, NavKey } from '../components/bottom-nav';

/* ----------------------------- Warna ----------------------------- */
const C = {
  ink: '#0F172A',
  muted: '#64748B',
  soft: '#94A3B8',
  blue: '#0F6BFF',
  blueTab: '#2276ED',
  blueTint: '#EAF2FF',
  green: '#22C55E',
  greenTint: '#E8FBEF',
  card: 'rgba(255,255,255,0.92)',
  cardBorder: 'rgba(255,255,255,0.95)',
};

/* ----------------------------- Data ------------------------------ */
type Exam = {
  id: string;
  title: string;
  questions: number;
  minutes: number;
  status: string;
};

const EXAMS: Exam[] = [
  { id: '1', title: 'Matematika', questions: 40, minutes: 90, status: 'Siap' },
  { id: '2', title: 'B. Indonesia', questions: 45, minutes: 90, status: 'Siap' },
];

/* ----------------------------- Ikon ------------------------------ */
// Path diambil dari SVG asli; viewBox disesuaikan agar ikon pas di ukurannya.
type IconProps = { viewBox: string; size?: number; children: ReactNode };

const Icon = ({ viewBox, size = 24, children }: IconProps) => (
  <Svg width={size} height={size} viewBox={viewBox} fill="none">
    {children}
  </Svg>
);

const SearchIcon = () => (
  <Icon viewBox="49 156 20 20">
    <Path
      d="M63 164C63 167.314 60.3137 170 57 170C53.6863 170 51 167.314 51 164C51 160.686 53.6863 158 57 158C60.3137 158 63 160.686 63 164Z"
      stroke={C.soft}
      strokeWidth={2}
    />
    <Path d="M62 169L67 174" stroke={C.soft} strokeWidth={2} strokeLinecap="round" />
  </Icon>
);

const FilterIcon = () => (
  <Icon viewBox="319 154 20 20" size={22}>
    <Path
      d="M321 158H337M324 164H334M327 170H331"
      stroke={C.blue}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Icon>
);

const DocIcon = () => (
  <Icon viewBox="63 268 22 22">
    <Path
      d="M70 270.5H78C79.6569 270.5 81 271.843 81 273.5V284.5C81 286.157 79.6569 287.5 78 287.5H70C68.3431 287.5 67 286.157 67 284.5V273.5C67 271.843 68.3431 270.5 70 270.5Z"
      stroke={C.blue}
      strokeWidth={2}
    />
    <Path
      d="M70.5 275H77.5M70.5 279H77.5M70.5 283H74.5"
      stroke={C.blue}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Icon>
);

/* --------------------------- Background --------------------------- */
// Pengganti efek blur di desain: radial gradient (RN tidak mendukung filter SVG).
const Background = () => (
  <Svg
    style={StyleSheet.absoluteFill}
    width="100%"
    height="100%"
    viewBox="0 0 390 844"
    preserveAspectRatio="xMidYMid slice"
    pointerEvents="none"
  >
    <Defs>
      <LinearGradient id="bg" x1="0" y1="0" x2="390" y2="0" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#F8FBFF" />
        <Stop offset="1" stopColor="#EAF2FF" />
      </LinearGradient>
      <RadialGradient id="glowA" cx="30" cy="50" r="140" gradientUnits="userSpaceOnUse">
        <Stop offset="0.75" stopColor="#60A5FA" stopOpacity={0.2} />
        <Stop offset="1" stopColor="#60A5FA" stopOpacity={0} />
      </RadialGradient>
      <RadialGradient id="glowB" cx="340" cy="170" r="110" gradientUnits="userSpaceOnUse">
        <Stop offset="0.75" stopColor="#67E8F9" stopOpacity={0.16} />
        <Stop offset="1" stopColor="#67E8F9" stopOpacity={0} />
      </RadialGradient>
      <RadialGradient id="glowC" cx="190" cy="770" r="145" gradientUnits="userSpaceOnUse">
        <Stop offset="0.75" stopColor="#0F6BFF" stopOpacity={0.08} />
        <Stop offset="1" stopColor="#0F6BFF" stopOpacity={0} />
      </RadialGradient>
    </Defs>
    <Rect width="390" height="844" fill="url(#bg)" />
    <Circle cx="30" cy="50" r="140" fill="url(#glowA)" />
    <Circle cx="340" cy="170" r="110" fill="url(#glowB)" />
    <Circle cx="190" cy="770" r="145" fill="url(#glowC)" />
  </Svg>
);

/* --------------------------- Komponen ---------------------------- */
type ExamCardProps = { item: Exam; onPress?: (exam: Exam) => void };

const ExamCard = ({ item, onPress }: ExamCardProps) => (
  <Pressable
    onPress={() => onPress?.(item)}
    style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
  >
    <View style={styles.cardIcon}>
      <DocIcon />
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.cardMeta}>
        {item.questions} soal • {item.minutes} menit
      </Text>
    </View>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{item.status}</Text>
    </View>
  </Pressable>
);

/* ------------------------------ App ------------------------------ */
export default function UjianList() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<NavKey>('ujian');

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? EXAMS.filter((e) => e.title.toLowerCase().includes(q)) : EXAMS;
  }, [query]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <Background />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Daftar Ujian</Text>
          <Text style={styles.subtitle}>Pilih mata pelajaran yang tersedia</Text>

          <View style={styles.search}>
            <SearchIcon />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Cari mata pelajaran"
              placeholderTextColor={C.soft}
              style={styles.searchInput}
              returnKeyType="search"
            />
            <Pressable style={styles.filterBtn} accessibilityLabel="Filter">
              <FilterIcon />
            </Pressable>
          </View>

          <View style={styles.list}>
            {data.map((item) => (
              <ExamCard
                key={item.id}
                item={item}
                onPress={(exam: Exam) => console.log('Buka ujian:', exam.title)}
              />
            ))}
          </View>
        </ScrollView>

        <BottomNav active={tab} onChange={setTab} />
      </SafeAreaView>
    </View>
  );
}

/* ----------------------------- Style ----------------------------- */
const shadow = {
  shadowColor: '#0D1F47',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.08,
  shadowRadius: 14,
  elevation: 4,
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FBFF' },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  scroll: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 120 },

  title: { fontSize: 30, fontWeight: '800', color: C.ink, letterSpacing: -0.3 },
  subtitle: { fontSize: 14, color: C.muted, marginTop: 6 },

  search: {
    marginTop: 24,
    height: 58,
    borderRadius: 22,
    paddingLeft: 24,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    ...shadow,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, color: C.ink, paddingVertical: 0 },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
  },

  list: { marginTop: 28, gap: 18 },
  card: {
    minHeight: 106,
    borderRadius: 28,
    paddingHorizontal: 26,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.cardBorder,
    ...shadow,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, marginLeft: 20, marginRight: 8 },
  cardTitle: { fontSize: 19, fontWeight: '700', color: C.ink },
  cardMeta: { fontSize: 14, color: C.muted, marginTop: 6 },
  badge: {
    width: 82,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.greenTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 13, fontWeight: '600', color: C.green },
});
