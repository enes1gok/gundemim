import { darkColors, lightColors } from './colors';
import { fonts, fontSizes, lineHeights } from './typography';
import { spacing, radius } from './spacing';

export const createTheme = (isDark: boolean) => ({
  colors: isDark ? darkColors : lightColors,
  fonts,
  fontSizes,
  lineHeights,
  spacing,
  radius,
  isDark,
});

export type Theme = ReturnType<typeof createTheme>;

export { darkColors, lightColors, fonts, fontSizes, spacing, radius };
