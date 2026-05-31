import React from 'react';
import { TouchableOpacity, View, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../ui/Typography';
import { darkColors, lightColors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { SurveyOption } from '../../types/app';

interface OptionButtonProps {
  option: SurveyOption;
  onPress: (id: string) => void;
  disabled?: boolean;
  dimmed?: boolean;
  isSelected?: boolean;
}

export function OptionButton({ option, onPress, disabled, dimmed, isSelected }: OptionButtonProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const accentTextColor = scheme === 'dark' ? '#000000' : '#FFFFFF';

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress(option.id);
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handlePress} disabled={disabled}>
      <MotiView
        animate={{
          opacity: dimmed ? 0.35 : 1,
          backgroundColor: isSelected ? colors.accent : colors.surface,
          borderColor: isSelected ? colors.accent : colors.border,
        }}
        transition={{ type: 'timing', duration: 200 }}
        style={{
          paddingVertical: 20,
          paddingHorizontal: 20,
          borderRadius: radius.md,
          borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Typography
          variant="body"
          weight="semiBold"
          style={{ flex: 1, color: isSelected ? accentTextColor : colors.text }}
        >
          {option.text}
        </Typography>
        {isSelected && (
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: accentTextColor + '22',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="checkmark" size={14} color={accentTextColor} />
          </View>
        )}
      </MotiView>
    </TouchableOpacity>
  );
}
