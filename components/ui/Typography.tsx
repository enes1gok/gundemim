import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';
import { darkColors, lightColors, fonts, fontSizes, lineHeights, letterSpacing } from '../../theme';

interface TypographyProps extends TextProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'tiny';
  weight?: 'regular' | 'semiBold' | 'bold' | 'extraBold';
  color?: string;
  muted?: boolean;
  faint?: boolean;
  center?: boolean;
}

export function Typography({
  variant = 'body',
  weight,
  color,
  muted,
  faint,
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

  const lineHeightMap: Record<string, number> = {
    display: fontSizes.display * lineHeights.tight,
    h1: fontSizes.xxxl * lineHeights.tight,
    h2: fontSizes.xxl * lineHeights.snug,
    h3: fontSizes.xl * lineHeights.snug,
    body: fontSizes.base * lineHeights.normal,
    caption: fontSizes.sm * lineHeights.normal,
    tiny: fontSizes.xs * lineHeights.normal,
  };

  const letterSpacingMap: Record<string, number> = {
    display: letterSpacing.tight,
    h1: letterSpacing.tight,
    h2: letterSpacing.snug,
    h3: letterSpacing.snug,
    body: letterSpacing.normal,
    caption: letterSpacing.normal,
    tiny: letterSpacing.normal,
  };

  const resolvedWeight = weight ?? defaultWeightMap[variant];
  const fontFamily = fonts[resolvedWeight];
  const fontSize = sizeMap[variant];
  const textColor = color ?? (faint ? colors.textFaint : muted ? colors.textMuted : colors.text);

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize,
          color: textColor,
          textAlign: center ? 'center' : 'left',
          lineHeight: lineHeightMap[variant],
          letterSpacing: letterSpacingMap[variant],
        },
        style,
      ]}
      {...props}
    />
  );
}
