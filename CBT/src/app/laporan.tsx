// Laporan (rekap data) — khusus admin.
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import type { Href } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { adminListAkun, adminListUjian } from '@/services/api';
import type { Akun, UjianAdmin, UjianStatus } from '@/data/types';
import { GradientButton } from '@/components/GradientButton';
import AppCard from '@/components/atoms/AppCard';
import { COLORS } from '@/components/DashboardParts';

type Item = { label: string; nilai: number };

const STATUS: { key: UjianStatus; label: string; color: string }[] = [
  { key: 'terjadwal', label: 'Terjadwal', color: COLORS.amber },
  { key: 'berlangsung', label: 'Berlangsung', color: COLORS.green },
  { key: 'selesai', label: 'Selesai', color: COLORS.muted },
];

// hitung kemunculan tiap nilai, urut dari terbanyak
function hitung<T>(data: T[], ambil: (x: T) => string | null | undefined): Item[] {
  const peta = new Map<string, number>();
  data.forEach((d) => {
    const k = (ambil(d) ?? '').trim();
    if (!k) return;
    peta.set(k, (peta.get(k) ?? 0) + 1);
  });
  return [...peta.entries()]
    .map(([label, nilai]) => ({ label, nilai }))
    .sort((a, b) => b.nilai - a.nilai || a.label.localeCompare(b.label));
}

