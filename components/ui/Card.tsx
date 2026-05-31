import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';

interface CardProps extends ViewProps {
  elevated?: boolean;
  flat?: boolean;
  noPadding?: boolean;
}

export function Card({ elevated, flat, noPadding, style, ...props }: CardProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const bg = elevated ? colors.surfaceAlt : colors.surface;
  const showBorder = !elevated && !flat;

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderRadius: radius.lg,
          padding: noPadding ? 0 : 20,
          borderWidth: showBorder ? 1 : 0,
          borderColor: colors.border,
        },
        style,
      ]}
      {...props}
    />
  );
}
