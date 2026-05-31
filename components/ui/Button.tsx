import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  useColorScheme,
  View,
} from 'react-native';
import { darkColors, lightColors } from '../../theme/colors';
import { fonts, fontSizes } from '../../theme/typography';
import { radius } from '../../theme/spacing';
import { Typography } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  loading,
  fullWidth,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const bg =
    variant === 'primary'
      ? colors.brand
      : variant === 'secondary'
        ? colors.surfaceAlt
        : 'transparent';

  const textColor =
    variant === 'primary' ? '#FFFFFF' : variant === 'secondary' ? colors.text : colors.brand;

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        {
          backgroundColor: bg,
          borderRadius: radius.full,
          paddingVertical: 16,
          paddingHorizontal: 28,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: isDisabled ? 0.45 : 1,
          width: fullWidth ? '100%' : undefined,
          minHeight: 52,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Typography
          style={{
            fontFamily: fonts.bold,
            fontSize: fontSizes.md,
            color: textColor,
            lineHeight: fontSizes.md * 1.2,
          }}
        >
          {label}
        </Typography>
      )}
    </TouchableOpacity>
  );
}
