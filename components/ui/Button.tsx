import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  useColorScheme,
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

  // accent-inverted: primary button text is always the opposite of accent
  const accentTextColor = scheme === 'dark' ? '#000000' : '#FFFFFF';

  const bg =
    variant === 'primary'
      ? colors.accent
      : variant === 'secondary'
        ? colors.surfaceAlt
        : 'transparent';

  const borderColor =
    variant === 'ghost' || variant === 'secondary' ? colors.border : 'transparent';

  const textColor =
    variant === 'primary' ? accentTextColor : colors.text;

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      style={[
        {
          backgroundColor: bg,
          borderRadius: radius.md,
          paddingVertical: 16,
          paddingHorizontal: 28,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: isDisabled ? 0.35 : 1,
          width: fullWidth ? '100%' : undefined,
          minHeight: 56,
          borderWidth: variant === 'ghost' || variant === 'secondary' ? 1 : 0,
          borderColor,
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
            fontSize: fontSizes.base,
            color: textColor,
            lineHeight: fontSizes.base * 1.2,
            letterSpacing: 0.3,
          }}
        >
          {label}
        </Typography>
      )}
    </TouchableOpacity>
  );
}
