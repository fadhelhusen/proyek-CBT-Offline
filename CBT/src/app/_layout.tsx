import React, { useEffect } from 'react';
import { Tabs, usePathname, useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import { BottomNav, NAV_ITEMS } from '@/components/bottom-nav';
import { AuthProvider } from '@/context/auth-context';
import { debugLog } from '@/lib/debug';

// [DEBUG-SEMENTARA] catat URL setiap kali aplikasi dimuat ulang
if (typeof window !== 'undefined') {
  debugLog('BOOT ' + window.location.href);
}

// [DEBUG-SEMENTARA] catat setiap perpindahan halaman
function RouteLogger() {
  const pathname = usePathname();

  useEffect(() => {
    debugLog('RUTE -> ' + pathname);
  }, [pathname]);

  return null;
}

type TabBarFn = NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>;
type TabBarProps = Parameters<TabBarFn>[0];

function TabBar({ state }: TabBarProps) {
  const router = useRouter();
  const currentRoute = state.routes[state.index]?.name;
  const current = NAV_ITEMS.find((i) => i.route === currentRoute);

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
    <AuthProvider>
      <RouteLogger />
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false }}
        backBehavior="none"
      >
        {/* Alur masuk */}
        <Tabs.Screen name="index" />
        <Tabs.Screen name="splash" />
        <Tabs.Screen name="login" />
        <Tabs.Screen name="verification" />
        <Tabs.Screen name="login-error" />

        {/* Callback Google OAuth */}
        <Tabs.Screen
          name="auth/callback"
          options={{ href: null }}
        />

        {/* Halaman utama siswa */}
        <Tabs.Screen name="home-dashboard" />
        <Tabs.Screen name="ujian-list" />
        <Tabs.Screen name="tugas" />
        <Tabs.Screen name="statistik" />
        <Tabs.Screen name="profile" />

        {/* Dashboard guru dan admin */}
        <Tabs.Screen name="dashboard-guru" />
        <Tabs.Screen name="dashboard-admin" />
        <Tabs.Screen name="kelola-akun" />
        <Tabs.Screen name="kelola-ujian" />
        <Tabs.Screen name="kelas-mapel" />
        <Tabs.Screen name="sinkronisasi" />
        <Tabs.Screen name="laporan" />

        {/* Halaman lainnya */}
        <Tabs.Screen name="detail-ujian" />
        <Tabs.Screen name="token-ujian" />
        <Tabs.Screen name="exam-readiness" />
        <Tabs.Screen name="exam-lock-timeline" />
        <Tabs.Screen name="riwayat" />
      </Tabs>
    </AuthProvider>
  );
}