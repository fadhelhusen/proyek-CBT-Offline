// src/components/ExamActionButton.tsx
// Tombol kecil di kartu ujian: "Siap" (hijau) dan "Download" (biru).
// Ukuran & warna diambil dari desain: 90 x 30, radius 15.

import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

export type ExamActionVariant = 'siap' | 'download';

const VARIANTS: Record<ExamActionVariant, { label: string; bg: string; fg: string }> = {
  siap: { label: 'Siap', bg: '#E8FBEF', fg: '#22C55E' },
  download: { label: 'Download', bg: '#EAF2FF', fg: '#0F6BFF' },
};

type ExamActionButtonProps = {
  variant: ExamActionVariant;
  onPress?: () => void;
  /** Ganti teks bawaan, mis. "Mengunduh..." */
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ExamActionButton({
  variant,
  onPress,
  label,
  disabled,
  style,
}: ExamActionButtonProps) {
  const v = VARIANTS[variant];
  const text = label ?? v.label;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, { color: v.fg }]}>{text}</Text>
    </Pressable>
  );
}

export default ExamActionButton;

const styles = StyleSheet.create({
  base: {
    width: 90,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 12, fontWeight: '600' },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
});
