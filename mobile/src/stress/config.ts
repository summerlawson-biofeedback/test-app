/**
 * Every stress-detection threshold in one place. Starting values to tune in testing;
 * change them here and nowhere else.
 */
export const STRESS_CONFIG = {
  /** How many days of resting heart rate make up the personal baseline. */
  baselineDays: 14,
  /** Learning mode (no flags) until at least this many days of resting heart rate exist. */
  minBaselineDays: 7,

  /** How far back each check looks, in minutes. */
  windowMinutes: 10,
  /** "Meaningfully above baseline": average heart rate at least this many bpm over resting. */
  aboveBaselineBpm: 20,
  /** Share of heart-rate readings in the window that must be above the line (sustained, not a blip). */
  minElevatedShare: 0.8,
  /** Fewer readings than this in the window is not enough to judge. */
  minHeartRateSamples: 3,

  /** "Mostly still": at most this many steps in the window. */
  maxStepsInWindow: 200,
  /** Heart rate stays up after a workout, so look back this far before the window... */
  recentExerciseLookbackMinutes: 20,
  /** ...and treat this many steps in that stretch as recent exercise, not stress. */
  recentExerciseSteps: 1000,

  /** At most one stress moment per this many minutes. */
  cooldownMinutes: 120,
  /** And at most this many per calendar day. */
  maxPerDay: 3,
  /** No flags overnight, in local 24-hour time. Start after end means it wraps past midnight. */
  quietHours: { start: 22, end: 7 },
};

export type StressConfig = typeof STRESS_CONFIG;
