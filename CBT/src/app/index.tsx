import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SplashScreenPage() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [progress]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Latar Belakang Gradient Abstrak */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.bgLight} />
        <View style={styles.blob1} />
        <View style={styles.blob2} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <LinearGradient colors={['#2575FC', '#4A90E2']} style={styles.logo}>
            <Ionicons name="cube" size={40} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>EduCBT</Text>
        <Text style={styles.subtitle}>Ujian Aman, Hasil Nyaman</Text>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]}>
            <LinearGradient colors={['#2575FC', '#51D7F5']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          </Animated.View>
        </View>

        <Text style={styles.loadingText}>Loading secure environment...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#F4F7FB' },
  bgLight: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F8FAFC' },
  blob1: { position: 'absolute', top: -100, left: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: '#DDEBFF', opacity: 0.7 },
  blob2: { position: 'absolute', top: 150, right: -100, width: 250, height: 250, borderRadius: 125, backgroundColor: '#E5F2FF', opacity: 0.7 },
  content: { alignItems: 'center', paddingHorizontal: 24, zIndex: 1 },
  logoContainer: { shadowColor: '#2575FC', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  logo: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontWeight: 'bold', fontSize: 28, color: '#0F172A', marginTop: 24 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#64748B', marginTop: 4 },
  progressTrack: { width: 160, height: 6, backgroundColor: '#E2E8F0', borderRadius: 10, marginTop: 40, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 10 },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#94A3B8', marginTop: 12 },
});