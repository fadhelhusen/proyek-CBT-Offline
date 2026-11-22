import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { InputField } from '@/components/InputField';
import { GradientButton } from '@/components/GradientButton';
import { useAuth } from '@/context/auth-context';
import { clearDebug, debugLog, readDebug } from '@/lib/debug';

export default function LoginScreen() {
  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    nisn: '',
    password: '',
  });

  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const { loginWithGoogle } = useAuth();

  // [DEBUG-SEMENTARA] tampilkan jejak langkah login
  const [trace, setTrace] = useState<string[]>([]);

  useEffect(() => {
    debugLog('LOGIN tampil di ' + window.location.href);
    setTrace(readDebug());
  }, []);

  // Login siswa menggunakan NISN/username dan password.
  function handleLogin() {
    const nextErrors = {
      nisn: nisn.trim() ? '' : 'NISN wajib diisi.',
      password: password ? '' : 'Password wajib diisi.',
    };

    setErrors(nextErrors);

    if (nextErrors.nisn || nextErrors.password) return;

    router.push({
      pathname: '/verification',
      params: {
        nisn: nisn.trim(),
        password,
      },
    });
  }

  // Login guru dan admin menggunakan Google.
  async function handleGoogleLogin() {
    if (googleLoading) return;

    debugLog('KLIK tombol Google');

    setGoogleLoading(true);
    setGoogleError('');

    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('GOOGLE LOGIN ERROR:', error);

      setGoogleError(
        error instanceof Error
          ? error.message
          : 'Login Google gagal. Silakan coba lagi.'
      );

      setGoogleLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={StyleSheet.absoluteFill}>
        <View style={styles.bgLight} />
        <View style={styles.blob1} />
        <View style={styles.blob2} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heading}>
            <Text style={styles.title}>Selamat Datang</Text>

            <Text style={styles.subtitle}>
              Masuk menggunakan akun{'\n'}kamu
            </Text>
          </View>

          <Card style={styles.cardPadding}>
            <InputField
              label="NISN / Username"
              placeholder="Masukkan NISN"
              keyboardType="default"
              value={nisn}
              onChangeText={(val) => {
                setNisn(val);
                setErrors((prev) => ({
                  ...prev,
                  nisn: '',
                }));
              }}
              error={errors.nisn}
            />

            <InputField
              label="Password"
              placeholder="Masukkan password"
              isPassword
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                setErrors((prev) => ({
                  ...prev,
                  password: '',
                }));
              }}
              error={errors.password}
            />

            <Pressable style={styles.helpButton}>
              <Text style={styles.helpText}>
                Lupa password? Hubungi operator
              </Text>
            </Pressable>

            <GradientButton
              text="Masuk"
              onPress={handleLogin}
            />

            {/* Pembatas login */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ATAU</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Tombol login Google */}
            <Pressable
              style={[
                styles.googleButton,
                googleLoading && styles.googleButtonDisabled,
              ]}
              onPress={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#192F53"
                />
              ) : (
                <>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleButtonText}>
                    Masuk dengan Google
                  </Text>
                </>
              )}
            </Pressable>

            {googleError ? (
              <Text style={styles.googleError}>
                {googleError}
              </Text>
            ) : null}

            <Text style={styles.googleInfo}>
              Khusus akun Guru dan Admin
            </Text>
          </Card>

          <Pressable style={styles.registerButton}>
            <Text style={styles.registerText}>
              Belum punya akun? Hubungi sekolah
            </Text>
          </Pressable>

          {/* [DEBUG-SEMENTARA] hapus blok ini setelah masalah ketemu */}
          <View style={styles.debugBox}>
            <Text style={styles.debugTitle}>
              LOG DIAGNOSTIK (sementara)
            </Text>

            {trace.length === 0 ? (
              <Text style={styles.debugLine}>(kosong)</Text>
            ) : (
              trace.map((line, i) => (
                <Text key={i} selectable style={styles.debugLine}>
                  {line}
                </Text>
              ))
            )}

            <Pressable
              onPress={() => {
                clearDebug();
                setTrace([]);
              }}
            >
              <Text style={styles.debugClear}>Hapus log</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    zIndex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  bgLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8FAFC',
  },

  blob1: {
    position: 'absolute',
    top: -50,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#DDEBFF',
    opacity: 0.6,
  },

  blob2: {
    position: 'absolute',
    top: 200,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#E5F2FF',
    opacity: 0.6,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  heading: {
    alignItems: 'center',
    marginBottom: 32,
  },

  title: {
    fontFamily: 'Inter_700Bold',
    fontWeight: 'bold',
    fontSize: 26,
    color: '#0F172A',
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },

  cardPadding: {
    padding: 24,
  },

  helpButton: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  helpText: {
    fontFamily: 'Inter_500Medium',
    fontWeight: '600',
    fontSize: 12,
    color: '#2575FC',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },

  dividerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#94A3B8',
    marginHorizontal: 14,
  },

  googleButton: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  googleButtonDisabled: {
    opacity: 0.6,
  },

  googleIcon: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4285F4',
  },

  googleButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    fontWeight: '600',
    color: '#192F53',
  },

  googleError: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: '#DC2626',
  },

  googleInfo: {
    marginTop: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },

  registerButton: {
    alignItems: 'center',
    marginTop: 40,
  },

  registerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748B',
  },

  debugBox: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },

  debugTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FACC15',
    marginBottom: 6,
  },

  debugLine: {
    fontSize: 11,
    lineHeight: 16,
    color: '#E2E8F0',
  },

  debugClear: {
    marginTop: 8,
    fontSize: 11,
    color: '#93C5FD',
  },
});