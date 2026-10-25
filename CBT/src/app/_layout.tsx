// src/app/_layout.tsx  (atau app/(tabs)/_layout.tsx kalau pakai folder grup)
// Memasang navbar custom (components/bottom-nav.tsx) sekali untuk semua tab.
//
// Nama file halaman harus sama dengan field `route` di NAV_ITEMS (bottom-nav.tsx):
//   index.tsx -> Home, ujian-list.tsx -> Ujian, tugas.tsx, nilai.tsx, profil.tsx

import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { BottomNav, NAV_ITEMS } from '../components/bottom-nav';

// Tipe props diambil langsung dari <Tabs>, jadi selalu cocok dengan versi React Navigation Anda
type TabBarFn = NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>;
type TabBarProps = Parameters<TabBarFn>[0];

function TabBar({ state }: TabBarProps) {
  const router = useRouter();
  const currentRoute = state.routes[state.index]?.name;
  const active = NAV_ITEMS.find((i) => i.route === currentRoute)?.key ?? 'home';

  return (
    <BottomNav
      active={active}
      onChange={(key) => {
        const item = NAV_ITEMS.find((i) => i.key === key);
        if (!item) return;
        router.navigate((item.route === 'index' ? '/' : `/${item.route}`) as Href);
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* Hanya layar yang dideklarasikan di sini yang tampil. */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="ujian-list" />
      {/* Tambahkan baris ini setelah file-nya dibuat:
      <Tabs.Screen name="tugas" />
      <Tabs.Screen name="nilai" />
      <Tabs.Screen name="profil" /> */}
    </Tabs>
  );
}
