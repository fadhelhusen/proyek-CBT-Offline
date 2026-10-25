
import { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AppText from '@/components/atoms/AppText';
import AppButton from '@/components/atoms/AppButton';
import AppCard from '@/components/atoms/AppCard';
import TokenCodeInput from '@/components/molecules/TokenCodeInput';

export default function TokenUjianScreen() {
  const router = useRouter();

  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleTokenChange = (value: string) => {
    setToken(value);
    setTokenError('');
    setErrorMessage('');
  };

  const handleVerify = async () => {
    if (isVerifying) return;

    if (token.length !== 6) {
      setTokenError('Token harus terdiri dari 6 angka.');
      return;
    }

    setTokenError('');
    setErrorMessage('');
    setIsVerifying(true);

    try {
      // Simulasi proses verifikasi selama 1,5 detik.
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1500);
      });

      // Pindah ke halaman Exam Readiness setelah loading.
      router.replace('/exam-readiness');
    } catch {
      setErrorMessage('Verifikasi gagal. Silakan coba lagi.');
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        {/* Header */}
        <View style={styles.heading}>
          <AppText variant="title">
            Token Ujian
          </AppText>

          <AppText variant="subtitle">
            Masukkan token dari guru
          </AppText>
        </View>

        {/* Kartu Token */}
        <AppCard
          padding={24}
          radius={28}
          style={styles.card}
        >
          <View style={styles.iconCircle}>
            <Ionicons
              name="key-outline"
              size={42}
              color="#2477FF"
            />
          </View>

          <Text style={styles.subjectTitle}>
            Matematika
          </Text>

          <Text style={styles.description}>
            Masukkan kode token untuk memulai ujian.
          </Text>

          {/* Input Token */}
          <View style={styles.tokenContainer}>
            <TokenCodeInput
              value={token}
              onChangeText={handleTokenChange}
              length={6}
              error={tokenError}
              disabled={isVerifying}
            />
          </View>

          {/* Pesan Error Token */}
          {tokenError !== '' && (
            <Text
              style={styles.errorText}
              accessibilityRole="alert"
            >
              {tokenError}
            </Text>
          )}

          {/* Pesan Error Verifikasi */}
          {errorMessage !== '' && (
            <Text
              style={styles.errorText}
              accessibilityRole="alert"
            >
              {errorMessage}
            </Text>
          )}

          <Text style={styles.helperText}>
            Token terdiri dari 6 angka.
          </Text>
        </AppCard>

        {/* Tombol Verifikasi dengan Loading */}
        <View style={styles.buttonContainer}>
          {isVerifying ? (
            <View
              style={styles.loadingButton}
              accessibilityRole="progressbar"
              accessibilityLabel="Sedang memverifikasi token"
            >
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
              <Text style={styles.loadingText}>
                Memverifikasi...
              </Text>
            </View>
          ) : (
            <AppButton
              title="Verifikasi Token"
              onPress={handleVerify}
              disabled={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F7FF',
  },

  scrollView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },

  heading: {
    gap: 8,
    marginBottom: 36,
  },

  card: {
    alignItems: 'center',
    paddingVertical: 32,
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  subjectTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 28,
  },

  tokenContainer: {
    width: '100%',
    marginBottom: 8,
  },

  errorText: {
    width: '100%',
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'left',
    marginTop: 8,
    marginBottom: 8,
  },

  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  buttonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },

  loadingButton: {
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: '#3478EF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },

  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});