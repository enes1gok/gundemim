import React, { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { darkColors, lightColors } from '../../theme/colors';

interface ProgressBarProps {
  percentage: number;
  delay?: number;
  color?: string;
  height?: number;
  trackColor?: string;
}

export function ProgressBar({
  percentage,
  delay = 0,
  color,
  height = 8,
  trackColor,
}: ProgressBarProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      delay,
      withTiming(percentage, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [percentage, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View
      style={{
        height,
        backgroundColor: trackColor ?? colors.surfaceAlt,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[
          {
            height,
            backgroundColor: color ?? colors.brand,
            borderRadius: height / 2,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
