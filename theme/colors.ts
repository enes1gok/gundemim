export const darkColors = {
  background: '#0D0D0F',
  surface: '#1A1A1F',
  surfaceAlt: '#242429',
  surfaceElevated: '#2C2C33',
  brand: '#6C63FF',
  brandLight: '#8B85FF',
  brandDim: '#6C63FF22',
  text: '#F2F2F7',
  textMuted: '#8E8E99',
  textFaint: '#5C5C66',
  border: '#2C2C35',
  borderLight: '#3A3A44',
  success: '#34C759',
  error: '#FF453A',
  warning: '#FF9F0A',
  overlay: 'rgba(0,0,0,0.7)',

  // Category colors
  siyaset: '#FF6B6B',
  ekonomi: '#4ECDC4',
  spor: '#45B7D1',
  kultur: '#F7DC6F',
} as const;

export const lightColors = {
  background: '#F5F5F0',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F0EB',
  surfaceElevated: '#E8E8E4',
  brand: '#5A52E0',
  brandLight: '#7B75F0',
  brandDim: '#5A52E022',
  text: '#0D0D0F',
  textMuted: '#6B6B78',
  textFaint: '#9B9BA6',
  border: '#E0E0DC',
  borderLight: '#D0D0CC',
  success: '#30B04E',
  error: '#E03030',
  warning: '#E08A00',
  overlay: 'rgba(0,0,0,0.4)',

  siyaset: '#E84040',
  ekonomi: '#2AA89F',
  spor: '#2090B0',
  kultur: '#C8A800',
} as const;

export type ColorScheme = {
  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceElevated: string;
  brand: string;
  brandLight: string;
  brandDim: string;
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
