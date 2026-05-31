import React from 'react';
import { View, useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { darkColors, lightColors } from '../../theme/colors';

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        return (
          <Animated.View
            key={i}
            style={{
              height: 4,
              borderRadius: 2,
              backgroundColor: isActive ? colors.brand : colors.border,
              width: isActive ? 24 : 8,
            }}
          />
        );
      })}
    </View>
  );
}
