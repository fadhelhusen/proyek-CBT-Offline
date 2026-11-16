import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TaskStatus = 'Belum' | 'Pending' | 'Terkirim';

type Task = {
  id: string;
  name: string;
  subtitle: string;
  status: TaskStatus;
  deadline: string;
};

const TASKS: Task[] = [
  {
    id: '1',
    name: 'Rangkuman Pergerakan Nasional',
    subtitle: 'Sejarah Indonesia • 2 halaman',
    status: 'Belum',
    deadline: 'Hari ini, 21.00',
  },
  {
    id: '2',
    name: 'Latihan Matematika',
    subtitle: 'Matematika • 10 soal',
    status: 'Pending',
    deadline: 'Besok, 20.00',
  },
  {
    id: '3',
    name: 'Laporan Praktikum IPA',
    subtitle: 'IPA • Laporan praktikum',
    status: 'Terkirim',
    deadline: '25 Oktober 2026',
  },
];

const FILTERS = ['Semua', 'Belum', 'Pending', 'Terkirim'] as const;

const COLORS = {
  blue: '#0F6BFF',
  ink: '#172033',
  mute: '#8290A5',
  background: '#F3F7FF',
  white: '#FFFFFF',
  green: '#16A36A',
  orange: '#D99000',
  gray: '#718096',
};

function TaskListItem({
  task,
  onPress,
}: {
  task: Task;
  onPress: () => void;
}) {
  const statusColor =
    task.status === 'Terkirim'
      ? COLORS.green
      : task.status === 'Pending'
        ? COLORS.orange
        : COLORS.blue;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.taskCard}
    >
      <View style={styles.taskIcon}>
        <Ionicons
          name="document-text-outline"
          size={24}
          color={COLORS.blue}
        />
      </View>

      <View style={styles.taskContent}>
        <Text style={styles.taskName}>{task.name}</Text>
        <Text style={styles.taskSubtitle}>
          {task.subtitle}
        </Text>
        <Text style={styles.deadline}>
          Deadline: {task.deadline}
        </Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${statusColor}18` },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {task.status}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={COLORS.mute}
      />
    </TouchableOpacity>
  );
}

export default function TugasScreen() {
  const [filter, setFilter] =
    useState<(typeof FILTERS)[number]>('Semua');

  const filteredTasks = TASKS.filter(
    (task) => filter === 'Semua' || task.status === filter,
  );

  const openTask = (task: Task) => {
    // Hubungkan ke halaman detail tugas pada navigator.
    console.log('Tugas dipilih:', task.id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tugas Offline</Text>
        <Text style={styles.subtitle}>
          Kerjakan tugas lalu kirim hasilnya
        </Text>

        <View style={styles.filterRow}>
          {FILTERS.map((item) => {
            const active = filter === item;

            return (
              <TouchableOpacity
                key={item}
                onPress={() => setFilter(item)}
                style={[
                  styles.filterButton,
                  active && styles.activeFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    active && styles.activeFilterText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryLabel}>
              Total Tugas
            </Text>
            <Text style={styles.summaryNumber}>
              {filteredTasks.length}
            </Text>
          </View>

          <View style={styles.summaryIcon}>
            <Ionicons
              name="checkbox-outline"
              size={30}
              color={COLORS.blue}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Daftar Tugas
        </Text>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              onPress={() => openTask(task)}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons
              name="file-tray-outline"
              size={42}
              color={COLORS.mute}
            />
            <Text style={styles.emptyTitle}>
              Belum ada tugas
            </Text>
            <Text style={styles.emptySubtitle}>
              Tidak ada tugas dengan status ini.
            </Text>
          </View>
        )}
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
    paddingBottom: 110,
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
    marginBottom: 24,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 99,
    backgroundColor: COLORS.white,
  },
  activeFilter: {
    backgroundColor: COLORS.blue,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.mute,
  },
  activeFilterText: {
    color: COLORS.white,
  },
  summary: {
    backgroundColor: COLORS.white,
    borderRadius: 26,
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  summaryLabel: {
    color: COLORS.mute,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.ink,
    marginTop: 5,
  },
  summaryIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 14,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    gap: 12,
  },
  taskIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.ink,
    lineHeight: 20,
  },
  taskSubtitle: {
    fontSize: 12,
    color: COLORS.mute,
    marginTop: 4,
  },
  deadline: {
    fontSize: 11,
    color: COLORS.mute,
    marginTop: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    marginTop: 9,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    padding: 28,
    borderRadius: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.ink,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.mute,
    marginTop: 6,
    textAlign: 'center',
  },
});