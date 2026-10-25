import { FORECAST_CONFIG } from '@/forecast/config';
import { heartLayer, morningForecast, sleepLayer } from '@/forecast/engine';

const HOURS = 60;

describe('sleepLayer', () => {
  it.each([
    [8 * HOURS, 'solid'],
    [7 * HOURS, 'solid'],
    [6.5 * HOURS, 'light'],
    [6 * HOURS, 'light'],
    [5 * HOURS, 'short'],
  ])('%i minutes is %s', (minutes, layer) => {
    expect(sleepLayer(minutes)).toBe(layer);
  });
});

describe('heartLayer', () => {
  it.each([
    [58, 'usual'],
    [60, 'usual'],
    [61, 'a-little-higher'],
    [65, 'higher'],
  ])('resting %i vs usual 58 is %s', (today, layer) => {
    expect(heartLayer(today, 58)).toBe(layer);
  });
});

describe('morningForecast', () => {
  it('is Clear after a solid night with a usual resting heart rate', () => {
    expect(morningForecast({ asleepMinutes: 7.5 * HOURS, restingToday: 58, restingUsual: 58 })).toMatchObject({
      forecast: 'clear',
      sleep: 'solid',
      heart: 'usual',
    });
  });

  it('is Variable after a light night', () => {
    const result = morningForecast({ asleepMinutes: 6.5 * HOURS, restingToday: 58, restingUsual: 58 });
    expect(result).toMatchObject({ forecast: 'variable', sleep: 'light' });
    expect(result?.suggestion).toMatch(/lighter night/);
  });

  it('is Variable when only the heart is a little higher', () => {
    const result = morningForecast({ asleepMinutes: 7.5 * HOURS, restingToday: 62, restingUsual: 58 });
    expect(result).toMatchObject({ forecast: 'variable', heart: 'a-little-higher' });
    expect(result?.suggestion).toMatch(/heart/);
  });

  it('is Stormy after a short night with a higher resting heart rate', () => {
    const result = morningForecast({ asleepMinutes: 5 * HOURS, restingToday: 66, restingUsual: 58 });
    expect(result).toMatchObject({ forecast: 'stormy', sleep: 'short', heart: 'higher' });
    expect(result?.suggestion).toBe('Lower reserves today. Maybe hold the news cycle until after lunch.');
  });

  it('works from sleep alone while the heart baseline is still learning', () => {
    expect(morningForecast({ asleepMinutes: 7.5 * HOURS, restingToday: 70, restingUsual: null })).toMatchObject({
      forecast: 'clear',
      heart: null,
    });
  });

  it('works from heart alone when there is no sleep data', () => {
    expect(morningForecast({ asleepMinutes: null, restingToday: 66, restingUsual: 58 })).toMatchObject({
      forecast: 'variable',
      sleep: null,
    });
  });

  it('has nothing to say with no data at all', () => {
    expect(morningForecast({ asleepMinutes: null, restingToday: null, restingUsual: null })).toBeNull();
  });

  it('uses adjusted thresholds from config', () => {
    const relaxed = { ...FORECAST_CONFIG, shortSleepMinutes: 4 * HOURS, solidSleepMinutes: 5 * HOURS };
    expect(
      morningForecast({ asleepMinutes: 5 * HOURS, restingToday: 58, restingUsual: 58 }, relaxed)?.forecast
    ).toBe('clear');
  });

  it('never uses partisan or judging language', () => {
    const inputs = [
      { asleepMinutes: 8 * HOURS, restingToday: 58, restingUsual: 58 },
      { asleepMinutes: 6.5 * HOURS, restingToday: 58, restingUsual: 58 },
      { asleepMinutes: 8 * HOURS, restingToday: 62, restingUsual: 58 },
      { asleepMinutes: 5 * HOURS, restingToday: 66, restingUsual: 58 },
    ];
    for (const input of inputs) {
      expect(morningForecast(input)?.suggestion).not.toMatch(
        /politic|party|productive|lazy|bad|should|must|anxiety|diagnos/i
      );
    }
  });
});
