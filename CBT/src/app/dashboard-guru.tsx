import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { ujianMilikGuru } from '@/services/api';
import type { Ujian, UjianStatus } from '@/data/types';
import {
  COLORS, DashboardHeader, StatCard, StatGrid, QuickAction, SectionTitle, ListRow,
} from '@/components/DashboardParts';

const STATUS_LABEL: Record<UjianStatus, string> = {
  berlangsung: 'Berlangsung', terjadwal: 'Terjadwal', selesai: 'Selesai',
};
const STATUS_COLOR: Record<UjianStatus, string> = {
  berlangsung: COLORS.green, terjadwal: COLORS.amber, selesai: COLORS.muted,
};

export default function DashboardGuru() {
  const { user, logout } = useAuth();
  const [daftar, setDaftar] = useState<Ujian[]>([]);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    if (!user) return;
    let batal = false;
    (async () => {
      setMemuat(true);
      const data = await ujianMilikGuru(user.id);
      if (!batal) { setDaftar(data); setMemuat(false); }
    })();
    return () => { batal = true; };
  }, [user]);

  const aktif = daftar.filter((u) => u.status === 'berlangsung').length;
  const terjadwal = daftar.filter((u) => u.status === 'terjadwal').length;
  const soon = (name: string) => () => console.log(`${name} dipilih`);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DashboardHeader
          name={user?.nama ?? 'Guru'}
          roleLabel="Guru"
          subtitle={user?.mapel ? `Pengampu ${user.mapel}` : undefined}
          onLogout={() => { logout(); router.replace('/login' as Href); }}
        />

        <StatGrid>
          <StatCard label="Total ujian" value={daftar.length} />
          <StatCard label="Ujian aktif" value={aktif} color={COLORS.green} />
          <StatCard label="Terjadwal" value={terjadwal} color={COLORS.amber} />
          <StatCard label="Selesai" value={daftar.length - aktif - terjadwal} color={COLORS.muted} />
        </StatGrid>

        <SectionTitle>Aksi cepat</SectionTitle>
        <View style={styles.actions}>
          <QuickAction label="Buat ujian" onPress={soon('Buat ujian')} />
          <QuickAction label="Bank soal" onPress={soon('Bank soal')} />
          <QuickAction label="Pantau siswa" onPress={soon('Pantau siswa')} />
          <QuickAction label="Rekap nilai" onPress={soon('Rekap nilai')} />
        </View>

        <SectionTitle>Ujian saya</SectionTitle>
        {memuat && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />}
        {daftar.map((u) => (
          <ListRow
            key={u.id}
            title={u.judul}
            subtitle={`Kelas ${u.kelas}`}
            right={STATUS_LABEL[u.status]}
            rightColor={STATUS_COLOR[u.status]}
            onPress={soon(u.judul)}
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
