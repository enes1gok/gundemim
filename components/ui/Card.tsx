import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';

interface CardProps extends ViewProps {
  elevated?: boolean;
  noPadding?: boolean;
}

export function Card({ elevated, noPadding, style, ...props }: CardProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <View
      style={[
        {
          backgroundColor: elevated ? colors.surfaceAlt : colors.surface,
          borderRadius: radius.lg,
          padding: noPadding ? 0 : 16,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
      {...props}
    />
  );
}
