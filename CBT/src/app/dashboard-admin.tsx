import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { ringkasanAdmin, ujianTerbaru } from '@/services/api';
import type { RingkasanAdmin, Ujian, UjianStatus } from '@/data/types';
import {
  COLORS, DashboardHeader, StatCard, StatGrid, QuickAction, SectionTitle, ListRow,
} from '@/components/DashboardParts';

const STATUS_COLOR: Record<UjianStatus, string> = {
  berlangsung: COLORS.green, terjadwal: COLORS.amber, selesai: COLORS.muted,
};

export default function DashboardAdmin() {
  const { user, logout } = useAuth();
  const [r, setR] = useState<RingkasanAdmin>({ siswa: 0, guru: 0, kelas: 0, terjadwal: 0 });
  const [ujian, setUjian] = useState<Ujian[]>([]);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let batal = false;
    (async () => {
      const [ringkasan, terbaru] = await Promise.all([ringkasanAdmin(), ujianTerbaru(5)]);
      if (!batal) { setR(ringkasan); setUjian(terbaru); setMemuat(false); }
    })();
    return () => { batal = true; };
  }, []);

  const soon = (name: string) => () => console.log(`${name} dipilih`);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DashboardHeader
          name={user?.nama ?? 'Admin'}
          roleLabel="Admin"
          subtitle="Kelola sistem CBT sekolah"
          onLogout={() => { logout(); router.replace('/login' as Href); }}
        />

        <StatGrid>
          <StatCard label="Total siswa" value={r.siswa} />
          <StatCard label="Total guru" value={r.guru} />
          <StatCard label="Kelas" value={r.kelas} color={COLORS.green} />
          <StatCard label="Ujian terjadwal" value={r.terjadwal} color={COLORS.amber} />
        </StatGrid>

        <SectionTitle>Manajemen</SectionTitle>
        <View style={styles.actions}>
          <QuickAction label="Kelola akun" onPress={soon('Kelola akun')} />
          <QuickAction label="Kelas & mapel" onPress={soon('Kelas & mapel')} />
          <QuickAction label="Sinkronisasi" onPress={soon('Sinkronisasi')} />
          <QuickAction label="Laporan" onPress={soon('Laporan')} />
        </View>

        <SectionTitle>Ujian terbaru</SectionTitle>
        {memuat && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />}
        {ujian.map((u) => (
          <ListRow
            key={u.id}
            title={u.judul}
            subtitle={`${u.mapel} • Kelas ${u.kelas}`}
            right={u.status}
            rightColor={STATUS_COLOR[u.status]}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 48 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
