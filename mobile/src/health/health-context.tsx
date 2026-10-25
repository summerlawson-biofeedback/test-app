import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import { DEFAULT_SIGNALS, type SignalId } from '@/health/signals';
import { mockHealthDataSource } from '@/health/mock-source';
import type { HealthDataSource, Readings } from '@/health/source';

export type ConnectionStatus = 'not-asked' | 'connected' | 'skipped';

type HealthState = {
  status: ConnectionStatus;
  source: HealthDataSource;
  signals: SignalId[];
  readings: Readings;
  connect: (signals: SignalId[]) => Promise<void>;
  skip: () => void;
  refresh: () => Promise<void>;
};

const HealthContext = createContext<HealthState | null>(null);

// State lives in memory for now, so it resets when the app reloads.
// Swap the mock for the Apple Health source once a development build exists.
export function HealthProvider({ children }: { children: ReactNode }) {
  const source: HealthDataSource = mockHealthDataSource;
  const [status, setStatus] = useState<ConnectionStatus>('not-asked');
  const [signals, setSignals] = useState<SignalId[]>(DEFAULT_SIGNALS);
  const [readings, setReadings] = useState<Readings>({});

  const connect = useCallback(
    async (chosen: SignalId[]) => {
      await source.requestAccess(chosen);
      setSignals(chosen);
      setReadings(await source.readLatest(chosen));
      setStatus('connected');
    },
    [source]
  );

  const skip = useCallback(() => setStatus('skipped'), []);

  const refresh = useCallback(async () => {
    setReadings(await source.readLatest(signals));
  }, [source, signals]);

  return (
    <HealthContext.Provider value={{ status, source, signals, readings, connect, skip, refresh }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const value = useContext(HealthContext);
  if (!value) throw new Error('useHealth must be used inside HealthProvider');
  return value;
}
