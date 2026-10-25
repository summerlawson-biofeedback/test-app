import { useEffect, useState } from 'react';

import { useHealth } from '@/health/health-context';
import { morningForecast, type MorningForecast } from '@/forecast/engine';
import { restingBaseline } from '@/stress/baseline';
import { STRESS_CONFIG } from '@/stress/config';

export type MorningSummary = {
  forecast: MorningForecast | null;
  asleepMinutes: number | null;
  restingToday: number | null;
  restingUsual: number | null;
};

const EMPTY: MorningSummary = { forecast: null, asleepMinutes: null, restingToday: null, restingUsual: null };

/** Reads last night and this morning from the health source and builds the forecast. */
export function useMorningForecast(refreshKey?: unknown) {
  const { source } = useHealth();
  const [summary, setSummary] = useState<MorningSummary>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const now = new Date();
      const sleep = await source.getLastNightSleep(now);
      // Today's resting value is the last one; "usual" is the baseline from the days before.
      const days = await source.getDailyRestingHeartRate(STRESS_CONFIG.baselineDays + 1, now);
      const restingToday = days.at(-1) ?? null;
      const restingUsual = restingBaseline(days.slice(0, -1));
      const asleepMinutes = sleep?.asleepMinutes ?? null;
      if (!cancelled) {
        setSummary({
          forecast: morningForecast({ asleepMinutes, restingToday, restingUsual }),
          asleepMinutes,
          restingToday,
          restingUsual,
        });
      }
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [source, refreshKey]);

  return summary;
}