function Bar({ label, nilai, maks, color = COLORS.primary }: Item & { maks: number; color?: string }) {
  const persen = maks > 0 ? Math.round((nilai / maks) * 100) : 0;
  return (
    <View style={styles.barRow}>
      <View style={styles.barHead}>
        <Text style={styles.barLabel} numberOfLines={1}>{label}</Text>
        <Text style={styles.barNilai}>{nilai}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${persen}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function Kartu({ judul, items, color }: { judul: string; items: Item[]; color?: string }) {
  const maks = Math.max(0, ...items.map((i) => i.nilai));
  return (
    <AppCard style={styles.card} padding={16} radius={18}>
      <Text style={styles.cardJudul}>{judul}</Text>
      {items.length === 0 && <Text style={styles.muted}>Belum ada data.</Text>}
      {items.map((i) => <Bar key={i.label} label={i.label} nilai={i.nilai} maks={maks} color={color} />)}
    </AppCard>
  );
}

export default function Laporan() {
  const { user, kredensial } = useAuth();
  const [akun, setAkun] = useState<Akun[]>([]);
  const [ujian, setUjian] = useState<UjianAdmin[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState('');

  const muat = useCallback(async () => {
    if (!kredensial) return;
    setMemuat(true);
    try {
      const [a, u] = await Promise.all([adminListAkun(kredensial), adminListUjian(kredensial)]);
      setAkun(a);
      setUjian(u);
      setGalat('');
    } catch (e) {
      setGalat(e instanceof Error ? e.message : 'Gagal memuat laporan.');
    } finally {
      setMemuat(false);
    }
  }, [kredensial]);

  useFocusEffect(useCallback(() => { muat(); }, [muat]));

  const r = useMemo(() => {
    const siswa = akun.filter((a) => a.role === 'siswa');
    return {
      siswa: siswa.length,
      guru: akun.filter((a) => a.role === 'guru').length,
      admin: akun.filter((a) => a.role === 'admin').length,
      status: STATUS.map((s) => ({ label: s.label, nilai: ujian.filter((u) => u.status === s.key).length, color: s.color })),
      siswaPerKelas: hitung(siswa, (a) => a.kelas),
      ujianPerMapel: hitung(ujian, (u) => u.mapel),
      ujianPerGuru: hitung(ujian, (u) => u.guruNama),
    };
  }, [akun, ujian]);

  const bagikan = async () => {
    const tgl = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const baris = (t: string, items: Item[]) =>
      `\n${t}\n` + (items.length ? items.map((i) => `- ${i.label}: ${i.nilai}`).join('\n') : '- (belum ada data)');
    const teks =
      `LAPORAN CBT SEKOLAH\n${tgl}\n` +
      `\nAKUN\n- Siswa: ${r.siswa}\n- Guru: ${r.guru}\n- Admin: ${r.admin}\n` +
      `\nUJIAN (${ujian.length})\n` + r.status.map((s) => `- ${s.label}: ${s.nilai}`).join('\n') +
      '\n' + baris('SISWA PER KELAS', r.siswaPerKelas) +
      '\n' + baris('UJIAN PER MAPEL', r.ujianPerMapel) +
      '\n' + baris('UJIAN PER GURU', r.ujianPerGuru);
    try {
      await Share.share({ message: teks, title: 'Laporan CBT' });
    } catch {
      /* dibatalkan */
    }
  };

  if (user?.role !== 'admin' || !kredensial) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.muted}>Sesi habis atau bukan akun admin.</Text>
          <Pressable onPress={() => router.replace('/login' as Href)} style={{ marginTop: 16 }}>
            <Text style={styles.actText}>Login ulang</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.replace('/dashboard-admin' as Href)} hitSlop={10} style={{ marginBottom: 16 }}>
          <Text style={styles.back}>‹ Kembali</Text>
        </Pressable>
        <Text style={styles.title}>Laporan</Text>
        <Text style={styles.muted}>Rekap akun dan ujian</Text>

        {memuat && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />}
        {!!galat && <Text style={styles.error}>{galat}</Text>}

        {!memuat && !galat && (
          <>
            {/* ringkasan */}
            <View style={styles.grid}>
              <AppCard style={styles.stat} padding={16} radius={20}>
                <Text style={[styles.statNilai, { color: COLORS.primary }]}>{akun.length}</Text>
                <Text style={styles.statLabel}>Total akun</Text>
              </AppCard>
              <AppCard style={styles.stat} padding={16} radius={20}>
                <Text style={[styles.statNilai, { color: COLORS.green }]}>{ujian.length}</Text>
                <Text style={styles.statLabel}>Total ujian</Text>
              </AppCard>
            </View>

            <Text style={styles.section}>Akun</Text>
            <AppCard style={styles.card} padding={16} radius={18}>
              <Bar label="Siswa" nilai={r.siswa} maks={akun.length} color={COLORS.primary} />
              <Bar label="Guru" nilai={r.guru} maks={akun.length} color="#8B5CF6" />
              <Bar label="Admin" nilai={r.admin} maks={akun.length} color={COLORS.amber} />
            </AppCard>

            <Text style={styles.section}>Ujian per status</Text>
            <AppCard style={styles.card} padding={16} radius={18}>
              {r.status.map((s) => (
                <Bar key={s.label} label={s.label} nilai={s.nilai} maks={ujian.length} color={s.color} />
              ))}
            </AppCard>

            <Text style={styles.section}>Per kelas, mapel, dan guru</Text>
            <Kartu judul="Siswa per kelas" items={r.siswaPerKelas} />
            <Kartu judul="Ujian per mata pelajaran" items={r.ujianPerMapel} color={COLORS.green} />
            <Kartu judul="Ujian per guru" items={r.ujianPerGuru} color="#8B5CF6" />

            <AppCard style={styles.note} padding={14} radius={16}>
              <Text style={styles.noteText}>
                Rekap nilai dan hasil ujian siswa akan muncul di sini setelah halaman pengerjaan ujian
                dan penyimpanan jawaban selesai dibuat.
              </Text>
            </AppCard>

            <View style={{ marginTop: 16 }}>
              <GradientButton text="Bagikan laporan" onPress={bagikan} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  content: { padding: 24, paddingBottom: 48 },
  back: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.primary },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.text },
  muted: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.muted, marginTop: 2 },
  actText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.primary },
  error: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.red, marginVertical: 8 },
  grid: { flexDirection: 'row', gap: 12, marginTop: 20 },
  stat: { flex: 1 },
  statNilai: { fontFamily: 'Inter_700Bold', fontSize: 28 },
  statLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.muted, marginTop: 4 },
  section: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.text, marginTop: 24, marginBottom: 12 },
  card: { marginBottom: 12 },
  cardJudul: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.text, marginBottom: 10 },
  barRow: { marginBottom: 12 },
  barHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.text },
  barNilai: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: COLORS.text, marginLeft: 8 },
  track: { height: 8, borderRadius: 4, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  note: { backgroundColor: COLORS.soft, marginTop: 4 },
  noteText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.muted, lineHeight: 18 },
});