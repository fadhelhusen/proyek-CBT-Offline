// Komponen bersama untuk dashboard guru & admin (siswa tetap memakai home-dashboard.tsx)
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';
import AppText from '@/components/atoms/AppText';
import AppCard from '@/components/atoms/AppCard';

export const COLORS = {
  bg: '#F8FBFF',
  text: '#0F172A',
  muted: '#64748B',
  primary: '#0F6BFF',
  soft: '#EAF2FF',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

/* ---------- Header: sapaan + badge peran + tombol keluar ---------- */
type HeaderProps = {
  name: string;
  roleLabel: string;
  subtitle?: string;
  onLogout: () => void;
};

export function DashboardHeader({ name, roleLabel, subtitle, onLogout }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <View style={styles.roleBadge}>
          <AppText variant="semibold" size={11} color={COLORS.primary}>
            {roleLabel}
          </AppText>
        </View>
        <AppText variant="bold" size={22} color={COLORS.text} style={{ marginTop: 8 }}>
          {name}
        </AppText>
        {subtitle ? (
          <AppText variant="regular" size={13} color={COLORS.muted} style={{ marginTop: 2 }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <Pressable onPress={onLogout} style={styles.logout} accessibilityRole="button">
        <AppText variant="semibold" size={12} color={COLORS.primary}>
          Keluar
        </AppText>
      </Pressable>
    </View>
  );
}

/* ---------- Kartu statistik ---------- */
type StatProps = { label: string; value: string | number; color?: string };

export function StatCard({ label, value, color = COLORS.primary }: StatProps) {
  return (
    <AppCard style={styles.stat} padding={16} radius={20}>
      <AppText variant="bold" size={28} color={color}>
        {value}
      </AppText>
      <AppText variant="medium" size={12} color={COLORS.muted} style={{ marginTop: 4 }}>
        {label}
      </AppText>
    </AppCard>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

/* ---------- Aksi cepat ---------- */
type ActionProps = { label: string; onPress: () => void };

export function QuickAction({ label, onPress }: ActionProps) {
  return (
    <Pressable onPress={onPress} style={styles.actionWrap} accessibilityRole="button">
      <AppCard style={styles.action} padding={14} radius={18}>
        <View style={styles.actionDot} />
        <AppText variant="semibold" size={13} color={COLORS.text} style={{ marginTop: 10 }}>
          {label}
        </AppText>
      </AppCard>
    </Pressable>
  );
}

/* ---------- Judul bagian & baris daftar ---------- */
export function SectionTitle({ children }: { children: string }) {
  return (
    <AppText variant="bold" size={16} color={COLORS.text} style={styles.sectionTitle}>
      {children}
    </AppText>
  );
}

type RowProps = {
  title: string;
  subtitle?: string;
  right?: string;
  rightColor?: string;
  onPress?: () => void;
};

export function ListRow({ title, subtitle, right, rightColor = COLORS.primary, onPress }: RowProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <AppCard style={styles.row} padding={16} radius={18}>
        <View style={{ flex: 1 }}>
          <AppText variant="semibold" size={14} color={COLORS.text}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="regular" size={12} color={COLORS.muted} style={{ marginTop: 2 }}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {right ? (
          <AppText variant="semibold" size={12} color={rightColor}>
            {right}
          </AppText>
        ) : null}
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.soft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  logout: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stat: { flexBasis: '47%', flexGrow: 1 },
  actionWrap: { flexBasis: '47%', flexGrow: 1 },
  action: { minHeight: 84 },
  actionDot: { width: 28, height: 28, borderRadius: 10, backgroundColor: COLORS.soft },
  sectionTitle: { marginTop: 28, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
});
