import React from 'react';
import { View, useColorScheme } from 'react-native';
import { MotiView } from 'moti';
import { Typography } from '../ui/Typography';
import { ProgressBar } from '../ui/ProgressBar';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface OptionResultProps {
  optionId: string;
  text: string;
  percentage: number;
  voteCount: number;
  isChosen: boolean;
  isWinner: boolean;
  delay?: number;
}

export function OptionResult({
  optionId,
  text,
  percentage,
  voteCount,
  isChosen,
  isWinner,
  delay = 0,
}: OptionResultProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 350, delay }}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        borderColor: isChosen ? colors.brand : colors.border,
        backgroundColor: isChosen ? colors.brandDim : colors.surface,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Typography
          variant="body"
          weight={isChosen ? 'bold' : 'semiBold'}
          style={{ flex: 1, color: isChosen ? colors.brand : colors.text }}
        >
          {text}
        </Typography>
        {isChosen && (
          <Ionicons name="checkmark-circle" size={18} color={colors.brand} />
        )}
        <Typography
          variant="body"
          weight="bold"
          style={{ color: isChosen ? colors.brand : colors.text }}
        >
          %{percentage}
        </Typography>
      </View>
      <ProgressBar
        percentage={percentage}
        delay={delay + 150}
        color={isChosen ? colors.brand : colors.textFaint}
        height={6}
      />
      <Typography variant="tiny" muted>
        {voteCount.toLocaleString('tr-TR')} oy
      </Typography>
    </MotiView>
  );
}
