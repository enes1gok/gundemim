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
  const accentTextColor = scheme === 'dark' ? '#000000' : '#FFFFFF';

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
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
              borderWidth: 1,
              borderColor: isSelected ? colors.accent : colors.border,
              backgroundColor: isSelected ? colors.accent : colors.surface,
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body"
              weight={isSelected ? 'semiBold' : 'regular'}
              style={{ color: isSelected ? accentTextColor : colors.text }}
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
