import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import type { Href } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { adminListAkun, ringkasanAdmin, ujianTerbaru } from '@/services/api';
import type { Akun, RingkasanAdmin, Ujian, UjianStatus } from '@/data/types';
import type { Role } from '@/constants/roles';
import AppText from '@/components/atoms/AppText';
import AppCard from '@/components/atoms/AppCard';
import { COLORS, SectionTitle, ListRow } from '@/components/DashboardParts';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const STATUS_COLOR: Record<UjianStatus, string> = {
  berlangsung: COLORS.green, terjadwal: COLORS.amber, selesai: COLORS.muted,
};

const ROLE_STYLE: Record<Role, { bg: string; fg: string; label: string }> = {
  siswa: { bg: '#EAF2FF', fg: COLORS.primary, label: 'Siswa' },
  guru: { bg: '#E8FBEF', fg: COLORS.green, label: 'Guru' },
  admin: { bg: '#FEF3C7', fg: '#D97706', label: 'Admin' },
};

/* ---------- komponen lokal ---------- */
function StatTile({ icon, label, value, color }: { icon: IconName; label: string; value: number; color: string }) {
  return (
    <AppCard style={styles.stat} padding={16} radius={20}>
      <View style={[styles.statIcon, { backgroundColor: color + '1A' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <AppText variant="bold" size={26} color={COLORS.text} style={{ marginTop: 12 }}>{value}</AppText>
      <AppText variant="medium" size={12} color={COLORS.muted} style={{ marginTop: 2 }}>{label}</AppText>
    </AppCard>
  );
}

function ActionTile({ icon, label, onPress, highlight }: { icon: IconName; label: string; onPress: () => void; highlight?: boolean }) {
  return (
    <Pressable onPress={onPress} style={styles.actionWrap} accessibilityRole="button">
      <AppCard style={styles.action} padding={14} radius={18}>
        <View style={[styles.actionIcon, highlight && { backgroundColor: COLORS.primary }]}>
          <Ionicons name={icon} size={20} color={highlight ? '#FFFFFF' : COLORS.primary} />
        </View>
        <AppText variant="semibold" size={13} color={COLORS.text} style={{ marginTop: 10 }}>{label}</AppText>
      </AppCard>
    </Pressable>
  );
}

function AkunRow({ a, onPress }: { a: Akun; onPress: () => void }) {
  const rs = ROLE_STYLE[a.role];
  const detail = a.role === 'siswa' ? a.kelas : a.role === 'guru' ? a.mapel : 'Operator';
  return (
    <Pressable onPress={onPress}>
      <AppCard style={styles.row} padding={14} radius={18}>
        <View style={[styles.avatar, { backgroundColor: rs.bg }]}>
          <AppText variant="bold" size={15} color={rs.fg}>{a.nama.trim().charAt(0).toUpperCase()}</AppText>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <AppText variant="semibold" size={14} color={COLORS.text} numberOfLines={1}>{a.nama}</AppText>
          <AppText variant="regular" size={12} color={COLORS.muted} style={{ marginTop: 2 }} numberOfLines={1}>
            {a.username}{detail ? ` • ${detail}` : ''}
          </AppText>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: rs.bg }]}>
          <AppText variant="semibold" size={11} color={rs.fg}>{rs.label}</AppText>
        </View>
      </AppCard>
    </Pressable>
  );
}

