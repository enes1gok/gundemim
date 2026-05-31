import React from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { Typography } from '../ui/Typography';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { SurveyOption } from '../../types/app';

interface OptionButtonProps {
  option: SurveyOption;
  onPress: (id: string) => void;
  disabled?: boolean;
  dimmed?: boolean;
}

export function OptionButton({ option, onPress, disabled, dimmed }: OptionButtonProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress(option.id);
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handlePress} disabled={disabled}>
      <MotiView
        animate={{ opacity: dimmed ? 0.4 : 1 }}
        transition={{ type: 'timing', duration: 200 }}
        style={{
          paddingVertical: 18,
          paddingHorizontal: 20,
          borderRadius: radius.lg,
          borderWidth: 1.5,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Typography variant="body" weight="semiBold" style={{ flex: 1, color: colors.text }}>
          {option.text}
        </Typography>
      </MotiView>
    </TouchableOpacity>
  );
}
