import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';

export default function VerificationScreen() {
  const { nisn, password } = useLocalSearchParams<{ nisn: string; password: string; }>();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      const valid = nisn === '2488010000' && password === 'siswa123';
    if (valid) {
      router.replace('/dashboard');
    } else {
      router.replace('/login-error');
    }
    }, 2200);

    return () => clearTimeout(timer);
  }, [nisn, password]);

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.bgLight} />
        <View style={styles.blob1} />
        <View style={styles.blob2} />
      </View>

      <Card style={styles.cardLayout}>
        <View style={styles.iconContainer}>
          <LinearGradient colors={['#2575FC', '#4A90E2']} style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Memverifikasi akun...</Text>
        <Text style={styles.subtitle}>Mohon tunggu sebentar</Text>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]}>
            <LinearGradient colors={['#2575FC', '#51D7F5']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          </Animated.View>
        </View>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F8FAFC' },
  bgLight: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F8FAFC' },
  blob1: { position: 'absolute', top: -50, left: -100, width: 350, height: 350, borderRadius: 175, backgroundColor: '#DDEBFF', opacity: 0.6 },
  blob2: { position: 'absolute', top: 200, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#E5F2FF', opacity: 0.6 },
  cardLayout: { maxWidth: 340, alignItems: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  iconContainer: { shadowColor: '#2575FC', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8, marginBottom: 24 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontWeight: 'bold', fontSize: 18, color: '#0F172A', textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#64748B', marginTop: 8 },
  progressTrack: { width: '80%', height: 6, backgroundColor: '#E2E8F0', borderRadius: 10, marginTop: 32, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 10 },
});