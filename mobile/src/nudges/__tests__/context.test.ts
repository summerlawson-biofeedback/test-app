import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  contextPatterns,
  loadContextLog,
  loadPausedUntil,
  recordContext,
  type ContextAnswer,
  type ContextRecord,
} from '@/nudges/context';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const NOW = new Date(2026, 9, 26, 14, 0);
const MINUTE = 60_000;

const record = (answer: ContextAnswer, hour: number): ContextRecord => ({
  at: new Date(2026, 9, 20, hour, 15).toISOString(),
  answer,
  suggestedMoving: false,
  from: 'app',
});

beforeEach(() => AsyncStorage.clear());

describe('recordContext', () => {
  it('saves the answer', async () => {
    await recordContext({ answer: 'hands-busy', suggestedMoving: false, from: 'notification' }, NOW);
    expect(await loadContextLog()).toEqual([
      { answer: 'hands-busy', suggestedMoving: false, from: 'notification', at: NOW.toISOString() },
    ]);
  });

  it.each([
    ['moving', 30],
    ['hands-busy', 30],
    ['winding-down', 120],
  ] as const)('"%s" pauses nudges for %i minutes', async (answer, minutes) => {
    await recordContext({ answer, suggestedMoving: false, from: 'app' }, NOW);
    expect(await loadPausedUntil()).toEqual(new Date(NOW.getTime() + minutes * MINUTE));
  });

  it('"Just scrolling" does not pause anything', async () => {
    await recordContext({ answer: 'scrolling', suggestedMoving: false, from: 'app' }, NOW);
    expect(await loadPausedUntil()).toBeNull();
  });

  it('never shortens a longer pause', async () => {
    await recordContext({ answer: 'winding-down', suggestedMoving: false, from: 'app' }, NOW);
    await recordContext({ answer: 'moving', suggestedMoving: true, from: 'app' }, NOW);
    expect(await loadPausedUntil()).toEqual(new Date(NOW.getTime() + 120 * MINUTE));
  });
});

describe('contextPatterns', () => {
  it('counts each answer and finds its most common hour', () => {
    const log = [
      record('winding-down', 21),
      record('winding-down', 21),
      record('winding-down', 20),
      record('moving', 8),
    ];
    expect(contextPatterns(log)).toEqual([
      { answer: 'winding-down', count: 3, commonHour: 21 },
      { answer: 'moving', count: 1, commonHour: 8 },
    ]);
  });

  it('is empty with no answers', () => {
    expect(contextPatterns([])).toEqual([]);
  });
});
