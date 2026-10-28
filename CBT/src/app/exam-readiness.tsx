import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

const checks = [
  {
    title: 'Baterai cukup',
    description: 'Perangkat siap digunakan.',
  },
  {
    title: 'Soal tersimpan offline',
    description: 'File soal sudah aman.',
  },
  {
    title: 'Penyimpanan cukup',
    description: 'Tidak ada masalah memori.',
  },
  {
    title: 'PIN operator tersedia',
    description: 'Untuk kondisi darurat.',
  },
];

export default function ExamReadinessScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('../exam-lock-timeline');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Readiness Check</Text>
          <Text style={styles.subtitle}>
            Persiapan sebelum ujian dimulai
          </Text>
        </View>

        {/* Ilustrasi */}
        <View style={styles.heroCard}>
          <View style={styles.shieldCircle}>
            <View style={styles.shield}>
              <Text style={styles.shieldCheck}>✓</Text>
            </View>
          </View>
        </View>

        {/* Daftar pemeriksaan */}
        <View style={styles.checkList}>
          {checks.map((item) => (
            <View key={item.title} style={styles.checkCard}>
              <View style={styles.checkIcon}>
                <Text style={styles.checkMark}>✓</Text>
              </View>

              <View style={styles.checkTextContainer}>
                <Text style={styles.checkTitle}>
                  {item.title}
                </Text>
                <Text style={styles.checkDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tombol Lanjutkan */}
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
        >
          <Text style={styles.continueText}>Lanjutkan</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F7FF',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 30,
    backgroundColor: '#F2F7FF',
  },

  header: {
    marginBottom: 28,
  },

  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.7,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },

  heroCard: {
    height: 170,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 5,
    shadowColor: '#0F172A',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },

  shieldCircle: {
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: '#3883FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -30,
  },

  shield: {
    width: 43,
    height: 48,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  shieldCheck: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '500',
  },

  checkList: {
    gap: 14,
  },

  checkCard: {
    minHeight: 68,
    borderRadius: 23,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },

  checkIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E4F9EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  checkMark: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16B86A',
  },

  checkTextContainer: {
    flex: 1,
  },

  checkTitle: {
    color: '#172033',
    fontSize: 14,
    fontWeight: '700',
  },

  checkDescription: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 5,
  },

  continueButton: {
    height: 54,
    borderRadius: 19,
    backgroundColor: '#2477FF',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 32,
    elevation: 4,
    shadowColor: '#2477FF',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },

  buttonPressed: {
    opacity: 0.8,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});