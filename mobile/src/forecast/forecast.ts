import type { SFSymbol } from 'expo-symbols';

import type { Forecast } from '@/constants/theme';

export type { Forecast };

export type TodaySummary = {
  forecast: Forecast;
  /** Quickest return to baseline today, in minutes. Null if there hasn't been one yet. */
  recoveryMinutes: number | null;
  averageRecoveryMinutes: number;
  wins: string[];
};

export const FORECAST_COPY: Record<Forecast, { label: string; line: string; symbol: SFSymbol }> = {
  clear: {
    label: 'Clear',
    line: 'Your foundation is solid today. A good day to take on the hard stuff.',
    symbol: 'sun.horizon.fill',
  },
  variable: {
    label: 'Variable',
    line: 'Some layers are lighter today. Small resets will go a long way.',
    symbol: 'cloud.sun.fill',
  },
  stormy: {
    label: 'Stormy',
    line: 'Your body is carrying more today. Fuel early and keep a reset close.',
    symbol: 'cloud.fill',
  },
};

// Sample days so the design can be previewed before real data exists.
export const SAMPLE_DAYS: Record<Forecast, TodaySummary> = {
  clear: {
    forecast: 'clear',
    recoveryMinutes: 6,
    averageRecoveryMinutes: 14,
    wins: [
      'Back to steady 6 min after your 2 pm meeting',
      'Woke within 15 min of your usual time',
      'Fueled before 10 am',
    ],
  },
  variable: {
    forecast: 'variable',
    recoveryMinutes: 11,
    averageRecoveryMinutes: 14,
    wins: ['Took a 90-second reset before lunch', 'Two hours of steady this afternoon'],
  },
  stormy: {
    forecast: 'stormy',
    recoveryMinutes: 17,
    averageRecoveryMinutes: 14,
    wins: ['You noticed and paused. That is the skill.', 'Fueled after your workout'],
  },
};
