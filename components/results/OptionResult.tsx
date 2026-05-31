import React from 'react';
import { View, useColorScheme } from 'react-native';
import { MotiView } from 'moti';
import { Typography } from '../ui/Typography';
import { ProgressBar } from '../ui/ProgressBar';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';

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
  text,
  percentage,
  voteCount,
  isChosen,
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
        flexDirection: 'row',
        borderRadius: radius.lg,
        overflow: 'hidden',
        borderWidth: isChosen ? 1.5 : 1,
        borderColor: isChosen ? colors.accent : colors.border,
        backgroundColor: colors.surface,
      }}
    >
      {/* Left accent bar for chosen option */}
      {isChosen && (
        <View style={{ width: 3, backgroundColor: colors.accent }} />
      )}
      <View
        style={{
          flex: 1,
          paddingVertical: 14,
          paddingHorizontal: 16,
          paddingLeft: isChosen ? 14 : 16,
          gap: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Typography
            variant="body"
            weight={isChosen ? 'bold' : 'semiBold'}
            style={{ flex: 1, color: colors.text }}
          >
            {text}
          </Typography>
          <Typography
            variant="body"
            weight="extraBold"
            style={{ color: isChosen ? colors.accent : colors.text }}
          >
            %{percentage}
          </Typography>
        </View>
        <ProgressBar
          percentage={percentage}
          delay={delay + 150}
          color={isChosen ? colors.accent : colors.textFaint}
          height={3}
        />
        <Typography variant="tiny" faint>
          {voteCount.toLocaleString('tr-TR')} oy
        </Typography>
      </View>
    </MotiView>
  );
}
