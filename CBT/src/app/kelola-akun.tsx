// Kelola akun (CRUD) — khusus admin.
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform,
  Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import type { Href } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import {
  adminHapusAkun, adminListAkun, adminTambahAkun, adminUbahAkun,
} from '@/services/api';
import type { Akun, AkunInput } from '@/data/types';
import type { Role } from '@/constants/roles';
import { InputField } from '@/components/InputField';
import { GradientButton } from '@/components/GradientButton';
import AppCard from '@/components/atoms/AppCard';
import { COLORS } from '@/components/DashboardParts';

type Form = { username: string; nama: string; role: Role; kelas: string; mapel: string; password: string };
type Errors = Partial<Record<keyof Form, string>>;

const KOSONG: Form = { username: '', nama: '', role: 'siswa', kelas: '', mapel: '', password: '' };
const ROLES: { key: Role; label: string }[] = [
  { key: 'siswa', label: 'Siswa' },
  { key: 'guru', label: 'Guru' },
  { key: 'admin', label: 'Admin' },
];

export default function KelolaAkun() {
  const { user, kredensial, perbaruiKredensial } = useAuth();
  const { tambah } = useLocalSearchParams<{ tambah?: string }>();
  const [akun, setAkun] = useState<Akun[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState('');
  const [filter, setFilter] = useState<'semua' | Role>('semua');

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Akun | null>(null);
  const [form, setForm] = useState<Form>(KOSONG);
  const [errors, setErrors] = useState<Errors>({});
  const [pesan, setPesan] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  const muat = useCallback(async () => {
    if (!kredensial) return;
    setMemuat(true);
    try {
      setAkun(await adminListAkun(kredensial));
      setGalat('');
    } catch (e) {
      setGalat(e instanceof Error ? e.message : 'Gagal memuat akun.');
    } finally {
      setMemuat(false);
    }
  }, [kredensial]);

  useFocusEffect(useCallback(() => { muat(); }, [muat]));

  const tampil = akun.filter((a) => filter === 'semua' || a.role === filter);

  /* ---------- buka form ---------- */
  const bukaTambah = () => {
    setEditing(null); setForm(KOSONG); setErrors({}); setPesan(''); setModal(true);
  };
  const bukaUbah = (a: Akun) => {
    setEditing(a);
    setForm({
      username: a.username, nama: a.nama, role: a.role,
      kelas: a.kelas ?? '', mapel: a.mapel ?? '', password: '',
    });
    setErrors({}); setPesan(''); setModal(true);
  };

  const ubahField = (k: keyof Form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    setPesan('');
  };

  // dari dashboard: tombol "Tambah akun" langsung membuka form
  useFocusEffect(
    useCallback(() => {
      if (tambah === '1') {
        bukaTambah();
        router.setParams({ tambah: '' });
      }
    }, [tambah]),
  );

  /* ---------- validasi ---------- */
  const validasi = (): Errors => {
    const e: Errors = {};
    if (form.username.trim().length < 3) e.username = 'Username minimal 3 karakter.';
    if (!form.nama.trim()) e.nama = 'Nama wajib diisi.';
    if (form.role === 'siswa' && !form.kelas.trim()) e.kelas = 'Kelas wajib diisi.';
    if (form.role === 'guru' && !form.mapel.trim()) e.mapel = 'Mapel wajib diisi.';
    if (!editing && form.password.length < 6) e.password = 'Password minimal 6 karakter.';
    if (editing && form.password && form.password.length < 6) e.password = 'Password minimal 6 karakter.';
    return e;
  };

  /* ---------- simpan (tambah / ubah) ---------- */
  const simpan = async () => {
    if (!kredensial) return;
    const e = validasi();
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    const payload: AkunInput = {
      username: form.username.trim(),
      nama: form.nama.trim(),
      role: form.role,
      kelas: form.role === 'siswa' ? form.kelas.trim() : null,
      mapel: form.role === 'guru' ? form.mapel.trim() : null,
    };

    setMenyimpan(true);
    try {
      if (editing) {
        await adminUbahAkun(kredensial, editing.id, payload, form.password || undefined);
        // Admin mengubah akunnya sendiri: sinkronkan sesi supaya tidak "Akses ditolak"
        if (editing.username === kredensial.username) {
          perbaruiKredensial({
            username: payload.username,
            ...(form.password ? { password: form.password } : {}),
          });
        }
      } else {
        await adminTambahAkun(kredensial, payload, form.password);
      }
      setModal(false);
      await muat();
    } catch (err) {
      setPesan(err instanceof Error ? err.message : 'Gagal menyimpan.');
    } finally {
      setMenyimpan(false);
    }
  };

  /* ---------- hapus ---------- */
  const konfirmasiHapus = (a: Akun) => {
    const catatan = a.role === 'guru' ? '\nUjian milik guru ini ikut terhapus.' : '';
    Alert.alert('Hapus akun', `Hapus akun ${a.nama}?${catatan}`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          if (!kredensial) return;
          try {
            await adminHapusAkun(kredensial, a.id);
            await muat();
          } catch (err) {
            Alert.alert('Gagal menghapus', err instanceof Error ? err.message : 'Terjadi kesalahan.');
          }
        },
      },
    ]);
  };

  /* ---------- penjaga: khusus admin ---------- */
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
        {/* header */}
        <View style={styles.topRow}>
          <Pressable onPress={() => router.replace('/dashboard-admin' as Href)} hitSlop={10}>
            <Text style={styles.back}>‹ Kembali</Text>
          </Pressable>
          <Pressable onPress={bukaTambah} style={styles.addBtn} accessibilityRole="button">
            <Text style={styles.addText}>+ Tambah</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>Kelola Akun</Text>
        <Text style={styles.muted}>{akun.length} akun terdaftar</Text>

        {/* filter */}
        <View style={styles.chips}>
          {(['semua', 'siswa', 'guru', 'admin'] as const).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.chip, filter === f && styles.chipOn]}
            >
              <Text style={[styles.chipText, filter === f && styles.chipTextOn]}>
                {f === 'semua' ? 'Semua' : f[0].toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {memuat && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />}
        {!!galat && <Text style={styles.error}>{galat}</Text>}
        {!memuat && !galat && tampil.length === 0 && (
          <Text style={[styles.muted, { marginTop: 24, textAlign: 'center' }]}>Belum ada akun.</Text>
        )}

        {/* daftar */}
        {tampil.map((a) => (
          <AppCard key={a.id} style={styles.row} padding={16} radius={18}>
            <Pressable style={{ flex: 1 }} onPress={() => bukaUbah(a)}>
              <Text style={styles.name}>{a.nama}</Text>
              <Text style={styles.sub}>
                {a.username} • {a.role}
                {a.kelas ? ` • ${a.kelas}` : ''}
                {a.mapel ? ` • ${a.mapel}` : ''}
              </Text>
            </Pressable>
            <Pressable onPress={() => bukaUbah(a)} hitSlop={8} style={styles.act}>
              <Text style={styles.actText}>Ubah</Text>
            </Pressable>
            <Pressable onPress={() => konfirmasiHapus(a)} hitSlop={8} style={styles.act}>
              <Text style={[styles.actText, { color: COLORS.red }]}>Hapus</Text>
            </Pressable>
          </AppCard>
        ))}
      </ScrollView>

      {/* form tambah / ubah */}
      <Modal visible={modal} animationType="slide" transparent onRequestClose={() => setModal(false)}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>{editing ? 'Ubah Akun' : 'Tambah Akun'}</Text>
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Peran</Text>
                <View style={styles.chips}>
                  {ROLES.map((r) => (
                    <Pressable
                      key={r.key}
                      onPress={() => ubahField('role', r.key)}
                      style={[styles.chip, form.role === r.key && styles.chipOn]}
                    >
                      <Text style={[styles.chipText, form.role === r.key && styles.chipTextOn]}>{r.label}</Text>
                    </Pressable>
                  ))}
                </View>

                <InputField
                  label={form.role === 'siswa' ? 'NISN / Username' : 'Username'}
                  placeholder="Masukkan username"
                  value={form.username}
                  onChangeText={(v) => ubahField('username', v)}
                  error={errors.username}
                />
                <InputField
                  label="Nama lengkap"
                  placeholder="Masukkan nama"
                  value={form.nama}
                  onChangeText={(v) => ubahField('nama', v)}
                  error={errors.nama}
                />
                {form.role === 'siswa' && (
                  <InputField
                    label="Kelas"
                    placeholder="Contoh: X-A"
                    value={form.kelas}
                    onChangeText={(v) => ubahField('kelas', v)}
                    error={errors.kelas}
                  />
                )}
                {form.role === 'guru' && (
                  <InputField
                    label="Mata pelajaran"
                    placeholder="Contoh: Matematika"
                    value={form.mapel}
                    onChangeText={(v) => ubahField('mapel', v)}
                    error={errors.mapel}
                  />
                )}
                <InputField
                  label={editing ? 'Password baru (kosongkan bila tidak diubah)' : 'Password'}
                  placeholder="Minimal 6 karakter"
                  isPassword
                  value={form.password}
                  onChangeText={(v) => ubahField('password', v)}
                  error={errors.password}
                />

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