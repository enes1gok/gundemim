import React from 'react';
import { View, useColorScheme } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../ui/Typography';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';

interface SimilarMindsProps {
  text: string;
  delay?: number;
}

export function SimilarMinds({ text, delay = 0 }: SimilarMindsProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay }}
      style={{
        backgroundColor: colors.brandDim,
        borderRadius: radius.lg,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
        borderWidth: 1,
        borderColor: colors.brand + '33',
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.brand + '22',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="people" size={18} color={colors.brand} />
      </View>
      <View style={{ flex: 1 }}>
        <Typography variant="caption" weight="bold" style={{ color: colors.brand, marginBottom: 3 }}>
          Sizinle Benzer Görüş
        </Typography>
        <Typography variant="body" style={{ color: colors.text }}>
          {text}
        </Typography>
      </View>
    </MotiView>
  );
}
