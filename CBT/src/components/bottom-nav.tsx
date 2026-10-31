// bottom-nav.tsx — Navbar bawah (pil aktif bisa digeser / diseret)
// Dependensi: react-native-svg  (npx expo install react-native-svg)
//
// Cara pakai:
//  - Manual (state sendiri):  <BottomNav active={tab} onChange={setTab} />
//  - Expo Router: lihat _layout.tsx (navbar dipasang sekali lewat <Tabs tabBar=...>).
//    Nama route harus sama dengan field `route` di NAV_ITEMS di bawah.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

/* ----------------------------- Warna ----------------------------- */
const C = {
  active: '#2276ED',
  inactive: '#94A3B8',
  pill: '#EAF2FF',
  bar: 'rgba(255,255,255,0.92)',
  border: 'rgba(255,255,255,0.95)',
};

/* ----------------------------- Ikon ------------------------------ */
// Path dari SVG asli; viewBox menyesuaikan posisi aslinya di desain.
type IconProps = { color: string };

const Icon = ({ viewBox, children }: { viewBox: string; children: ReactNode }) => (
  <Svg width={24} height={24} viewBox={viewBox} fill="none">
    {children}
  </Svg>
);

const HomeIcon = ({ color }: IconProps) => (
  <Icon viewBox="44 776.5 24 24">
    <Path
      d="M48.6667 787.033L56.0001 781.167L63.3334 787.033V795.833H58.2917V790.333H53.7084V795.833H48.6667V787.033Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </Icon>
);

const ExamIcon = ({ color }: IconProps) => (
  <Icon viewBox="111 769 24 24">
    <Path
      d="M119.333 773.208H126.667C128.185 773.208 129.417 774.439 129.417 775.958V786.042C129.417 787.56 128.185 788.792 126.667 788.792H119.333C117.814 788.792 116.583 787.56 116.583 786.042V775.958C116.583 774.439 117.814 773.208 119.333 773.208Z"
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M119.792 777.333H126.208M119.792 781H126.208M119.792 784.667H123.458"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Icon>
);

const TaskIcon = ({ color }: IconProps) => (
  <Icon viewBox="178 777 24 24">
    <Path
      d="M185.875 782.083H194.125C195.644 782.083 196.875 783.314 196.875 784.833V793.083C196.875 794.602 195.644 795.833 194.125 795.833H185.875C184.356 795.833 183.125 794.602 183.125 793.083V784.833C183.125 783.314 184.356 782.083 185.875 782.083Z"
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M186.333 787.125L188.533 789.417L193.667 784.833"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

const ChartIcon = ({ color }: IconProps) => (
  <Icon viewBox="245 776.7 24 24">
    <Path
      d="M250.583 794.917V787.583M257 794.917V782.083M263.417 794.917V784.833"
      stroke={color}
      strokeWidth={2.3}
      strokeLinecap="round"
    />
    <Path d="M249.667 795.375H264.333" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Icon>
);

const ProfileIcon = ({ color }: IconProps) => (
  <Icon viewBox="312 776.7 24 24">
    <Path
      d="M327.208 784.833C327.208 786.605 325.772 788.042 324 788.042C322.228 788.042 320.792 786.605 320.792 784.833C320.792 783.061 322.228 781.625 324 781.625C325.772 781.625 327.208 783.061 327.208 784.833Z"
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M318.042 795.833C318.867 792.808 321.067 791.25 324 791.25C326.933 791.25 329.133 792.808 329.958 795.833"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Icon>
);

/* ------------------------------ Data ----------------------------- */
export type NavKey = 'home' | 'ujian' | 'tugas' | 'nilai' | 'profil';

type NavItem = {
  key: NavKey;
  label: string;
  /** nama route di Expo Router / React Navigation */
  route: string;
  Icon: (p: IconProps) => React.JSX.Element;
};

// Ubah label / route di sini sesuai struktur project Anda.
export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', route: 'index', Icon: HomeIcon },
  { key: 'ujian', label: 'Ujian', route: 'ujian-list', Icon: ExamIcon },
  { key: 'tugas', label: 'Tugas', route: 'tugas', Icon: TaskIcon },
  { key: 'nilai', label: 'Nilai', route: 'nilai', Icon: ChartIcon },
  { key: 'profil', label: 'Profil', route: 'profil', Icon: ProfileIcon },
];

