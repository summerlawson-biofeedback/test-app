import AsyncStorage from '@react-native-async-storage/async-storage';

export type NudgeOutcome = 'pending' | 'tapped' | 'dismissed' | 'ignored';

export type NudgeRecord = {
  /** The notification's identifier. */
  id: string;
  sentAt: string;
  outcome: NudgeOutcome;
  outcomeAt?: string;
};

// Stored only on this phone, newest last.
const KEY = 'pulsepause.nudges.v1';
const MAX_RECORDS = 500;

export async function loadNudges(): Promise<NudgeRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as NudgeRecord[]) : [];
  } catch {
    return [];
  }
}

async function saveNudges(records: NudgeRecord[]) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(records.slice(-MAX_RECORDS)));
  } catch {
    // Losing a log entry should never get in the way of the nudge itself.
  }
}

export async function logNudgeSent(id: string) {
  await saveNudges([...(await loadNudges()), { id, sentAt: new Date().toISOString(), outcome: 'pending' }]);
}

/**
 * Records the first outcome, except that a tap always wins: tapping clears the
 * notification, which could otherwise be read as a dismissal a moment earlier.
 */
export async function logNudgeOutcome(id: string, outcome: Exclude<NudgeOutcome, 'pending'>) {
  const records = await loadNudges();
  const record = records.find((r) => r.id === id);
  if (!record || record.outcome === 'tapped') return;
  if (record.outcome !== 'pending' && outcome !== 'tapped') return;
  record.outcome = outcome;
  record.outcomeAt = new Date().toISOString();
  await saveNudges(records);
}
