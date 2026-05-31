import React from 'react';
import { TouchableOpacity, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Typography } from '../ui/Typography';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { CategoryMeta } from '../../constants/categories';

interface InterestCardProps {
  category: CategoryMeta;
  selected: boolean;
  onToggle: () => void;
}

export function InterestCard({ category, selected, onToggle }: InterestCardProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const accentTextColor = scheme === 'dark' ? '#000000' : '#FFFFFF';

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onToggle} style={{ flex: 1 }}>
      <MotiView
        animate={{
          scale: selected ? 1.02 : 1,
          borderColor: selected ? colors.accent : colors.border,
          backgroundColor: selected ? colors.accent : colors.surface,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          borderRadius: radius.xl,
          borderWidth: 1,
          padding: 20,
          alignItems: 'center',
          gap: 10,
          minHeight: 120,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: selected ? accentTextColor + '22' : colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={category.icon as any}
            size={22}
            color={selected ? accentTextColor : colors.textMuted}
          />
        </View>
        <Typography
          variant="body"
          weight={selected ? 'bold' : 'semiBold'}
          center
          style={{ color: selected ? accentTextColor : colors.text }}
        >
          {category.label}
        </Typography>
      </MotiView>
    </TouchableOpacity>
  );
}