/* --------------------------- Komponen ---------------------------- */
const PILL_W = 54;
const PILL_H = 46;
const COUNT = NAV_ITEMS.length;

type BottomNavProps = {
  active: NavKey;
  onChange: (key: NavKey) => void;
  /** jarak dari bawah layar (tambahkan inset safe area kalau perlu) */
  bottomOffset?: number;
  style?: StyleProp<ViewStyle>;
};

export function BottomNav({ active, onChange, bottomOffset, style }: BottomNavProps) {
  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((i) => i.key === active),
  );

  const [slotW, setSlotW] = useState(0);
  const x = useRef(new Animated.Value(0)).current;

  // ref agar PanResponder (dibuat sekali) selalu memakai nilai terbaru
  const slotRef = useRef(0);
  const activeRef = useRef(activeIndex);
  const onChangeRef = useRef(onChange);
  const startX = useRef(0);
  const placed = useRef(false);
  activeRef.current = activeIndex;
  onChangeRef.current = onChange;

  const offsetOf = useCallback(
    (index: number) => index * slotRef.current + (slotRef.current - PILL_W) / 2,
    [],
  );

  const animateTo = useCallback(
    (index: number) => {
      Animated.spring(x, {
        toValue: offsetOf(index),
        useNativeDriver: true,
        speed: 18,
        bounciness: 7,
      }).start();
    },
    [offsetOf, x],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width / COUNT;
    slotRef.current = w;
    setSlotW(w);
    x.setValue(offsetOf(activeRef.current));
    placed.current = true;
  };

  // Halaman/tab berubah -> pil ikut bergeser
  useEffect(() => {
    if (placed.current && slotW > 0) animateTo(activeIndex);
  }, [activeIndex, slotW, animateTo]);

  const pan = useMemo(
    () =>
      PanResponder.create({
        // Tap tetap diteruskan ke tombol tab; hanya gerakan horizontal yang diambil alih
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderGrant: () => {
          x.stopAnimation((v) => {
            startX.current = v;
          });
        },
        onPanResponderMove: (_, g) => {
          const min = offsetOf(0);
          const max = offsetOf(COUNT - 1);
          x.setValue(Math.min(max, Math.max(min, startX.current + g.dx)));
        },
        onPanResponderRelease: (_, g) => {
          const raw = (startX.current + g.dx - offsetOf(0)) / (slotRef.current || 1);
          const idx = Math.min(COUNT - 1, Math.max(0, Math.round(raw)));
          if (idx !== activeRef.current) onChangeRef.current(NAV_ITEMS[idx].key);
          animateTo(idx);
        },
        onPanResponderTerminate: () => animateTo(activeRef.current),
      }),
    [animateTo, offsetOf, x],
  );

  return (
    <View
      style={[
        styles.bar,
        { bottom: bottomOffset ?? (Platform.OS === 'ios' ? 28 : 24) },
        style,
      ]}
      {...pan.panHandlers}
    >
      <View style={styles.row} onLayout={onLayout}>
        {slotW > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[styles.pill, { transform: [{ translateX: x }] }]}
          />
        )}

        {NAV_ITEMS.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <Pressable
              key={item.key}
              style={styles.slot}
              onPress={() => onChange(item.key)}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
            >
              <item.Icon color={isActive ? C.active : C.inactive} />
              {isActive && <Text style={styles.label}>{item.label}</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default BottomNav;

/* ----------------------------- Style ----------------------------- */
const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 22,
    right: 22,
    height: 52,
    borderRadius: 22,
    paddingHorizontal: 8,
    backgroundColor: C.bar,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#0D1F47',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 6,
  },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  pill: {
    position: 'absolute',
    left: 0,
    top: 2,
    width: PILL_W,
    height: PILL_H,
    borderRadius: 18,
    backgroundColor: C.pill,
  },
  slot: {
    flex: 1,
    height: PILL_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 11, fontWeight: '700', color: C.active, marginTop: 1 },
});
