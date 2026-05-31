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
  const color = (colors as Record<string, string>)[category] ?? colors.brand;

  return (
    <View
      style={{
        backgroundColor: color + '22',
        borderRadius: radius.full,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: color + '44',
      }}
    >
      <Typography
        variant="tiny"
        weight="bold"
        style={{ color, letterSpacing: 0.8, textTransform: 'uppercase' }}
      >
        {meta?.label ?? category}
      </Typography>
    </View>
  );
}
