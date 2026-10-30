import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, ScrollView, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Sesuaikan path import dengan struktur folder Anda
import { Card } from '@/components/Card';
import { InputField } from '@/components/InputField';
import { GradientButton } from '@/components/GradientButton';

export default function LoginScreen() {
  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ nisn: '', password: '' });

  function handleLogin() {
    const nextErrors = {
      nisn: nisn.trim() ? '' : 'NISN wajib diisi.',
      password: password ? '' : 'Password wajib diisi.',
    };
    
    setErrors(nextErrors);
    
    if (nextErrors.nisn || nextErrors.password) return;

    router.push({
      pathname: '/verification',
      params: { nisn: nisn.trim(), password },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.bgLight} />
        <View style={styles.blob1} />
        <View style={styles.blob2} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          
          <View style={styles.heading}>
            <Text style={styles.title}>Selamat Datang</Text>
            <Text style={styles.subtitle}>Masuk menggunakan akun siswa{'\n'}kamu</Text>
          </View>

          <Card style={styles.cardPadding}>
            <InputField
              label="NISN / Username"
              placeholder="Masukkan NISN"
              keyboardType="numeric"
              value={nisn}
              onChangeText={(val) => { setNisn(val); setErrors(prev => ({ ...prev, nisn: '' })); }}
              error={errors.nisn}
            />

            <InputField
              label="Password"
              placeholder="Masukkan password"
              isPassword
              value={password}
              onChangeText={(val) => { setPassword(val); setErrors(prev => ({ ...prev, password: '' })); }}
              error={errors.password}
            />

            <Pressable style={styles.helpButton}>
              <Text style={styles.helpText}>Lupa password? Hubungi operator</Text>
            </Pressable>

            <GradientButton text="Masuk" onPress={handleLogin} />
          </Card>

          <Pressable style={styles.registerButton}>
            <Text style={styles.registerText}>Belum punya akun? Hubungi sekolah</Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, zIndex: 1 },
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  bgLight: { ...StyleSheet.absoluteFill, backgroundColor: '#F8FAFC' },
  blob1: { position: 'absolute', top: -50, left: -100, width: 350, height: 350, borderRadius: 175, backgroundColor: '#DDEBFF', opacity: 0.6 },
  blob2: { position: 'absolute', top: 200, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#E5F2FF', opacity: 0.6 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 40 },
  heading: { alignItems: 'center', marginBottom: 32 },
  title: { fontFamily: 'Inter_700Bold', fontWeight: 'bold', fontSize: 26, color: '#0F172A', textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginTop: 8 },
  cardPadding: { padding: 24 },
  helpButton: { alignSelf: 'center', marginTop: 8, marginBottom: 24 },
  helpText: { fontFamily: 'Inter_500Medium', fontWeight: '600', fontSize: 12, color: '#2575FC' },
  registerButton: { alignItems: 'center', marginTop: 40 },
  registerText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#64748B' },
});