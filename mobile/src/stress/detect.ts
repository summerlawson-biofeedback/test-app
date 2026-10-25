import type { Sample } from '@/health/source';
import { restingBaseline } from '@/stress/baseline';
import { STRESS_CONFIG, type StressConfig } from '@/stress/config';

export type NotFlaggedReason =
  | 'quiet-hours'
  | 'paused'
  | 'daily-limit'
  | 'cooldown'
  | 'learning'
  | 'no-data'
  | 'not-elevated'
  | 'moving'
  | 'recent-exercise';

export type DetectionInput = {
  now: Date;
  /** Heart-rate readings (bpm) covering at least the window. */
  heartRate: Sample[];
  /** Step counts covering the window plus the recent-exercise lookback. */
  steps: Sample[];
  /** Daily resting heart rate, oldest first. */
  dailyResting: number[];
  /** When earlier stress moments were flagged. */
  previousFlags: Date[];
  /** Nudges paused until then, e.g. after "I'm moving" in a context check-in. */
  pausedUntil?: Date | null;
};

export type DetectionResult =
  | { flagged: true; baseline: number; threshold: number; averageHeartRate: number }
  | {
      flagged: false;
      reason: NotFlaggedReason;
      baseline: number | null;
      threshold?: number;
      averageHeartRate?: number;
    };

const MINUTE = 60_000;

const inRange = (samples: Sample[], from: number, to: number) =>
  samples.filter((s) => s.at.getTime() > from && s.at.getTime() <= to);

const sum = (samples: Sample[]) => samples.reduce((total, s) => total + s.value, 0);

export function isQuietHour(now: Date, { start, end }: StressConfig['quietHours']) {
  const hour = now.getHours();
  return start > end ? hour >= start || hour < end : hour >= start && hour < end;
}

/**
 * Is this a stress moment? Heart rate meaningfully above the person's own resting baseline
 * while they are mostly still, outside quiet hours and the cooldown. When not, says why.
 */
export function detectStressMoment(
  { now, heartRate, steps, dailyResting, previousFlags, pausedUntil }: DetectionInput,
  config: StressConfig = STRESS_CONFIG
): DetectionResult {
  const t = now.getTime();
  const baseline = restingBaseline(dailyResting, config);

  if (isQuietHour(now, config.quietHours)) return { flagged: false, reason: 'quiet-hours', baseline };
  if (pausedUntil && t < pausedUntil.getTime()) return { flagged: false, reason: 'paused', baseline };

  const today = previousFlags.filter((f) => f.toDateString() === now.toDateString());
  if (today.length >= config.maxPerDay) return { flagged: false, reason: 'daily-limit', baseline };

  if (previousFlags.some((f) => t - f.getTime() < config.cooldownMinutes * MINUTE)) {
    return { flagged: false, reason: 'cooldown', baseline };
  }

  if (baseline === null) return { flagged: false, reason: 'learning', baseline };

  const windowStart = t - config.windowMinutes * MINUTE;
  const readings = inRange(heartRate, windowStart, t);
  if (readings.length < config.minHeartRateSamples) return { flagged: false, reason: 'no-data', baseline };

  const threshold = baseline + config.aboveBaselineBpm;
  const averageHeartRate = Math.round(sum(readings) / readings.length);
  const elevatedShare = readings.filter((r) => r.value >= threshold).length / readings.length;
  const details = { baseline, threshold, averageHeartRate };

  if (averageHeartRate < threshold || elevatedShare < config.minElevatedShare) {
    return { flagged: false, reason: 'not-elevated', ...details };
  }

  if (sum(inRange(steps, windowStart, t)) > config.maxStepsInWindow) {
    return { flagged: false, reason: 'moving', ...details };
  }

  const lookbackStart = windowStart - config.recentExerciseLookbackMinutes * MINUTE;
  if (sum(inRange(steps, lookbackStart, windowStart)) >= config.recentExerciseSteps) {
    return { flagged: false, reason: 'recent-exercise', ...details };
  }

  return { flagged: true, ...details };
}
