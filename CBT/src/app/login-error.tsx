import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { GradientButton } from '@/components/GradientButton';

export default function LoginErrorScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={StyleSheet.absoluteFill}>
        <View style={styles.bgLight} />
        <View style={styles.blob1} />
        <View style={styles.blob2} />
      </View>

      <Card style={styles.cardLayout}>
        <View style={styles.errorCircle}>
          <Ionicons name="warning" size={36} color="#EF4444" />
        </View>

        <Text style={styles.title}>Login Gagal</Text>
        <Text style={styles.message}>
          NISN atau password tidak sesuai.{'\n'}Periksa kembali data akun kamu.
        </Text>

        {/* Memanfaatkan props colors untuk mengubah GradientButton menjadi merah */}
        <GradientButton 
          text="Coba Lagi" 
          colors={['#EF4444', '#F87171']} 
          onPress={() => router.replace('/login')} 
        />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F8FAFC' },
  bgLight: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F8FAFC' },
  blob1: { position: 'absolute', top: -50, left: -100, width: 350, height: 350, borderRadius: 175, backgroundColor: '#DDEBFF', opacity: 0.6 },
  blob2: { position: 'absolute', top: 200, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#E5F2FF', opacity: 0.6 },
  cardLayout: { maxWidth: 340, paddingHorizontal: 24, paddingVertical: 40, alignItems: 'center' },
  errorCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontFamily: 'Inter_700Bold', fontWeight: 'bold', fontSize: 20, color: '#EF4444' },
  message: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, color: '#64748B', textAlign: 'center', marginTop: 12, marginBottom: 32 },
});