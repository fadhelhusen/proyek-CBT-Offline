// src/app/_layout.tsx
// Satu layout untuk semua halaman (struktur rata, tanpa folder (tabs)).
// Alur: index -> splash -> login -> verification -> home-dashboard <-> ujian-list
//       (kalau login salah: verification -> login-error -> login)
// Navbar HANYA muncul di halaman yang ada di NAV_ITEMS (components/bottom-nav.tsx):
// home-dashboard, ujian-list (+ tugas, nilai, profil kalau nanti dibuat).
// Di index, splash, login, dan verification navbar otomatis disembunyikan.

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
      <Tabs.Screen name="index" />
      <Tabs.Screen name="splash" />
      <Tabs.Screen name="login" />
      <Tabs.Screen name="verification" />
      <Tabs.Screen name="login-error" />
      <Tabs.Screen name="home-dashboard" />
      <Tabs.Screen name="ujian-list" />
      {/* Aktifkan setelah file-nya dibuat di src/app:
      <Tabs.Screen name="tugas" />
      <Tabs.Screen name="nilai" />
      <Tabs.Screen name="profil" /> */}
    </Tabs>
  );
}
