import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * One-tap context check-in shown with a nudge. Every answer is equally fine: the options
 * are context, never a judgment, so nothing here is labelled productive or unproductive.
 */
export type ContextAnswer = 'moving' | 'hands-busy' | 'winding-down' | 'scrolling';

export const CONTEXT_OPTIONS: { id: ContextAnswer; label: string; pauseMinutes: number }[] = [
  { id: 'moving', label: "I'm moving", pauseMinutes: 30 },
  { id: 'hands-busy', label: 'Hands busy', pauseMinutes: 30 },
  { id: 'winding-down', label: 'Winding down on purpose', pauseMinutes: 120 },
  { id: 'scrolling', label: 'Just scrolling', pauseMinutes: 0 },
];

export type ContextRecord = {
  at: string;
  answer: ContextAnswer;
  /** Whether "I'm moving" was pre-selected from motion data. */
  suggestedMoving: boolean;
  from: 'notification' | 'app';
  nudgeId?: string;
};

// Stored only on this phone, newest last.
const LOG_KEY = 'pulsepause.context.v1';
const PAUSE_KEY = 'pulsepause.nudge-pause.v1';
const MAX_RECORDS = 500;

export async function loadContextLog(): Promise<ContextRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as ContextRecord[]) : [];
  } catch {
    return [];
  }
}

export async function loadPausedUntil(): Promise<Date | null> {
  try {
    const raw = await AsyncStorage.getItem(PAUSE_KEY);
    return raw ? new Date(raw) : null;
  } catch {
    return null;
  }
}

/** Saves the answer and pauses nudges for that answer's window (never shortens a pause). */
export async function recordContext(record: Omit<ContextRecord, 'at'>, now = new Date()) {
  try {
    const log = await loadContextLog();
    await AsyncStorage.setItem(
      LOG_KEY,
      JSON.stringify([...log, { ...record, at: now.toISOString() }].slice(-MAX_RECORDS))
    );

    const minutes = CONTEXT_OPTIONS.find((o) => o.id === record.answer)?.pauseMinutes ?? 0;
    if (minutes === 0) return;
    const until = new Date(now.getTime() + minutes * 60_000);
    const current = await loadPausedUntil();
    if (!current || current < until) await AsyncStorage.setItem(PAUSE_KEY, until.toISOString());
  } catch {
    // A lost answer should never get in the way.
  }
}

export type ContextPattern = { answer: ContextAnswer; count: number; commonHour: number };

/**
 * Personal patterns: how often each answer comes up and the hour it is most common.
 * Descriptive only; the screen decides wording and never ranks the answers.
 */
export function contextPatterns(log: ContextRecord[]): ContextPattern[] {
  const patterns: ContextPattern[] = [];
  for (const { id } of CONTEXT_OPTIONS) {
    const hours = log.filter((r) => r.answer === id).map((r) => new Date(r.at).getHours());
    if (hours.length === 0) continue;
    const byHour = new Map<number, number>();
    hours.forEach((h) => byHour.set(h, (byHour.get(h) ?? 0) + 1));
    const commonHour = [...byHour].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0];
    patterns.push({ answer: id, count: hours.length, commonHour });
  }
  return patterns.sort((a, b) => b.count - a.count);
}
