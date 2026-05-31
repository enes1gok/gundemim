import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';
import { darkColors, lightColors, fonts, fontSizes } from '../../theme';

interface TypographyProps extends TextProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'tiny';
  weight?: 'regular' | 'semiBold' | 'bold' | 'extraBold';
  color?: string;
  muted?: boolean;
  center?: boolean;
}

export function Typography({
  variant = 'body',
  weight,
  color,
  muted,
  center,
  style,
  ...props
}: TypographyProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const sizeMap: Record<string, number> = {
    display: fontSizes.display,
    h1: fontSizes.xxxl,
    h2: fontSizes.xxl,
    h3: fontSizes.xl,
    body: fontSizes.base,
    caption: fontSizes.sm,
    tiny: fontSizes.xs,
  };

  const defaultWeightMap: Record<string, keyof typeof fonts> = {
    display: 'extraBold',
    h1: 'extraBold',
    h2: 'bold',
    h3: 'semiBold',
    body: 'regular',
    caption: 'regular',
    tiny: 'regular',
  };

  const resolvedWeight = weight ?? defaultWeightMap[variant];
  const fontFamily = fonts[resolvedWeight];
  const fontSize = sizeMap[variant];
  const textColor = color ?? (muted ? colors.textMuted : colors.text);

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize,
          color: textColor,
          textAlign: center ? 'center' : 'left',
          lineHeight: fontSize * 1.4,
        },
        style,
      ]}
      {...props}
    />
  );
}
