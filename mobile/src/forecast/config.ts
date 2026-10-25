/**
 * Morning forecast thresholds in one place. Starting values to tune in testing.
 */
export const FORECAST_CONFIG = {
  /** At least this much sleep is a solid night... */
  solidSleepMinutes: 7 * 60,
  /** ...under this is a short one; in between is light. */
  shortSleepMinutes: 6 * 60,

  /** Resting heart rate this many bpm over the person's usual is "a little higher"... */
  slightlyUpBpm: 3,
  /** ...and this many is "higher". */
  upBpm: 7,

  /** Load points (sleep + heart) at or above these give a Variable or Stormy morning. */
  variableFrom: 1,
  stormyFrom: 3,

  /** Default morning notification time. */
  defaultHour: 7,
  defaultMinute: 30,
};

export type ForecastConfig = typeof FORECAST_CONFIG;
