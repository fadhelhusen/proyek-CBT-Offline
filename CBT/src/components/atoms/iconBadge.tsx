
import React from 'react';
import {
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type IconBadgeProps = {
  children: React.ReactNode;
  size?: number;
  colors?: [string, string, ...string[]];
  style?: ViewStyle;
};

export default function IconBadge({
  children,
  size = 56,
  colors = ['#78B6FF', '#4D83F4'],
  style,
}: IconBadgeProps) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
