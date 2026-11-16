// Kelola ujian (CRUD) — khusus admin.
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform,
  Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import type { Href } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import {
  adminHapusUjian, adminListAkun, adminListUjian, adminTambahUjian, adminUbahUjian,
} from '@/services/api';
import type { Akun, UjianAdmin, UjianStatus } from '@/data/types';
import { InputField } from '@/components/InputField';
import { GradientButton } from '@/components/GradientButton';
import AppCard from '@/components/atoms/AppCard';
import { COLORS } from '@/components/DashboardParts';

type Form = { judul: string; mapel: string; kelas: string; guruId: string; status: UjianStatus };
type Errors = Partial<Record<keyof Form, string>>;

const KOSONG: Form = { judul: '', mapel: '', kelas: '', guruId: '', status: 'terjadwal' };
const STATUS: { key: UjianStatus; label: string; color: string }[] = [
  { key: 'terjadwal', label: 'Terjadwal', color: COLORS.amber },
  { key: 'berlangsung', label: 'Berlangsung', color: COLORS.green },
  { key: 'selesai', label: 'Selesai', color: COLORS.muted },
];
const warna = (s: UjianStatus) => STATUS.find((x) => x.key === s)!.color;

export default function KelolaUjian() {
  const { user, kredensial } = useAuth();
  const [daftar, setDaftar] = useState<UjianAdmin[]>([]);
  const [guru, setGuru] = useState<Akun[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState('');
  const [filter, setFilter] = useState<'semua' | UjianStatus>('semua');

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<UjianAdmin | null>(null);
  const [form, setForm] = useState<Form>(KOSONG);
  const [errors, setErrors] = useState<Errors>({});
  const [pesan, setPesan] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  const muat = useCallback(async () => {
    if (!kredensial) return;
    setMemuat(true);
    try {
      const [u, akun] = await Promise.all([adminListUjian(kredensial), adminListAkun(kredensial)]);
      setDaftar(u);
      setGuru(akun.filter((a) => a.role === 'guru'));
      setGalat('');
    } catch (e) {
      setGalat(e instanceof Error ? e.message : 'Gagal memuat ujian.');
    } finally {
      setMemuat(false);
    }
  }, [kredensial]);

  useFocusEffect(useCallback(() => { muat(); }, [muat]));

  const tampil = daftar.filter((u) => filter === 'semua' || u.status === filter);

  const bukaTambah = () => {
    setEditing(null); setForm(KOSONG); setErrors({}); setPesan(''); setModal(true);
  };
  const bukaUbah = (u: UjianAdmin) => {
    setEditing(u);
    setForm({ judul: u.judul, mapel: u.mapel, kelas: u.kelas, guruId: u.guruId, status: u.status });
    setErrors({}); setPesan(''); setModal(true);
  };

  const ubahField = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    setPesan('');
  };

  // pilih guru -> mapel terisi otomatis bila masih kosong
  const pilihGuru = (g: Akun) => {
    setForm((f) => ({ ...f, guruId: g.id, mapel: f.mapel.trim() ? f.mapel : g.mapel ?? '' }));
    setErrors((e) => ({ ...e, guruId: undefined }));
  };

  const validasi = (): Errors => {
    const e: Errors = {};
    if (!form.judul.trim()) e.judul = 'Judul wajib diisi.';
    if (!form.mapel.trim()) e.mapel = 'Mapel wajib diisi.';
    if (!form.kelas.trim()) e.kelas = 'Kelas wajib diisi.';
    if (!form.guruId) e.guruId = 'Pilih guru pengampu.';
    return e;
  };

  const simpan = async () => {
    if (!kredensial) return;
    const e = validasi();
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    const payload = {
      judul: form.judul.trim(), mapel: form.mapel.trim(), kelas: form.kelas.trim(),
      guruId: form.guruId, status: form.status,
    };
    setMenyimpan(true);
    try {
      if (editing) await adminUbahUjian(kredensial, editing.id, payload);
      else await adminTambahUjian(kredensial, payload);
      setModal(false);
      await muat();
    } catch (err) {
      setPesan(err instanceof Error ? err.message : 'Gagal menyimpan.');
    } finally {
      setMenyimpan(false);
    }
  };

  const konfirmasiHapus = (u: UjianAdmin) => {
    Alert.alert('Hapus ujian', `Hapus ujian "${u.judul}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          if (!kredensial) return;
          try {
            await adminHapusUjian(kredensial, u.id);
            await muat();
          } catch (err) {
            Alert.alert('Gagal menghapus', err instanceof Error ? err.message : 'Terjadi kesalahan.');
          }
        },
      },
    ]);
  };

  if (user?.role !== 'admin' || !kredensial) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.muted}>Halaman ini khusus admin. Silakan login ulang.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.replace('/dashboard-admin' as Href)} hitSlop={10}>
            <Text style={styles.back}>‹ Kembali</Text>
          </Pressable>
          <Pressable onPress={bukaTambah} style={styles.addBtn} accessibilityRole="button">
            <Text style={styles.addText}>+ Tambah</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>Kelola Ujian</Text>
        <Text style={styles.muted}>{daftar.length} ujian terdaftar</Text>

        <View style={styles.chips}>
          {[{ key: 'semua' as const, label: 'Semua' }, ...STATUS].map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, filter === f.key && styles.chipOn]}
            >
              <Text style={[styles.chipText, filter === f.key && styles.chipTextOn]}>{f.label}</Text>
            </Pressable>
          ))}
        </View>

        {memuat && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />}
        {!!galat && <Text style={styles.error}>{galat}</Text>}
        {!memuat && !galat && tampil.length === 0 && (
          <Text style={[styles.muted, { marginTop: 24, textAlign: 'center' }]}>Belum ada ujian.</Text>
        )}

        {tampil.map((u) => (
          <AppCard key={u.id} style={styles.row} padding={16} radius={18}>
            <Pressable style={{ flex: 1 }} onPress={() => bukaUbah(u)}>
              <Text style={styles.name}>{u.judul}</Text>
              <Text style={styles.sub}>{u.mapel} • Kelas {u.kelas} • {u.guruNama}</Text>
              <Text style={[styles.status, { color: warna(u.status) }]}>
                {STATUS.find((s) => s.key === u.status)?.label}
              </Text>
            </Pressable>
            <Pressable onPress={() => bukaUbah(u)} hitSlop={8} style={styles.act}>
              <Text style={styles.actText}>Ubah</Text>
            </Pressable>
            <Pressable onPress={() => konfirmasiHapus(u)} hitSlop={8} style={styles.act}>
              <Text style={[styles.actText, { color: COLORS.red }]}>Hapus</Text>
            </Pressable>
          </AppCard>
        ))}
      </ScrollView>

      <Modal visible={modal} animationType="slide" transparent onRequestClose={() => setModal(false)}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>{editing ? 'Ubah Ujian' : 'Tambah Ujian'}</Text>
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <InputField
                  label="Judul ujian"
                  placeholder="Contoh: UTS Matematika"
                  value={form.judul}
                  onChangeText={(v) => ubahField('judul', v)}
                  error={errors.judul}
                />

                <Text style={styles.label}>Guru pengampu</Text>
                <View style={styles.chips}>
                  {guru.length === 0 && <Text style={styles.muted}>Belum ada akun guru.</Text>}
                  {guru.map((g) => (
                    <Pressable
                      key={g.id}
                      onPress={() => pilihGuru(g)}
                      style={[styles.chip, form.guruId === g.id && styles.chipOn]}
                    >
                      <Text style={[styles.chipText, form.guruId === g.id && styles.chipTextOn]}>{g.nama}</Text>
                    </Pressable>
                  ))}
                </View>
                {!!errors.guruId && <Text style={[styles.error, { marginTop: -8 }]}>{errors.guruId}</Text>}

                <InputField
                  label="Mata pelajaran"
                  placeholder="Contoh: Matematika"
                  value={form.mapel}
                  onChangeText={(v) => ubahField('mapel', v)}
                  error={errors.mapel}
                />
                <InputField
                  label="Kelas"
                  placeholder="Contoh: X-A"
                  value={form.kelas}
                  onChangeText={(v) => ubahField('kelas', v)}
                  error={errors.kelas}
                />

                <Text style={styles.label}>Status</Text>
                <View style={styles.chips}>
                  {STATUS.map((s) => (
                    <Pressable
                      key={s.key}
                      onPress={() => ubahField('status', s.key)}
                      style={[styles.chip, form.status === s.key && styles.chipOn]}
                    >
                      <Text style={[styles.chipText, form.status === s.key && styles.chipTextOn]}>{s.label}</Text>
                    </Pressable>
                  ))}
                </View>

                {!!pesan && <Text style={styles.error}>{pesan}</Text>}

                <View style={{ marginTop: 8 }}>
                  <GradientButton text={menyimpan ? 'Menyimpan…' : 'Simpan'} onPress={menyimpan ? () => {} : simpan} />
                </View>
                <Pressable onPress={() => setModal(false)} style={styles.cancel} disabled={menyimpan}>
                  <Text style={styles.actText}>Batal</Text>
                </Pressable>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  content: { padding: 24, paddingBottom: 48 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  back: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.primary },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  addText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#FFFFFF' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.text },
  muted: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.muted, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  chipOn: { backgroundColor: COLORS.soft, borderColor: COLORS.primary },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.muted },
  chipTextOn: { color: COLORS.primary, fontFamily: 'Inter_600SemiBold' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  name: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.text },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.muted, marginTop: 2 },
  status: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginTop: 4 },
  act: { paddingHorizontal: 8, paddingVertical: 4 },
  actText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.primary },
  error: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.red, marginVertical: 8 },
  overlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'flex-end' },
  sheetWrap: { width: '100%' },
  sheet: { backgroundColor: COLORS.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '90%' },
  sheetTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: COLORS.text, marginBottom: 12 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.text },
  cancel: { alignSelf: 'center', paddingVertical: 14 },
});