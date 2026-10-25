import type { SignalId } from '@/health/signals';
import type { HealthDataSource, Readings, Sample } from '@/health/source';

/** What the mock body is doing right now. The developer screen switches between these. */
export type MockScenario = 'calm' | 'stress' | 'workout' | 'after-workout';

const SAMPLE_READINGS: Readings = {
  heartRate: { value: '72', unit: 'bpm', when: '2 min ago' },
  restingHeartRate: { value: '58', unit: 'bpm', when: 'this morning' },
  hrv: { value: '62', unit: 'ms', when: 'this morning' },
  respiratoryRate: { value: '14.2', unit: 'breaths/min', when: 'overnight' },
  steps: { value: '4,312', when: 'today so far' },
  sleep: { value: '7h 12m', when: 'woke at 6:48' },
  bloodPressure: { value: '118/76', unit: 'mmHg', when: 'yesterday' },
};

// Two weeks of believable resting heart rate (median 58).
const RESTING = [57, 59, 58, 60, 56, 58, 59, 57, 58, 61, 58, 57, 59, 58];

const MINUTE = 60_000;

/** Per-minute heart rate and steps for each scenario. `minutesAgo` counts back from `to`. */
const SCENARIOS: Record<MockScenario, (minutesAgo: number) => { bpm: number; steps: number }> = {
  calm: () => ({ bpm: 66, steps: 4 }),
  stress: () => ({ bpm: 92, steps: 3 }),
  workout: () => ({ bpm: 138, steps: 150 }),
  // Sitting down now, but the last half hour was a run.
  'after-workout': (minutesAgo) =>
    minutesAgo < 10 ? { bpm: 104, steps: 2 } : { bpm: 145, steps: 160 },
};

/** Gentle, repeatable wobble so readings don't look flat. */
const wobble = (minute: number, size: number) => Math.round(Math.sin(minute * 1.7) * size);

export class MockHealthDataSource implements HealthDataSource {
  readonly kind = 'mock' as const;
  scenario: MockScenario = 'calm';

  async requestAccess() {}

  async readLatest(signals: SignalId[]): Promise<Readings> {
    return Object.fromEntries(
      signals.flatMap((id) => (SAMPLE_READINGS[id] ? [[id, SAMPLE_READINGS[id]]] : []))
    );
  }

  // The mock's two weeks always end today, so `now` isn't needed.
  async getDailyRestingHeartRate(days: number, _now?: Date) {
    return RESTING.slice(-days);
  }

  async getHeartRate(from: Date, to: Date) {
    return this.perMinute(from, to, (m) => SCENARIOS[this.scenario](m).bpm + wobble(m, 3));
  }

  async getSteps(from: Date, to: Date) {
    return this.perMinute(from, to, (m) => Math.max(0, SCENARIOS[this.scenario](m).steps + wobble(m, 2)));
  }

  private perMinute(from: Date, to: Date, value: (minutesAgo: number) => number): Sample[] {
    const samples: Sample[] = [];
    for (let at = to.getTime(); at > from.getTime(); at -= MINUTE) {
      const minutesAgo = Math.round((to.getTime() - at) / MINUTE);
      samples.unshift({ at: new Date(at), value: value(minutesAgo) });
    }
    return samples;
  }
}

/** The one mock instance the app shares, so the developer screen can steer it. */
export const mockHealthDataSource = new MockHealthDataSource();
