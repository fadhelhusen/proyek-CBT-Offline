// src/app/_layout.tsx
// Satu layout untuk semua halaman (struktur rata, tanpa folder (tabs)).
// Alur: index -> splash -> login -> verification -> home-dashboard <-> ujian-list
//       (kalau login salah: verification -> login-error -> login)
// Navbar HANYA muncul di halaman yang ada di NAV_ITEMS (components/bottom-nav.tsx):
// home-dashboard, ujian-list, tugas, statistik, profile.
// Di splash, login, verification, detail-ujian, dll. navbar otomatis disembunyikan.
// Setiap file di src/app yang mau dipakai HARUS dideklarasikan di <Tabs.Screen> di bawah,
// dan namanya harus sama dengan nama file (tanpa .tsx).

import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { BottomNav, NAV_ITEMS } from '@/components/bottom-nav';

// Tipe props diambil langsung dari <Tabs>, jadi selalu cocok dengan versi React Navigation Anda
type TabBarFn = NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>;
type TabBarProps = Parameters<TabBarFn>[0];

function TabBar({ state }: TabBarProps) {
  const router = useRouter();
  const currentRoute = state.routes[state.index]?.name;
  const current = NAV_ITEMS.find((i) => i.route === currentRoute);

  // Bukan halaman utama (splash / login / verification) -> tanpa navbar
  if (!current) return null;

  return (
    <BottomNav
      active={current.key}
      onChange={(key) => {
        const item = NAV_ITEMS.find((i) => i.key === key);
        if (!item) return;
        router.navigate(`/${item.route}` as Href);
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
      backBehavior="none"
    >
      {/* Alur masuk (tanpa navbar) */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="splash" />
      <Tabs.Screen name="login" />
      <Tabs.Screen name="verification" />
      <Tabs.Screen name="login-error" />

      {/* Halaman utama (navbar muncul, ada di NAV_ITEMS) */}
      <Tabs.Screen name="home-dashboard" />
      <Tabs.Screen name="ujian-list" />
      <Tabs.Screen name="tugas" />
      <Tabs.Screen name="statistik" />
      <Tabs.Screen name="profile" />

      {/* Halaman lain (tanpa navbar karena tidak ada di NAV_ITEMS) */}
      <Tabs.Screen name="detail-ujian" />
      <Tabs.Screen name="token-ujian" />
      <Tabs.Screen name="exam-readiness" />
      <Tabs.Screen name="exam-lock-timeline" />
      <Tabs.Screen name="riwayat" />
    </Tabs>
  );
}
