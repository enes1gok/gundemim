import React from 'react';
import { View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../ui/Typography';
import { darkColors, lightColors } from '../../theme/colors';

interface VoteCountBadgeProps {
  count: number;
}

export function VoteCountBadge({ count }: VoteCountBadgeProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const formatted =
    count >= 1000 ? `${(count / 1000).toFixed(1).replace('.0', '')}B` : count.toString();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Ionicons name="people-outline" size={12} color={colors.textFaint} />
      <Typography variant="tiny" faint>
        {formatted} kişi oy kullandı
      </Typography>
    </View>
  );
}
