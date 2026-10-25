/**
 * PulsePause palette, matched to the website (warm off-white, slate text, deep teal accent).
 * Colours are calm by design: no red/green "good/bad" signals anywhere in the app.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2E3D49',
    textSecondary: '#5F6B75',
    background: '#F8F7F4',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E8F1EF',
    accent: '#0D6B5E',
    onAccent: '#FFFFFF',
    border: '#E6E3DC',
  },
  dark: {
    text: '#EEF1F0',
    textSecondary: '#A6B0B5',
    background: '#141A1E',
    backgroundElement: '#1E262B',
    backgroundSelected: '#1F3833',
    accent: '#4FB3A2',
    onAccent: '#0B1F1B',
    border: '#2A343A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  card: 20,
  button: 999,
} as const;

export const MaxContentWidth = 800;
