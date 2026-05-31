import React from 'react';
import { View, useColorScheme } from 'react-native';
import { Typography } from './Typography';
import { CATEGORIES } from '../../constants/categories';
import { Category } from '../../types/app';
import { radius } from '../../theme/spacing';
import { darkColors, lightColors } from '../../theme/colors';

interface TagProps {
  category: Category;
}

export function Tag({ category }: TagProps) {
  const meta = CATEGORIES.find((c) => c.id === category);
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const dotColor = (colors as Record<string, string>)[category] ?? colors.textMuted;

  return (
    <View
      style={{
        backgroundColor: colors.surfaceAlt,
        borderRadius: radius.full,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: dotColor,
        }}
      />
      <Typography
        variant="tiny"
        weight="semiBold"
        style={{ color: colors.text, letterSpacing: 1.2, textTransform: 'uppercase' }}
      >
        {meta?.label ?? category}
      </Typography>
    </View>
  );
}
