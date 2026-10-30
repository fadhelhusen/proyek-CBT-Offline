import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const timelineItems = [
  { title: 'Soal diunduh', description: 'Berhasil disiapkan' },
  { title: 'Token diverifikasi', description: 'Berhasil disiapkan' },
  { title: 'Mode offline aktif', description: 'Berhasil disiapkan' },
  { title: 'Internet diblokir', description: 'Berhasil disiapkan' },
  { title: 'Ujian siap dimulai', description: 'Berhasil disiapkan' },
];

export default function ExamLockTimelineScreen() {
  const [isActivating, setIsActivating] = useState(false);

  const handleActivateSecureMode = () => {
    if (isActivating) return;

    setIsActivating(true);
    setTimeout(() => setIsActivating(false), 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Exam Lock Timeline</Text>
          <Text style={styles.subtitle}>
            Persiapan sebelum ujian dimulai
          </Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.shieldCircle}>
            <Ionicons
              name="shield-checkmark-outline"
              size={42}
              color="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.timeline}>
          {timelineItems.map((item, index) => {
            const isLast = index === timelineItems.length - 1;

            return (
              <View key={item.title} style={styles.timelineItem}>
                <View style={styles.timelineIndicator}>
                  <View style={styles.checkCircle}>
                    <Ionicons
                      name="checkmark"
                      size={19}
                      color="#16B86A"
                    />
                  </View>

                  {!isLast && <View style={styles.timelineLine} />}
                </View>

                <View style={styles.timelineText}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable
          onPress={handleActivateSecureMode}
          disabled={isActivating}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && !isActivating && styles.buttonPressed,
          ]}
        >
          {isActivating ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.buttonText}>
                Mengaktifkan Secure Mode...
              </Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>
              Aktifkan Secure Mode
            </Text>
          )}
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

  scrollView: {
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

  timeline: {
    gap: 0,
  },

  timelineItem: {
    flexDirection: 'row',
    minHeight: 65,
  },

  timelineIndicator: {
    width: 40,
    alignItems: 'center',
  },

  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E4F9EE',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  timelineLine: {
    position: 'absolute',
    top: 30,
    bottom: 0,
    width: 2,
    backgroundColor: '#B7EBD0',
  },

  timelineText: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 20,
  },

  itemTitle: {
    color: '#172033',
    fontSize: 14,
    fontWeight: '700',
  },

  itemDescription: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 5,
  },

  primaryButton: {
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

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});