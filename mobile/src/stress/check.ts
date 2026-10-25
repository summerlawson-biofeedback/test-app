import AsyncStorage from '@react-native-async-storage/async-storage';

import type { HealthDataSource } from '@/health/source';
import { loadPausedUntil } from '@/nudges/context';
import { sendStressNudge } from '@/nudges/notify';
import { FREQUENCIES, loadNudgeSettings } from '@/nudges/settings';
import { STRESS_CONFIG, type StressConfig } from '@/stress/config';
import { detectStressMoment, type DetectionResult } from '@/stress/detect';

const FLAGS_KEY = 'pulsepause.stress-flags.v1';
const MINUTE = 60_000;

async function loadFlags(): Promise<Date[]> {
  try {
    const raw = await AsyncStorage.getItem(FLAGS_KEY);
    return raw ? (JSON.parse(raw) as string[]).map((s) => new Date(s)) : [];
  } catch {
    return [];
  }
}

async function recordFlag(at: Date) {
  // Only the last day matters for cooldown and the daily limit.
  const recent = (await loadFlags()).filter((f) => at.getTime() - f.getTime() < 24 * 60 * MINUTE);
  await AsyncStorage.setItem(FLAGS_KEY, JSON.stringify([...recent, at].map((f) => f.toISOString()))).catch(
    () => {}
  );
}

export async function clearStressFlags() {
  await AsyncStorage.removeItem(FLAGS_KEY).catch(() => {});
}

export type StressCheck = DetectionResult & { nudged: boolean; nudgesOff: boolean };

/**
 * One full pass of the loop: read recent data, run the detector with the person's nudge
 * frequency, and send a nudge if it's a stress moment and nudges are on.
 */
export async function runStressCheck(
  source: HealthDataSource,
  { now = new Date(), overrides = {} }: { now?: Date; overrides?: Partial<StressConfig> } = {}
): Promise<StressCheck> {
  const settings = await loadNudgeSettings();
  const config: StressConfig = { ...STRESS_CONFIG, ...FREQUENCIES[settings.frequency].limits, ...overrides };
  const since = (minutes: number) => new Date(now.getTime() - minutes * MINUTE);

  const result = detectStressMoment(
    {
      now,
      heartRate: await source.getHeartRate(since(config.windowMinutes), now),
      steps: await source.getSteps(since(config.windowMinutes + config.recentExerciseLookbackMinutes), now),
      dailyResting: await source.getDailyRestingHeartRate(config.baselineDays, now),
      previousFlags: await loadFlags(),
      pausedUntil: await loadPausedUntil(),
    },
    config
  );

  if (!result.flagged) return { ...result, nudged: false, nudgesOff: !settings.enabled };

  // Turning nudges off means not flagging at all, so the cooldown isn't used up silently.
  if (!settings.enabled) return { ...result, nudged: false, nudgesOff: true };

  await recordFlag(now);
  await sendStressNudge();
  return { ...result, nudged: true, nudgesOff: false };
}
