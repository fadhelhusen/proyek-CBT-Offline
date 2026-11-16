// src/app/detail-ujian.tsx
// Dibuka dari tombol "Siap" / "Download" di home-dashboard:
//   router.push({ pathname: '/detail-ujian', params: { id: 'matematika', status: 'siap' | 'download' } })
//   status 'siap'     -> langsung tampil "OFFLINE READY"
//   status 'download' -> tampil "BELUM DOWNLOAD" + alur download (simulasi UI)

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DownloadButton } from '@/components/DownloadButton';

type ExamState = 'INITIAL' | 'PROGRESS' | 'SUCCESS' | 'READY';

type ExamInfo = { title: string; questions: number; minutes: number; size: string };

// Data contoh (ukuran file hanya simulasi UI). Ganti dengan data asli nanti.
const EXAMS: Record<string, ExamInfo> = {
  matematika: { title: 'Matematika', questions: 40, minutes: 90, size: '12.4 MB' },
  'b-indonesia': { title: 'B. Indonesia', questions: 45, minutes: 90, size: '10.8 MB' },
};

const C = {
  ink: '#0F172A',
  muted: '#64748B',
  soft: '#94A3B8',
  blue: '#2575FC',
  blueTint: '#EAF2FF',
  green: '#22C55E',
  greenTint: '#E8FBEF',
};

