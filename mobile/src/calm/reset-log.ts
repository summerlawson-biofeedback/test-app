import AsyncStorage from '@react-native-async-storage/async-storage';

/** 1 = steady, 5 = very activated. Null when the person skipped the question. */
export type Rating = 1 | 2 | 3 | 4 | 5;

export type RatingEntry = { rating: Rating | null; at: string };

export type ResetRecord = {
  strategyId: string;
  before: RatingEntry;
  after: RatingEntry;
  seconds: number;
  completed: boolean;
};

// Stored only on this phone (never sent anywhere), newest last.
const KEY = 'pulsepause.resets.v1';
const MAX_RECORDS = 500;

export async function loadResets(): Promise<ResetRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ResetRecord[]) : [];
  } catch {
    return [];
  }
}

export async function saveReset(record: ResetRecord) {
  try {
    const all = await loadResets();
    await AsyncStorage.setItem(KEY, JSON.stringify([...all, record].slice(-MAX_RECORDS)));
  } catch {
    // A lost log entry should never interrupt the reset itself.
  }
}

export const rated = (rating: Rating | null): RatingEntry => ({
  rating,
  at: new Date().toISOString(),
});
