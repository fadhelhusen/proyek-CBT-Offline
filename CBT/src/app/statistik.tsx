import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  blue: '#0F6BFF',
  ink: '#172033',
  mute: '#8290A5',
  green: '#16A36A',
  amber: '#D99000',
  white: '#FFFFFF',
  background: '#F3F7FF',
};

const GRADES = [
  { subject: 'Matematika', status: 'Selesai', score: '86' },
  { subject: 'B. Indonesia', status: 'Selesai', score: '-' },
  { subject: 'IPA', status: 'Belum', score: '78' },
  { subject: 'PKN', status: 'Selesai', score: '92' },
];

export default function NilaiScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Statistik Nilai</Text>
        <Text style={styles.subtitle}>
          Ringkasan performa ujian
        </Text>

        {/* Ringkasan nilai */}
        <View style={styles.averageCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.averageLabel}>
              Rata-rata Nilai
            </Text>
            <Text style={styles.averageScore}>84.5</Text>
            <Text style={styles.muted}>
              Naik 6 poin dari ujian sebelumnya
            </Text>
          </View>

          <View style={styles.trendCircle}>
            <Ionicons
              name="trending-up"
              size={34}
              color={COLORS.blue}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Mata Pelajaran
        </Text>

        {GRADES.map((item) => (
          <View key={item.subject} style={styles.gradeCard}>
            <View>
              <Text style={styles.subject}>
                {item.subject}
              </Text>
              <Text
                style={[
                  styles.status,
                  {
                    color:
                      item.status === 'Selesai'
                        ? COLORS.green
                        : COLORS.amber,
                  },
                ]}
              >
                {item.status}
              </Text>
            </View>

            <Text style={styles.score}>{item.score}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.ink,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.mute,
    marginTop: 5,
    marginBottom: 22,
  },
  averageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 30,
    marginBottom: 26,
    elevation: 3,
    shadowColor: '#64748B',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  averageLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.mute,
  },
  averageScore: {
    fontSize: 50,
    fontWeight: '800',
    color: COLORS.ink,
    marginVertical: 3,
  },
  muted: {
    fontSize: 12,
    color: COLORS.mute,
  },
  trendCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 14,
  },
  gradeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#64748B',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  subject: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.ink,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  score: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.blue,
  },
});