import type { SignalId } from '@/health/signals';

export type Reading = {
  value: string;
  unit?: string;
  /** When the reading was taken, as a short human label. */
  when: string;
};

export type Readings = Partial<Record<SignalId, Reading>>;

/**
 * Where health data comes from. The sample source works in Expo Go today; an Apple Health
 * source (HealthKit, which needs a development build) will implement the same shape.
 */
export type HealthSource = {
  kind: 'sample' | 'apple-health';
  /**
   * Asks the OS for read access. HealthKit never reveals whether read access was denied,
   * so this only reports that the request was shown.
   */
  requestAccess(signals: SignalId[]): Promise<void>;
  readLatest(signals: SignalId[]): Promise<Readings>;
};

const SAMPLE_READINGS: Readings = {
  heartRate: { value: '72', unit: 'bpm', when: '2 min ago' },
  restingHeartRate: { value: '58', unit: 'bpm', when: 'this morning' },
  hrv: { value: '62', unit: 'ms', when: 'this morning' },
  respiratoryRate: { value: '14.2', unit: 'breaths/min', when: 'overnight' },
  steps: { value: '4,312', when: 'today so far' },
  sleep: { value: '7h 12m', when: 'woke at 6:48' },
  bloodPressure: { value: '118/76', unit: 'mmHg', when: 'yesterday' },
};

export const sampleSource: HealthSource = {
  kind: 'sample',
  async requestAccess() {},
  async readLatest(signals) {
    return Object.fromEntries(
      signals.flatMap((id) => (SAMPLE_READINGS[id] ? [[id, SAMPLE_READINGS[id]]] : []))
    );
  },
};
