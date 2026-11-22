import React, { useEffect } from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { useAuth } from '@/context/auth-context';
import { ROLE_HOME } from '@/constants/roles';
import { debugLog } from '@/lib/debug';
import { oauthBoot } from '@/lib/oauth-return';

// Tampilan hasil login Google. Prosesnya sendiri dijalankan oleh
// AuthProvider, jadi tampilan ini aman dipakai di /auth/callback maupun di /.
export function OAuthCallbackView() {
  const router = useRouter();
  const { user, oauthStatus, oauthError } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      debugLog('VIEW callback tampil di ' + window.location.href);
    }
  }, []);

  // Login Google berhasil: masuk ke dashboard sesuai peran.
  useEffect(() => {
    if (!user || oauthStatus !== 'success') return;

    debugLog('VIEW pindah ke ' + ROLE_HOME[user.role]);
    router.replace(ROLE_HOME[user.role]);
  }, [user, oauthStatus, router]);

  const handleBackToLogin = () => {
    router.replace('/login');
  };

  const tidakAdaProses =
    oauthStatus === 'idle' && !oauthBoot.isCallback;

  const hasError = oauthStatus === 'error' || tidakAdaProses;

  const message = tidakAdaProses
    ? 'Tidak ada proses login Google yang sedang berjalan.'
    : oauthError ?? 'Akun tidak dapat diverifikasi.';

  return (
    <View style={styles.container}>
      {hasError ? (
        <>
          <Text style={styles.errorIcon}>!</Text>

          <Text style={styles.title}>
            Login Google Gagal
          </Text>

          <Text style={styles.message}>{message}</Text>

          <Pressable
            style={styles.button}
            onPress={handleBackToLogin}
          >
            <Text style={styles.buttonText}>
              Kembali ke Login
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <ActivityIndicator
            size="large"
            color="#208AEF"
          />

          <Text style={styles.title}>
            Memverifikasi Akun
          </Text>

          <Text style={styles.message}>
            Mohon tunggu, kami sedang memeriksa akun Google kamu.
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  errorIcon: {
    width: 54,
    height: 54,
    lineHeight: 54,
    textAlign: 'center',
    borderRadius: 27,
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    fontSize: 30,
    fontWeight: '700',
    overflow: 'hidden',
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '700',
    color: '#192F53',
    textAlign: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 360,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#376CCB',
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});