import { STRESS_CONFIG, type StressConfig } from '@/stress/config';

/**
 * Personal resting heart-rate baseline: the median of the most recent days, so one odd
 * night doesn't move it. Null while still learning (too few days).
 */
export function restingBaseline(dailyResting: number[], config: StressConfig = STRESS_CONFIG) {
  const days = dailyResting
    .filter((bpm) => Number.isFinite(bpm) && bpm > 0)
    .slice(-config.baselineDays);
  if (days.length < config.minBaselineDays) return null;

  const sorted = [...days].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
