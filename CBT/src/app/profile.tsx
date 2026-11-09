import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  blue: '#0F6BFF',
  blueLight: '#5AA2FF',
  ink: '#172033',
  mute: '#8290A5',
  red: '#E5484D',
  white: '#FFFFFF',
  background: '#F3F7FF',
  track: '#DCE6F5',
};

const STUDENT = {
  name: 'Irfan Mubarok',
  nisn: '20260015',
  className: 'XII IPA 1',
  initials: 'IM',
};

const MENU = [
  {
    title: 'Riwayat Aktivitas',
    icon: 'time-outline' as const,
  },
  {
    title: 'Ubah Password',
    icon: 'lock-closed-outline' as const,
  },
  {
    title: 'Informasi Aplikasi',
    icon: 'information-circle-outline' as const,
  },
];

export default function ProfilScreen() {
  const handleMenu = (title: string) => {
    Alert.alert(title, `Menu ${title} dipilih.`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah kamu yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            // Hubungkan ke fungsi logout aplikasi kamu.
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>
          Kartu peserta ujian digital
        </Text>

        {/* Kartu peserta */}
        <View style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.headerText}>
              KARTU PESERTA UJIAN
            </Text>
          </View>

          <View style={styles.studentInfo}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>
                {STUDENT.initials}
              </Text>
            </View>

            <View style={styles.studentDetails}>
              <Text style={styles.studentName}>
                {STUDENT.name}
              </Text>
              <Text style={styles.detailText}>
                NISN {STUDENT.nisn}
              </Text>
              <Text style={styles.detailText}>
                Kelas {STUDENT.className}
              </Text>
            </View>

            <View style={styles.qrBox}>
              <Ionicons
                name="qr-code"
                size={30}
                color={COLORS.ink}
              />
            </View>
          </View>
        </View>

        {/* Menu profil */}
        {MENU.map((item) => (
          <TouchableOpacity
            key={item.title}
            activeOpacity={0.75}
            onPress={() => handleMenu(item.title)}
            style={styles.menuCard}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <Ionicons
                  name={item.icon}
                  size={21}
                  color={COLORS.blue}
                />
              </View>

              <Text style={styles.menuText}>
                {item.title}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.mute}
            />
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleLogout}
          style={styles.logoutCard}
        >
          <View style={styles.menuLeft}>
            <View style={styles.logoutIcon}>
              <Ionicons
                name="log-out-outline"
                size={21}
                color={COLORS.red}
              />
            </View>

            <Text style={styles.logoutText}>Logout</Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORS.red}
          />
        </TouchableOpacity>
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
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#64748B',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: {
    padding: 24,
    backgroundColor: COLORS.blue,
  },
  headerText: {
    color: COLORS.white,
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 13,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.blue,
  },
  studentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.mute,
    marginTop: 3,
  },
  qrBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.track,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ink,
  },
  logoutCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.red,
  },
});