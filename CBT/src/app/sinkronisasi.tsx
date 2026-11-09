// Sinkronisasi (status server & data) — khusus admin.
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import type { Href } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { adminListAkun, adminListRef, adminListUjian } from '@/services/api';
import { GradientButton } from '@/components/GradientButton';
import AppCard from '@/components/atoms/AppCard';
import { COLORS } from '@/components/DashboardParts';

type Status = 'cek' | 'ok' | 'gagal';

type Hitung = {
  siswa: number; guru: number; admin: number;
  ujian: number; berlangsung: number; terjadwal: number; selesai: number;
  kelas: number; mapel: number;
};

const KOSONG: Hitung = {
  siswa: 0, guru: 0, admin: 0, ujian: 0, berlangsung: 0, terjadwal: 0, selesai: 0, kelas: 0, mapel: 0,
};

function Baris({ label, nilai }: { label: string; nilai: number }) {
  return (
    <View style={styles.baris}>
      <Text style={styles.barisLabel}>{label}</Text>
      <Text style={styles.barisNilai}>{nilai}</Text>
    </View>
  );
}

export default function Sinkronisasi() {
  const { user, kredensial } = useAuth();
  const [status, setStatus] = useState<Status>('cek');
  const [ms, setMs] = useState<number | null>(null);
  const [terakhir, setTerakhir] = useState<string>('');
  const [galat, setGalat] = useState('');
  const [h, setH] = useState<Hitung>(KOSONG);

  const cek = useCallback(async () => {
    if (!kredensial) return;
    setStatus('cek');
    setGalat('');
    const mulai = Date.now();
    try {
      const [akun, ujian, kelas, mapel] = await Promise.all([
        adminListAkun(kredensial),
        adminListUjian(kredensial),
        adminListRef(kredensial, 'kelas'),
        adminListRef(kredensial, 'mapel'),
      ]);
      setH({
        siswa: akun.filter((a) => a.role === 'siswa').length,
        guru: akun.filter((a) => a.role === 'guru').length,
        admin: akun.filter((a) => a.role === 'admin').length,
        ujian: ujian.length,
        berlangsung: ujian.filter((u) => u.status === 'berlangsung').length,
        terjadwal: ujian.filter((u) => u.status === 'terjadwal').length,
        selesai: ujian.filter((u) => u.status === 'selesai').length,
        kelas: kelas.length,
        mapel: mapel.length,
      });
      setMs(Date.now() - mulai);
      setStatus('ok');
    } catch (e) {
      setMs(null);
      setGalat(e instanceof Error ? e.message : 'Tidak dapat terhubung ke server.');
      setStatus('gagal');
    } finally {
      const n = new Date();
      setTerakhir(
        n.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) +
          ', ' + n.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      );
    }
  }, [kredensial]);

  useFocusEffect(useCallback(() => { cek(); }, [cek]));

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

  const warna = status === 'ok' ? COLORS.green : status === 'gagal' ? COLORS.red : COLORS.amber;
  const judul =
    status === 'ok' ? 'Terhubung ke server' : status === 'gagal' ? 'Gagal terhubung' : 'Memeriksa koneksi…';
  const ikon = status === 'ok' ? 'cloud-done-outline' : status === 'gagal' ? 'cloud-offline-outline' : 'sync-outline';
  const kualitas = ms === null ? '' : ms < 800 ? 'Cepat' : ms < 2000 ? 'Sedang' : 'Lambat';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.replace('/dashboard-admin' as Href)} hitSlop={10} style={{ marginBottom: 16 }}>
          <Text style={styles.back}>‹ Kembali</Text>
        </Pressable>
        <Text style={styles.title}>Sinkronisasi</Text>
        <Text style={styles.muted}>Status koneksi dan data di server</Text>

        {/* status koneksi */}
        <AppCard style={styles.statusCard} padding={20} radius={22}>
          <View style={[styles.statusIcon, { backgroundColor: warna + '1A' }]}>
            {status === 'cek'
              ? <ActivityIndicator color={warna} />
              : <Ionicons name={ikon} size={28} color={warna} />}
          </View>
          <Text style={[styles.statusJudul, { color: warna }]}>{judul}</Text>
          {status === 'ok' && ms !== null && (
            <Text style={styles.muted}>Waktu respons {ms} ms • {kualitas}</Text>
          )}
          {status === 'gagal' && <Text style={styles.error}>{galat}</Text>}
          {!!terakhir && <Text style={[styles.muted, { marginTop: 8 }]}>Terakhir dicek: {terakhir}</Text>}
        </AppCard>

        <View style={{ marginBottom: 20 }}>
          <GradientButton text={status === 'cek' ? 'Memeriksa…' : 'Cek koneksi'} onPress={status === 'cek' ? () => {} : cek} />
        </View>

        {/* ringkasan data */}
        <Text style={styles.section}>Data di server</Text>

        <AppCard style={styles.card} padding={16} radius={18}>
          <Text style={styles.cardJudul}>Akun</Text>
          <Baris label="Siswa" nilai={h.siswa} />
          <Baris label="Guru" nilai={h.guru} />
          <Baris label="Admin" nilai={h.admin} />
        </AppCard>

        <AppCard style={styles.card} padding={16} radius={18}>
          <Text style={styles.cardJudul}>Ujian</Text>
          <Baris label="Terjadwal" nilai={h.terjadwal} />
          <Baris label="Berlangsung" nilai={h.berlangsung} />
          <Baris label="Selesai" nilai={h.selesai} />
          <Baris label="Total" nilai={h.ujian} />
        </AppCard>

        <AppCard style={styles.card} padding={16} radius={18}>
          <Text style={styles.cardJudul}>Referensi</Text>
          <Baris label="Kelas" nilai={h.kelas} />
          <Baris label="Mata pelajaran" nilai={h.mapel} />
        </AppCard>

        <AppCard style={styles.note} padding={14} radius={16}>
          <Text style={styles.noteText}>
            Sinkronisasi soal ke HP siswa dan pengiriman jawaban akan muncul di sini setelah halaman
            pengerjaan ujian dan penyimpanan offline selesai dibuat.
          </Text>
        </AppCard>
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
  error: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.red, marginTop: 8, textAlign: 'center' },
  statusCard: { alignItems: 'center', marginTop: 20, marginBottom: 16 },
  statusIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  statusJudul: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 12 },
  section: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.text, marginBottom: 12 },
  card: { marginBottom: 12 },
  cardJudul: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.text, marginBottom: 8 },
  baris: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  barisLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.muted },
  barisNilai: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: COLORS.text },
  note: { backgroundColor: COLORS.soft, marginTop: 4 },
  noteText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.muted, lineHeight: 18 },
});