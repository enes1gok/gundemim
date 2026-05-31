import React from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { Typography } from '../ui/Typography';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';

interface Option {
  id: string;
  label: string;
}

interface OptionGridProps {
  options: Option[];
  selected: string | null;
  onSelect: (id: string) => void;
  columns?: number;
}

export function OptionGrid({ options, selected, onSelect, columns = 2 }: OptionGridProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
      }}
    >
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            activeOpacity={0.75}
            onPress={() => onSelect(opt.id)}
            style={{
              flex: columns === 2 ? 1 : undefined,
              minWidth: columns === 2 ? '45%' : undefined,
              paddingVertical: 13,
              paddingHorizontal: 16,
              borderRadius: radius.md,
              borderWidth: 1.5,
              borderColor: isSelected ? colors.brand : colors.border,
              backgroundColor: isSelected ? colors.brandDim : colors.surface,
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body"
              weight={isSelected ? 'semiBold' : 'regular'}
              style={{ color: isSelected ? colors.brand : colors.text }}
              center
            >
              {opt.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
