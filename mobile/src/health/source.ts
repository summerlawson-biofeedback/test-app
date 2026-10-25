import type { SignalId } from '@/health/signals';

export type Reading = {
  value: string;
  unit?: string;
  /** When the reading was taken, as a short human label. */
  when: string;
};

export type Readings = Partial<Record<SignalId, Reading>>;

/** One timestamped value: bpm for heart rate, step count for that minute for steps. */
export type Sample = { at: Date; value: number };

/**
 * Where health data comes from. The mock works in Expo Go today; an Apple Health source
 * (HealthKit, which needs a development build) will implement the same shape.
 */
export interface HealthDataSource {
  kind: 'mock' | 'apple-health';
  /**
   * Asks the OS for read access. HealthKit never reveals whether read access was denied,
   * so this only reports that the request was shown.
   */
  requestAccess(signals: SignalId[]): Promise<void>;
  /** Latest value of each signal, for display. */
  readLatest(signals: SignalId[]): Promise<Readings>;
  /** One resting heart rate per day for the last `days` days, oldest first. */
  getDailyRestingHeartRate(days: number, now: Date): Promise<number[]>;
  getHeartRate(from: Date, to: Date): Promise<Sample[]>;
  getSteps(from: Date, to: Date): Promise<Sample[]>;
}
