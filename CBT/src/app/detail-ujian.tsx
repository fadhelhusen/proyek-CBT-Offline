import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DownloadButton } from '../components/ui/DownloadButton';

type ExamState = 'INITIAL' | 'PROGRESS' | 'SUCCESS' | 'READY';

export default function DetailUjianScreen() {
  const [examState, setExamState] = useState<ExamState>('INITIAL');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(58);

// Simulasi alur proses download untuk kebutuhan UI/UX
  const handleStartDownload = () => {
    setShowModal(false);
    setExamState('PROGRESS');
    setProgress(0); // Mulai dari 0%

    // Simulasi pergerakan angka progress bar secara bertahap
    setTimeout(() => setProgress(58), 500);
    setTimeout(() => setProgress(72), 1200);
    setTimeout(() => setProgress(85), 1800);

    // Mencapai 100% pada detik ke-2.5
    setTimeout(() => {
      setProgress(100);
      
      // Beri jeda 300ms agar bar penuh dan angka 100% terlihat sebelum layar berubah hijau
      setTimeout(() => {
        setExamState('SUCCESS');
      }, 300);
    }, 2500);
  };

  const handleContinue = () => {
    setExamState('READY');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tampilan Kondisional: Progress / Success State */}
      {examState === 'PROGRESS' || examState === 'SUCCESS' ? (
        <View style={styles.centerContainer}>
          <Text style={styles.headerTitle}>Download Soal</Text>
          <Text style={styles.headerSubtitle}>Simpan soal agar bisa offline</Text>

          <View style={styles.downloadCard}>
            <View style={[
              styles.iconCircleLarge, 
              examState === 'SUCCESS' && styles.iconCircleSuccess
            ]}>
              <Ionicons
                name={examState === 'SUCCESS' ? 'checkmark' : 'arrow-down'}
                size={36}
                color={examState === 'SUCCESS' ? '#22C55E' : '#3B82F6'}
              />
            </View>

            <Text style={styles.statusTitle}>
              {examState === 'PROGRESS' ? 'Mengunduh Soal' : 'Download Selesai'}
            </Text>
            <Text style={styles.statusSubtitle}>
              Matematika • 12.4 MB • Paket terenkripsi
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progress}%`,
                    backgroundColor: examState === 'SUCCESS' ? '#22C55E' : '#3B82F6',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.screenTitle}>Detail Ujian</Text>
          <Text style={styles.screenSubtitle}>
            {examState === 'READY' ? 'Soal sudah siap offline' : 'Cek informasi sebelum mulai'}
          </Text>

          {/* Card Ujian */}
          <View style={styles.examCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text-outline" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.examTitle}>Matematika</Text>
            <Text style={styles.examInfo}>40 soal • 90 menit</Text>

            <View
              style={[
                styles.badge,
                { backgroundColor: examState === 'READY' ? '#DCFCE7' : '#FEF3C7' },
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
              <DownloadButton
                title="Download Soal"
                onPress={() => setShowModal(true)}
              />
            ) : (
              <DownloadButton
                title="Masukkan Token"
                onPress={() => alert('Fitur Masukkan Token')}
              />
            )}
          </View>
        </ScrollView>
      )}

      {/* Modal Konfirmasi Download */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="arrow-down" size={28} color="#3B82F6" />
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

// Komponent Kecil untuk Baris Ketentuan
const RuleItem = ({ title }: { title: string }) => (
  <View style={styles.ruleItem}>
    <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
    <Text style={styles.ruleText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 30,
  },
  examCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  examInfo: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  examDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
  rulesContainer: {
    gap: 12,
    marginBottom: 30,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  ruleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  actionContainer: {
    marginTop: 'auto',
  },
  // Modal & Download Card Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#374151',
  },
  downloadCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  iconCircleLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircleSuccess: {
    backgroundColor: '#DCFCE7',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    marginTop: 8,
  },
  infoFooterText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 20,
    textAlign: 'center',
  },
});