export default function DetailUjianScreen() {
  const { id, status } = useLocalSearchParams<{ id?: string; status?: string }>();
  const exam = EXAMS[id ?? ''] ?? EXAMS.matematika;
  const initialState: ExamState = status === 'siap' ? 'READY' : 'INITIAL';

  const [examState, setExamState] = useState<ExamState>(initialState);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Semua timer simulasi disimpan agar bisa dibatalkan (layar ini tidak di-unmount saat pindah halaman)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const schedule = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Ujian / status berubah (mis. buka dari kartu lain) -> mulai dari awal
  useEffect(() => {
    clearTimers();
    setExamState(initialState);
    setShowModal(false);
    setProgress(0);
    return clearTimers;
  }, [id, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const goBack = () => router.navigate('/home-dashboard');

  // Tombol back Android: kembali ke dashboard, tapi diblokir saat download berjalan
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (examState !== 'PROGRESS') router.navigate('/home-dashboard');
        return true;
      });
      return () => sub.remove();
    }, [examState]),
  );

  // Simulasi alur proses download untuk kebutuhan UI/UX
  const handleStartDownload = () => {
    clearTimers();
    setShowModal(false);
    setExamState('PROGRESS');
    setProgress(0);

    schedule(() => setProgress(58), 500);
    schedule(() => setProgress(72), 1200);
    schedule(() => setProgress(85), 1800);
    schedule(() => {
      setProgress(100);
      // Jeda 300ms agar bar penuh dan angka 100% terlihat sebelum layar berubah hijau
      schedule(() => setExamState('SUCCESS'), 300);
    }, 2500);
  };

  const handleContinue = () => setExamState('READY');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.bgLight} />
        <View style={styles.blob1} />
        <View style={styles.blob2} />
      </View>

      {/* Tampilan Kondisional: Progress / Success State */}
      {examState === 'PROGRESS' || examState === 'SUCCESS' ? (
        <View style={styles.centerContainer}>
          <Text style={styles.headerTitle}>Download Soal</Text>
          <Text style={styles.headerSubtitle}>Simpan soal agar bisa offline</Text>

          <View style={styles.downloadCard}>
            <View
              style={[
                styles.iconCircleLarge,
                examState === 'SUCCESS' && styles.iconCircleSuccess,
              ]}
            >
              <Ionicons
                name={examState === 'SUCCESS' ? 'checkmark' : 'arrow-down'}
                size={36}
                color={examState === 'SUCCESS' ? C.green : C.blue}
              />
            </View>

            <Text style={styles.statusTitle}>
              {examState === 'PROGRESS' ? 'Mengunduh Soal' : 'Download Selesai'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {exam.title} • {exam.size} • Paket terenkripsi
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progress}%`,
                    backgroundColor: examState === 'SUCCESS' ? C.green : C.blue,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, examState === 'SUCCESS' && { color: C.green }]}>
              {progress}%
            </Text>
          </View>

          {examState === 'PROGRESS' && (
            <Text style={styles.infoFooterText}>
              Jangan tutup aplikasi selama proses download.
            </Text>
          )}

          {examState === 'SUCCESS' && (
            <DownloadButton
              title="Lanjutkan"
              onPress={handleContinue}
              style={{ marginTop: 40 }}
            />
          )}
        </View>
      ) : (
        /* Tampilan Utama: Initial & Ready Offline State */
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={goBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color={C.ink} />
          </Pressable>

          <Text style={styles.screenTitle}>Detail Ujian</Text>
          <Text style={styles.screenSubtitle}>
            {examState === 'READY' ? 'Soal sudah siap offline' : 'Cek informasi sebelum mulai'}
          </Text>

          {/* Card Ujian */}
          <View style={styles.examCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text-outline" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.examTitle}>{exam.title}</Text>
            <Text style={styles.examInfo}>
              {exam.questions} soal • {exam.minutes} menit
            </Text>

            <View
              style={[
                styles.badge,
                { backgroundColor: examState === 'READY' ? C.greenTint : '#FEF3C7' },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: examState === 'READY' ? '#16A34A' : '#D97706' },
                ]}
              >
                {examState === 'READY' ? 'OFFLINE READY' : 'BELUM DOWNLOAD'}
              </Text>
            </View>

            <Text style={styles.examDescription}>
              Ujian hanya dapat dimulai setelah soal tersimpan offline dan token valid.
            </Text>
          </View>

          {/* List Ketentuan Ujian */}
          <View style={styles.rulesContainer}>
            <RuleItem
              title={examState === 'READY' ? 'Soal tersimpan offline' : 'Dikerjakan offline'}
            />
            <RuleItem
              title={examState === 'READY' ? 'Baterai cukup' : 'Tidak bisa keluar aplikasi saat ujian'}
            />
            <RuleItem
              title={examState === 'READY' ? 'Mode aman siap diaktifkan' : 'Internet akan terdeteksi sistem'}
            />
          </View>

          {/* Tombol Utama */}
          <View style={styles.actionContainer}>
            {examState === 'INITIAL' ? (
              <DownloadButton title="Download Soal" onPress={() => setShowModal(true)} />
            ) : (
              <DownloadButton
                title="Masukkan Token"
                onPress={() => router.push('/token-ujian')}
              />
            )}
          </View>
        </ScrollView>
      )}

      {/* Modal Konfirmasi Download */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="arrow-down" size={28} color={C.blue} />
            </View>
            <Text style={styles.modalTitle}>Download Soal?</Text>
            <Text style={styles.modalSubtitle}>
              Pastikan koneksi stabil. Setelah selesai, soal bisa dikerjakan offline.
            </Text>

            <DownloadButton
              title="Download"
              onPress={handleStartDownload}
              style={{ marginBottom: 10 }}
            />
            <DownloadButton
              title="Batal"
              onPress={() => setShowModal(false)}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Komponen kecil untuk baris ketentuan
const RuleItem = ({ title }: { title: string }) => (
  <View style={styles.ruleItem}>
    <Ionicons name="checkmark-circle" size={20} color={C.green} />
    <Text style={styles.ruleText}>{title}</Text>
  </View>
);

const cardShadow = {
  shadowColor: '#0D1F47',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 2,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFF' },

  // Latar sama seperti login / splash
  bgLight: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#F8FAFC' },
  blob1: { position: 'absolute', top: -50, left: -100, width: 350, height: 350, borderRadius: 175, backgroundColor: '#DDEBFF', opacity: 0.6 },
  blob2: { position: 'absolute', top: 200, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#E5F2FF', opacity: 0.6 },

  scrollContent: { flexGrow: 1, padding: 20, paddingBottom: 32 },
  centerContainer: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...cardShadow,
  },
  screenTitle: { fontSize: 24, fontWeight: '700', color: C.ink },
  screenSubtitle: { fontSize: 14, color: C.muted, marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: C.ink },
  headerSubtitle: { fontSize: 14, color: C.muted, marginBottom: 30 },

  examCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    ...cardShadow,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  examTitle: { fontSize: 18, fontWeight: '700', color: C.ink },
  examInfo: { fontSize: 13, color: C.muted, marginTop: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  examDescription: { fontSize: 12, color: C.muted, textAlign: 'center', marginTop: 12 },

  rulesContainer: { gap: 12, marginBottom: 30 },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    gap: 10,
    ...cardShadow,
  },
  ruleText: { fontSize: 14, fontWeight: '500', color: '#334155' },
  actionContainer: { marginTop: 'auto' },

  // Modal & download card
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.blueTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 8 },
  modalSubtitle: { fontSize: 13, color: C.muted, textAlign: 'center', marginBottom: 20 },
  cancelButton: { backgroundColor: '#F1F5F9' },
  cancelButtonText: { color: '#334155' },

  downloadCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...cardShadow,
  },
  iconCircleLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.blueTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircleSuccess: { backgroundColor: C.greenTint },
  statusTitle: { fontSize: 18, fontWeight: '700', color: C.ink },
  statusSubtitle: { fontSize: 12, color: C.muted, marginTop: 4, marginBottom: 20 },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 12, fontWeight: '600', color: C.blue, marginTop: 8 },
  infoFooterText: { fontSize: 12, color: C.soft, marginTop: 20, textAlign: 'center' },
});
