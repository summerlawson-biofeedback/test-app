import type { Forecast } from '@/constants/theme';
import { FORECAST_CONFIG, type ForecastConfig } from '@/forecast/config';

export type SleepLayer = 'solid' | 'light' | 'short';
export type HeartLayer = 'usual' | 'a-little-higher' | 'higher';

export type MorningInput = {
  /** Minutes asleep last night, or null if there's no sleep data. */
  asleepMinutes: number | null;
  /** This morning's resting heart rate, or null. */
  restingToday: number | null;
  /** The person's usual resting heart rate, or null while still learning. */
  restingUsual: number | null;
};

export type MorningForecast = {
  forecast: Forecast;
  sleep: SleepLayer | null;
  heart: HeartLayer | null;
  /** One gentle suggestion for the day. */
  suggestion: string;
};

const SLEEP_LOAD: Record<SleepLayer, number> = { solid: 0, light: 1, short: 2 };
const HEART_LOAD: Record<HeartLayer, number> = { usual: 0, 'a-little-higher': 1, higher: 2 };

export function sleepLayer(minutes: number, config: ForecastConfig = FORECAST_CONFIG): SleepLayer {
  if (minutes >= config.solidSleepMinutes) return 'solid';
  return minutes < config.shortSleepMinutes ? 'short' : 'light';
}

export function heartLayer(today: number, usual: number, config: ForecastConfig = FORECAST_CONFIG): HeartLayer {
  const above = today - usual;
  if (above >= config.upBpm) return 'higher';
  return above >= config.slightlyUpBpm ? 'a-little-higher' : 'usual';
}

/**
 * The morning "inner weather" from last night's sleep and this morning's resting heart rate.
 * Null when there's nothing to go on yet. Suggestions are invitations, never instructions,
 * and stay nonpartisan ("the news cycle", "the feed").
 */
export function morningForecast(
  { asleepMinutes, restingToday, restingUsual }: MorningInput,
  config: ForecastConfig = FORECAST_CONFIG
): MorningForecast | null {
  const sleep = asleepMinutes === null ? null : sleepLayer(asleepMinutes, config);
  const heart =
    restingToday === null || restingUsual === null ? null : heartLayer(restingToday, restingUsual, config);
  if (sleep === null && heart === null) return null;

  const load = (sleep ? SLEEP_LOAD[sleep] : 0) + (heart ? HEART_LOAD[heart] : 0);
  const forecast: Forecast =
    load >= config.stormyFrom ? 'stormy' : load >= config.variableFrom ? 'variable' : 'clear';

  return { forecast, sleep, heart, suggestion: suggestionFor(forecast, sleep, heart) };
}

function suggestionFor(forecast: Forecast, sleep: SleepLayer | null, heart: HeartLayer | null) {
  if (forecast === 'clear') return 'Good reserves today. A fine day for the harder conversations.';
  if (forecast === 'stormy') return 'Lower reserves today. Maybe hold the news cycle until after lunch.';
  // Variable: point at whichever layer is lighter.
  if (sleep === 'short' || sleep === 'light') {
    return 'A lighter night. Fuel early, and keep a reset close for your busiest stretch.';
  }
  if (heart && heart !== 'usual') {
    return 'Your heart is working a little harder this morning. Maybe go easy on the feed.';
  }
  return 'A little variable today. A short reset before your busiest stretch could help.';
}
