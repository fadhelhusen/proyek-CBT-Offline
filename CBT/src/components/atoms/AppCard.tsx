import {
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import type { ReactNode } from 'react';

type AppCardProps = {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
  radius?: number;
};

export default function AppCard({
  children,
  style,
  padding = 16,
  radius = 16,
}: AppCardProps) {
  return (
    <View
      style={[
        styles.card,
        { padding, borderRadius: radius },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0D1F47',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
});