import React from 'react';
import {
  Text,
  type TextProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';

type AppTextProps = TextProps & {
  variant?: 'regular' | 'medium' | 'semibold' | 'bold' | 'title' | 'subtitle';
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
};

const fontFamilyMap = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  title: 'Inter_700Bold',
  subtitle: 'Inter_400Regular',
};

const variantStyles: Record<
  'regular' | 'medium' | 'semibold' | 'bold' | 'title' | 'subtitle',
  { fontSize: number; color: string }
> = {
  regular: { fontSize: 14, color: '#24324A' },
  medium: { fontSize: 14, color: '#24324A' },
  semibold: { fontSize: 14, color: '#24324A' },
  bold: { fontSize: 14, color: '#24324A' },
  title: { fontSize: 30, color: '#172033' },
  subtitle: { fontSize: 14, color: '#64748B' },
};

export default function AppText({
  variant = 'regular',
  color,
  size,
  style,
  children,
  ...rest
}: AppTextProps) {
  const preset = variantStyles[variant];

  return (
    <Text
      {...rest}
      style={[
        {
            fontFamily: fontFamilyMap[variant],
            fontSize: size ?? preset.fontSize,
            color: color ?? preset.color,
            fontWeight: variant === 'title' ? '700' : undefined,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}