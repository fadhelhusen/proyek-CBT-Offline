import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StatusIconProps = {
  status: 'success' | 'pending' | 'error';
  size?: number;
};

const config = {
  success: {
    icon: 'checkmark' as const,
    background: '#DDF8E8',
    color: '#20A464',
  },
  pending: {
    icon: 'time-outline' as const,
    background: '#FFF1D6',
    color: '#D99118',
  },
  error: {
    icon: 'close' as const,
    background: '#FFE4E4',
    color: '#D94848',
  },
};

export default function StatusIcon({
  status,
  size = 28,
}: StatusIconProps) {
  const item = config[status];

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: item.background,
        },
      ]}
    >
      <Ionicons
        name={item.icon}
        size={size * 0.58}
        color={item.color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});