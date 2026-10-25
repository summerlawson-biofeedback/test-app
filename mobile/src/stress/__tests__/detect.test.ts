import type { Sample } from '@/health/source';
import { restingBaseline } from '@/stress/baseline';
import { STRESS_CONFIG } from '@/stress/config';
import { detectStressMoment, isQuietHour, type DetectionInput } from '@/stress/detect';

const MINUTE = 60_000;
// 2 pm local time on a weekday, well outside quiet hours.
const NOW = new Date(2026, 9, 26, 14, 0);
const TWO_WEEKS = [57, 59, 58, 60, 56, 58, 59, 57, 58, 61, 58, 57, 59, 58]; // median 58

/** One sample per minute for the last `minutes` minutes before `now`. */
function perMinute(minutes: number, value: (minutesAgo: number) => number, now = NOW): Sample[] {
  return Array.from({ length: minutes }, (_, i) => ({
    at: new Date(now.getTime() - i * MINUTE),
    value: value(i),
  })).reverse();
}

function input(overrides: Partial<DetectionInput> = {}): DetectionInput {
  return {
    now: NOW,
    heartRate: perMinute(10, () => 92), // well above 58 + 20
    steps: perMinute(30, () => 3), // sitting
    dailyResting: TWO_WEEKS,
    previousFlags: [],
    ...overrides,
  };
}

const at = (hour: number, minute = 0) => new Date(2026, 9, 26, hour, minute);

describe('restingBaseline', () => {
  it('is the median of the last 14 days', () => {
    expect(restingBaseline(TWO_WEEKS)).toBe(58);
  });

  it('ignores one odd night', () => {
    expect(restingBaseline([...TWO_WEEKS.slice(1), 95])).toBe(58);
  });

  it('only uses the most recent 14 days', () => {
    expect(restingBaseline([90, 90, 90, ...TWO_WEEKS])).toBe(58);
  });

  it('is still learning with fewer than 7 days', () => {
    expect(restingBaseline([58, 59, 57, 60, 58, 59])).toBeNull();
  });
});

describe('detectStressMoment', () => {
  it('flags a stress moment: heart rate well above baseline while sitting still', () => {
    expect(detectStressMoment(input())).toEqual({
      flagged: true,
      baseline: 58,
      threshold: 78,
      averageHeartRate: 92,
    });
  });

  it('does not flag a heart rate only a little above baseline', () => {
    const result = detectStressMoment(input({ heartRate: perMinute(10, () => 70) }));
    expect(result).toMatchObject({ flagged: false, reason: 'not-elevated' });
  });

  it('does not flag a single brief spike', () => {
    const spike = perMinute(10, (m) => (m < 2 ? 110 : 66));
    expect(detectStressMoment(input({ heartRate: spike }))).toMatchObject({
      flagged: false,
      reason: 'not-elevated',
    });
  });

  it('does not flag exercise: lots of steps in the window', () => {
    const result = detectStressMoment(
      input({ heartRate: perMinute(10, () => 135), steps: perMinute(30, () => 150) })
    );
    expect(result).toMatchObject({ flagged: false, reason: 'moving' });
  });

  it('does not flag sitting down right after a workout', () => {
    const steps = perMinute(30, (m) => (m < 10 ? 2 : 160));
    expect(detectStressMoment(input({ heartRate: perMinute(10, () => 104), steps }))).toMatchObject({
      flagged: false,
      reason: 'recent-exercise',
    });
  });

  it('waits while the baseline is still learning', () => {
    expect(detectStressMoment(input({ dailyResting: [58, 59, 57] }))).toMatchObject({
      flagged: false,
      reason: 'learning',
    });
  });

  it('needs enough heart-rate readings to judge', () => {
    expect(detectStressMoment(input({ heartRate: perMinute(2, () => 92) }))).toMatchObject({
      flagged: false,
      reason: 'no-data',
    });
  });

  describe('cooldown', () => {
    it('does not flag again within 2 hours', () => {
      const previousFlags = [new Date(NOW.getTime() - 119 * MINUTE)];
      expect(detectStressMoment(input({ previousFlags }))).toMatchObject({
        flagged: false,
        reason: 'cooldown',
      });
    });

    it('can flag again once 2 hours have passed', () => {
      const previousFlags = [new Date(NOW.getTime() - 120 * MINUTE)];
      expect(detectStressMoment(input({ previousFlags })).flagged).toBe(true);
    });

    it('stops at 3 a day', () => {
      const previousFlags = [at(7, 30), at(9, 45), at(11, 50)];
      expect(detectStressMoment(input({ previousFlags }))).toMatchObject({
        flagged: false,
        reason: 'daily-limit',
      });
    });

    it('does not count yesterday toward today', () => {
      const yesterday = (h: number) => new Date(2026, 9, 25, h);
      const previousFlags = [yesterday(9), yesterday(13), yesterday(17)];
      expect(detectStressMoment(input({ previousFlags })).flagged).toBe(true);
    });
  });

  describe('quiet hours (10 pm to 7 am)', () => {
    it.each([
      [22, 0],
      [23, 30],
      [3, 0],
      [6, 59],
    ])('stays quiet at %i:%i', (hour, minute) => {
      const now = at(hour, minute);
      const result = detectStressMoment(
        input({ now, heartRate: perMinute(10, () => 92, now), steps: perMinute(30, () => 3, now) })
      );
      expect(result).toMatchObject({ flagged: false, reason: 'quiet-hours' });
    });

    it('is awake again at 7 am', () => {
      expect(isQuietHour(at(7, 0), STRESS_CONFIG.quietHours)).toBe(false);
    });

    it('handles quiet hours that do not cross midnight', () => {
      expect(isQuietHour(at(13, 30), { start: 13, end: 14 })).toBe(true);
      expect(isQuietHour(at(14, 0), { start: 13, end: 14 })).toBe(false);
    });
  });

  describe('pause from a context check-in', () => {
    it('stays quiet while paused', () => {
      const pausedUntil = new Date(NOW.getTime() + 10 * MINUTE);
      expect(detectStressMoment(input({ pausedUntil }))).toMatchObject({
        flagged: false,
        reason: 'paused',
      });
    });

    it('flags again once the pause has ended', () => {
      const pausedUntil = new Date(NOW.getTime() - MINUTE);
      expect(detectStressMoment(input({ pausedUntil })).flagged).toBe(true);
    });
  });

  it('uses adjusted thresholds from config', () => {
    const stricter = { ...STRESS_CONFIG, aboveBaselineBpm: 40 };
    expect(detectStressMoment(input(), stricter)).toMatchObject({
      flagged: false,
      reason: 'not-elevated',
      threshold: 98,
    });
  });
});
