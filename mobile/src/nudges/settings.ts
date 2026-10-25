import AsyncStorage from '@react-native-async-storage/async-storage';

import { FORECAST_CONFIG } from '@/forecast/config';
import type { StressConfig } from '@/stress/config';

export type NudgeFrequency = 'balanced' | 'gentle';

export type NudgeSettings = {
  enabled: boolean;
  frequency: NudgeFrequency;
  /** Optional daily "inner weather" notification; off unless the person turns it on. */
  morning: { enabled: boolean; hour: number; minute: number };
};

export const FREQUENCIES: Record<
  NudgeFrequency,
  { label: string; detail: string; limits: Pick<StressConfig, 'maxPerDay' | 'cooldownMinutes'> }
> = {
  balanced: {
    label: 'Up to 3 a day',
    detail: 'At least 2 hours apart',
    limits: { maxPerDay: 3, cooldownMinutes: 120 },
  },
  gentle: {
    label: 'Up to 1 a day',
    detail: 'Only your clearest moment',
    limits: { maxPerDay: 1, cooldownMinutes: 120 },
  },
};

export const DEFAULT_NUDGE_SETTINGS: NudgeSettings = {
  enabled: true,
  frequency: 'balanced',
  morning: { enabled: false, hour: FORECAST_CONFIG.defaultHour, minute: FORECAST_CONFIG.defaultMinute },
};

const KEY = 'pulsepause.nudge-settings.v1';

export async function loadNudgeSettings(): Promise<NudgeSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? { ...DEFAULT_NUDGE_SETTINGS, ...JSON.parse(raw) } : DEFAULT_NUDGE_SETTINGS;
  } catch {
    return DEFAULT_NUDGE_SETTINGS;
  }
}

export async function saveNudgeSettings(settings: NudgeSettings) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // Keep going with the in-memory value; it will be asked again next launch.
  }
}
