/**
 * PulsePause design tokens: one shared source for colour, sky, type, spacing and shape.
 *
 * Palette: slate, sage, warm sand and soft dawn, matched to the website's deep teal accent.
 * Calm by design: no red anywhere, and no red/green "good/bad" signals. A stormy day is
 * deep slate, never alarming.
 */

import { Platform, type TextStyle } from 'react-native';

/** Raw palette. Screens use the semantic tokens below, not these directly. */
export const Palette = {
  slate950: '#0F151A',
  slate900: '#141A1E',
  slate850: '#1E262B',
  slate800: '#2A343A',
  slate700: '#2E3D49',
  slate600: '#46586A',
  slate500: '#5F6B75',
  slate300: '#A6B0B5',
  slate100: '#E6EAEC',
  slate50: '#EEF1F0',

  sage700: '#0D6B5E',
  sage500: '#4FB3A2',
  sage300: '#9CC7B8',
  sage100: '#E8F1EF',
  sage900: '#1F3833',

  sand500: '#B8916A',
  sand300: '#E3CDB1',
  sand100: '#F3ECE2',
  sand50: '#F8F7F4',

  dawnGold: '#F5D9A8',
  dawnPeach: '#F2CDB4',
  dawnHaze: '#DCE6EA',
  dawnEmber: '#4A3A30',

  white: '#FFFFFF',
} as const;

export const Colors = {
  light: {
    text: Palette.slate700,
    textSecondary: Palette.slate500,
    background: Palette.sand50,
    backgroundElement: Palette.white,
    backgroundSelected: Palette.sage100,
    accent: Palette.sage700,
    onAccent: Palette.white,
    border: '#E6E3DC',
    sage: Palette.sage700,
    sageSoft: Palette.sage100,
    sand: Palette.sand500,
    sandSoft: Palette.sand100,
  },
  dark: {
    text: Palette.slate50,
    textSecondary: Palette.slate300,
    background: Palette.slate900,
    backgroundElement: Palette.slate850,
    backgroundSelected: Palette.sage900,
    accent: Palette.sage500,
    onAccent: '#0B1F1B',
    border: Palette.slate800,
    sage: Palette.sage500,
    sageSoft: Palette.sage900,
    sand: Palette.sand300,
    sandSoft: '#2B2620',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export type Forecast = 'clear' | 'variable' | 'stormy';

type Sky = {
  /** Top of the sky, fading to the page background at the bottom. */
  colors: readonly [string, string, string];
  text: string;
  textSecondary: string;
  /** Text on a filled chip or button that uses `text` as its background. */
  inverse: string;
};

/**
 * "Inner weather" skies for the Today screen. Clear is a warm dawn, Variable a soft
 * cloud, Stormy a deep slate. Text colours are chosen per sky for strong contrast.
 */
export const Skies: Record<'light' | 'dark', Record<Forecast, Sky>> = {
  light: {
    clear: {
      colors: [Palette.dawnGold, Palette.dawnPeach, Palette.sand50],
      text: Palette.slate700,
      textSecondary: '#4F5B65',
      inverse: Palette.sand50,
    },
    variable: {
      colors: ['#C9D5DB', Palette.dawnHaze, Palette.sand50],
      text: Palette.slate700,
      textSecondary: '#4F5B65',
      inverse: Palette.sand50,
    },
    stormy: {
      colors: [Palette.slate600, '#56677A', Palette.sand50],
      text: Palette.white,
      textSecondary: '#E9EEF1',
      inverse: Palette.slate700,
    },
  },
  dark: {
    clear: {
      colors: [Palette.dawnEmber, '#2E2A2A', Palette.slate900],
      text: Palette.slate50,
      textSecondary: '#D3CCC4',
      inverse: Palette.slate900,
    },
    variable: {
      colors: ['#2F3B45', '#222C33', Palette.slate900],
      text: Palette.slate50,
      textSecondary: Palette.slate300,
      inverse: Palette.slate900,
    },
    stormy: {
      colors: [Palette.slate950, '#121A20', Palette.slate900],
      text: Palette.slate50,
      textSecondary: Palette.slate300,
      inverse: Palette.slate900,
    },
  },
};

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

/**
 * Type scale. Sizes are starting points: text scales with the person's Dynamic Type
 * setting, so never cap it except on single-line hero numbers.
 */
export const Type = {
  display: { fontSize: 56, lineHeight: 62, fontWeight: 700, fontFamily: Fonts.rounded },
  title: { fontSize: 34, lineHeight: 41, fontWeight: 700 },
  headline: { fontSize: 28, lineHeight: 34, fontWeight: 600, fontFamily: Fonts.rounded },
  subtitle: { fontSize: 22, lineHeight: 28, fontWeight: 600 },
  default: { fontSize: 17, lineHeight: 24, fontWeight: 500 },
  small: { fontSize: 15, lineHeight: 21, fontWeight: 500 },
  smallBold: { fontSize: 15, lineHeight: 21, fontWeight: 700 },
} as const satisfies Record<string, TextStyle>;

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
  chip: 14,
  button: 999,
} as const;

export const MaxContentWidth = 800;
