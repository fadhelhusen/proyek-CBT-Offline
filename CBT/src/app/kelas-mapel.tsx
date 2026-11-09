// Kelas & mapel (CRUD) — khusus admin.
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform,
  Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import type { Href } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { adminHapusRef, adminListRef, adminTambahRef, adminUbahRef } from '@/services/api';
import type { JenisRef, Referensi } from '@/data/types';
import { InputField } from '@/components/InputField';
import { GradientButton } from '@/components/GradientButton';
import AppCard from '@/components/atoms/AppCard';
import { COLORS } from '@/components/DashboardParts';

const TAB: { key: JenisRef; label: string; contoh: string }[] = [
  { key: 'kelas', label: 'Kelas', contoh: 'Contoh: X-A' },
  { key: 'mapel', label: 'Mata pelajaran', contoh: 'Contoh: Matematika' },
];

export default function KelasMapel() {
  const { user, kredensial } = useAuth();
  const [jenis, setJenis] = useState<JenisRef>('kelas');
  const [daftar, setDaftar] = useState<Referensi[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState('');

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Referensi | null>(null);
  const [nama, setNama] = useState('');
  const [errNama, setErrNama] = useState('');
  const [pesan, setPesan] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  const info = TAB.find((t) => t.key === jenis)!;

  const muat = useCallback(async () => {
    if (!kredensial) return;
    setMemuat(true);
    try {
      setDaftar(await adminListRef(kredensial, jenis));
      setGalat('');
    } catch (e) {
      setGalat(e instanceof Error ? e.message : 'Gagal memuat data.');
    } finally {
      setMemuat(false);
    }
  }, [kredensial, jenis]);

  useFocusEffect(useCallback(() => { muat(); }, [muat]));

  const bukaTambah = () => {
    setEditing(null); setNama(''); setErrNama(''); setPesan(''); setModal(true);
  };
  const bukaUbah = (r: Referensi) => {
    setEditing(r); setNama(r.nama); setErrNama(''); setPesan(''); setModal(true);
  };

  const simpan = async () => {
    if (!kredensial) return;
    if (!nama.trim()) { setErrNama('Nama wajib diisi.'); return; }
    setMenyimpan(true);
    try {
      if (editing) await adminUbahRef(kredensial, editing.id, nama.trim());
      else await adminTambahRef(kredensial, jenis, nama.trim());
      setModal(false);
      await muat();
    } catch (err) {
      setPesan(err instanceof Error ? err.message : 'Gagal menyimpan.');
    } finally {
      setMenyimpan(false);
    }
  };

  const konfirmasiHapus = (r: Referensi) => {
    Alert.alert('Hapus', `Hapus "${r.nama}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          if (!kredensial) return;
          try {
            await adminHapusRef(kredensial, r.id);
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
        <View style={styles.topRow}>
          <Pressable onPress={() => router.replace('/dashboard-admin' as Href)} hitSlop={10}>
            <Text style={styles.back}>‹ Kembali</Text>
          </Pressable>
          <Pressable onPress={bukaTambah} style={styles.addBtn} accessibilityRole="button">
            <Text style={styles.addText}>+ Tambah</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>Kelas & Mapel</Text>
        <Text style={styles.muted}>{daftar.length} {info.label.toLowerCase()} terdaftar</Text>

        <View style={styles.chips}>
          {TAB.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => setJenis(t.key)}
              style={[styles.chip, jenis === t.key && styles.chipOn]}
            >
              <Text style={[styles.chipText, jenis === t.key && styles.chipTextOn]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {memuat && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />}
        {!!galat && <Text style={styles.error}>{galat}</Text>}
        {!memuat && !galat && daftar.length === 0 && (
          <Text style={[styles.muted, { marginTop: 24, textAlign: 'center' }]}>Belum ada data.</Text>
        )}

        {daftar.map((r) => (
          <AppCard key={r.id} style={styles.row} padding={16} radius={18}>
            <Pressable style={{ flex: 1 }} onPress={() => bukaUbah(r)}>
              <Text style={styles.name}>{r.nama}</Text>
              <Text style={styles.sub}>
                {r.dipakai > 0 ? `Dipakai ${r.dipakai} data` : 'Belum dipakai'}
              </Text>
            </Pressable>
            <Pressable onPress={() => bukaUbah(r)} hitSlop={8} style={styles.act}>
              <Text style={styles.actText}>Ubah</Text>
            </Pressable>
            <Pressable onPress={() => konfirmasiHapus(r)} hitSlop={8} style={styles.act}>
              <Text style={[styles.actText, { color: COLORS.red }]}>Hapus</Text>
            </Pressable>
          </AppCard>
        ))}
      </ScrollView>

      <Modal visible={modal} animationType="slide" transparent onRequestClose={() => setModal(false)}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>
                {editing ? 'Ubah' : 'Tambah'} {info.label}
              </Text>
              <InputField
                label={`Nama ${info.label.toLowerCase()}`}
                placeholder={info.contoh}
                value={nama}
                onChangeText={(v) => { setNama(v); setErrNama(''); setPesan(''); }}
                error={errNama}
              />
              {editing && editing.dipakai > 0 && (
                <Text style={styles.muted}>
                  Nama di {editing.dipakai} akun/ujian yang memakainya ikut berubah.
                </Text>
              )}
              {!!pesan && <Text style={styles.error}>{pesan}</Text>}
              <View style={{ marginTop: 12 }}>
                <GradientButton text={menyimpan ? 'Menyimpan…' : 'Simpan'} onPress={menyimpan ? () => {} : simpan} />
              </View>
              <Pressable onPress={() => setModal(false)} style={styles.cancel} disabled={menyimpan}>
                <Text style={styles.actText}>Batal</Text>
              </Pressable>
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
  sheet: { backgroundColor: COLORS.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
  sheetTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: COLORS.text, marginBottom: 12 },
  cancel: { alignSelf: 'center', paddingVertical: 14 },
});