/* ---------- halaman ---------- */
export default function DashboardAdmin() {
  const { user, kredensial, logout } = useAuth();
  const [r, setR] = useState<RingkasanAdmin>({ siswa: 0, guru: 0, kelas: 0, terjadwal: 0 });
  const [ujian, setUjian] = useState<Ujian[]>([]);
  const [akun, setAkun] = useState<Akun[]>([]);
  const [memuat, setMemuat] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let batal = false;
      (async () => {
        const [ringkasan, terbaru, daftar] = await Promise.all([
          ringkasanAdmin(),
          ujianTerbaru(5),
          kredensial ? adminListAkun(kredensial).catch(() => [] as Akun[]) : Promise.resolve([] as Akun[]),
        ]);
        if (!batal) { setR(ringkasan); setUjian(terbaru); setAkun(daftar); setMemuat(false); }
      })();
      return () => { batal = true; };
    }, [kredensial]),
  );

  const soon = (name: string) => () => console.log(`${name} dipilih`);
  const keKelola = () => router.push('/kelola-akun' as Href);
  const keTambah = () => router.push({ pathname: '/kelola-akun', params: { tambah: '1' } } as unknown as Href);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* hero */}
        <LinearGradient colors={['#2575FC', '#4A90E2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroBadge}>
              <AppText variant="semibold" size={11} color="#FFFFFF">ADMIN</AppText>
            </View>
            <Pressable
              onPress={() => { logout(); router.replace('/login' as Href); }}
              style={styles.logout}
              accessibilityRole="button"
            >
              <Ionicons name="log-out-outline" size={16} color="#FFFFFF" />
              <AppText variant="semibold" size={12} color="#FFFFFF" style={{ marginLeft: 4 }}>Keluar</AppText>
            </Pressable>
          </View>
          <AppText variant="regular" size={13} color="#DCE9FF" style={{ marginTop: 16 }}>Selamat datang,</AppText>
          <AppText variant="bold" size={22} color="#FFFFFF" style={{ marginTop: 2 }}>{user?.nama ?? 'Admin'}</AppText>
          <AppText variant="regular" size={12} color="#DCE9FF" style={{ marginTop: 4 }}>
            {r.siswa + r.guru} akun siswa & guru • {r.terjadwal} ujian terjadwal
          </AppText>
        </LinearGradient>

        {/* statistik */}
        <View style={styles.grid}>
          <StatTile icon="people-outline" label="Total siswa" value={r.siswa} color={COLORS.primary} />
          <StatTile icon="school-outline" label="Total guru" value={r.guru} color="#8B5CF6" />
          <StatTile icon="albums-outline" label="Kelas" value={r.kelas} color={COLORS.green} />
          <StatTile icon="calendar-outline" label="Ujian terjadwal" value={r.terjadwal} color={COLORS.amber} />
        </View>

        {/* manajemen */}
        <SectionTitle>Manajemen</SectionTitle>
        <View style={styles.grid}>
          <ActionTile icon="people" label="Kelola akun" onPress={keKelola} highlight />
          <ActionTile icon="person-add" label="Tambah akun" onPress={keTambah} highlight />
          <ActionTile icon="library-outline" label="Kelas & mapel" onPress={() => router.push('/kelas-mapel' as Href)} />
          <ActionTile icon="document-text-outline" label="Kelola ujian" onPress={() => router.push('/kelola-ujian' as Href)} />
          <ActionTile icon="sync-outline" label="Sinkronisasi" onPress={() => router.push('/sinkronisasi' as Href)} />
          <ActionTile icon="bar-chart-outline" label="Laporan" onPress={() => router.push('/laporan' as Href)} />
        </View>

        {/* akun */}
        <View style={styles.sectionRow}>
          <SectionTitle>Akun terdaftar</SectionTitle>
          <Pressable onPress={keKelola} hitSlop={8} style={{ marginTop: 28 }}>
            <AppText variant="semibold" size={12} color={COLORS.primary}>Lihat semua ›</AppText>
          </Pressable>
        </View>
        {memuat && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />}
        {!memuat && akun.length === 0 && (
          <AppText variant="regular" size={13} color={COLORS.muted}>Belum ada akun.</AppText>
        )}
        {akun.slice(0, 5).map((a) => <AkunRow key={a.id} a={a} onPress={keKelola} />)}

        {/* ujian */}
        <SectionTitle>Ujian terbaru</SectionTitle>
        {!memuat && ujian.length === 0 && (
          <AppText variant="regular" size={13} color={COLORS.muted}>Belum ada ujian.</AppText>
        )}
        {ujian.map((u) => (
          <ListRow
            key={u.id}
            title={u.judul}
            subtitle={`${u.mapel} • Kelas ${u.kelas}`}
            right={u.status}
            rightColor={STATUS_COLOR[u.status]}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingBottom: 48 },
  hero: { borderRadius: 24, padding: 20, marginBottom: 16 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  logout: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stat: { flexBasis: '47%', flexGrow: 1 },
  statIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionWrap: { flexBasis: '47%', flexGrow: 1 },
  action: { minHeight: 84 },
  actionIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.soft, alignItems: 'center', justifyContent: 'center' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
});