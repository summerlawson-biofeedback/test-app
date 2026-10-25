/**
 * The Apple Health signals PulsePause reads, with the plain-language reason shown on the
 * permission screen. Wording stays in wellness terms: context for the person, never a diagnosis.
 */

export type SignalId =
  | 'heartRate'
  | 'restingHeartRate'
  | 'hrv'
  | 'respiratoryRate'
  | 'steps'
  | 'sleep'
  | 'bloodPressure';

export type Signal = {
  id: SignalId;
  label: string;
  why: string;
  /** Optional signals are off until the person turns them on. */
  optional?: boolean;
};

export const SIGNALS: Signal[] = [
  {
    id: 'heartRate',
    label: 'Heart rate',
    why: 'Notices when your body is running hot while you are sitting still.',
  },
  {
    id: 'restingHeartRate',
    label: 'Resting heart rate',
    why: 'Part of your morning readiness, compared with your own normal.',
  },
  {
    id: 'hrv',
    label: 'Heart rate variability',
    why: 'A daily read on how recovered your nervous system is.',
  },
  {
    id: 'respiratoryRate',
    label: 'Respiratory rate',
    why: 'Adds context to overnight recovery.',
  },
  {
    id: 'steps',
    label: 'Steps and activity',
    why: 'So a workout is never mistaken for stress.',
  },
  {
    id: 'sleep',
    label: 'Sleep',
    why: 'Your sleep foundation: timing, duration and wake-time consistency.',
  },
  {
    id: 'bloodPressure',
    label: 'Blood pressure',
    why: 'Trend context from a cuff, if you use one. Never used for alerts.',
    optional: true,
  },
];

export const DEFAULT_SIGNALS: SignalId[] = SIGNALS.filter((s) => !s.optional).map((s) => s.id);
