export const darkColors = {
  background: '#09090B',
  surface: '#18181B',
  surfaceAlt: '#27272A',
  surfaceElevated: '#3F3F46',
  accent: '#FFFFFF',
  divider: '#18181B',
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  textFaint: '#71717A',
  border: '#27272A',
  borderLight: '#3F3F46',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  overlay: 'rgba(0,0,0,0.7)',

  // Category — muted palette, used only as 6px dot indicators
  siyaset: '#F87171',
  ekonomi: '#34D399',
  spor: '#60A5FA',
  kultur: '#FBBF24',
} as const;

export const lightColors = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  surfaceAlt: '#F4F4F5',
  surfaceElevated: '#E4E4E7',
  accent: '#09090B',
  divider: '#F4F4F5',
  text: '#09090B',
  textMuted: '#71717A',
  textFaint: '#A1A1AA',
  border: '#E4E4E7',
  borderLight: '#D4D4D8',
  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',
  overlay: 'rgba(0,0,0,0.4)',

  siyaset: '#DC2626',
  ekonomi: '#059669',
  spor: '#2563EB',
  kultur: '#D97706',
} as const;

export type ColorScheme = {
  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceElevated: string;
  accent: string;
  divider: string;
  text: string;
  textMuted: string;
  textFaint: string;
  border: string;
  borderLight: string;
  success: string;
  error: string;
  warning: string;
  overlay: string;
  siyaset: string;
  ekonomi: string;
  spor: string;
  kultur: string;
};
