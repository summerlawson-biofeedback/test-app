import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type LastFuel = 'recent' | 'while-ago' | 'not-sure';

/** Fuel first when the last meal was 4+ hours ago or unknown (see docs/positioning.md). */
export const needsFuel = (lastFuel: LastFuel | null) =>
  lastFuel === 'while-ago' || lastFuel === 'not-sure';

export const RECHECK_MINUTES = 5;

type Activation = {
  /** When "I'm activated" was tapped; recovery time is measured from here. */
  startedAt: number;
  lastFuel: LastFuel | null;
  recheckAt: number | null;
};

type CalmState = {
  haptics: boolean;
  setHaptics: (on: boolean) => void;
  activation: Activation | null;
  startActivation: (lastFuel: LastFuel) => void;
  scheduleRecheck: () => void;
  clearActivation: () => void;
};

const CalmContext = createContext<CalmState | null>(null);

// In memory for now, so settings and any pending check-in reset when the app reloads.
export function CalmProvider({ children }: { children: ReactNode }) {
  const [haptics, setHaptics] = useState(false);
  const [activation, setActivation] = useState<Activation | null>(null);

  const startActivation = useCallback((lastFuel: LastFuel) => {
    setActivation({ startedAt: Date.now(), lastFuel, recheckAt: null });
  }, []);

  const scheduleRecheck = useCallback(() => {
    setActivation((a) => (a ? { ...a, recheckAt: Date.now() + RECHECK_MINUTES * 60_000 } : a));
  }, []);

  const clearActivation = useCallback(() => setActivation(null), []);

  return (
    <CalmContext.Provider
      value={{ haptics, setHaptics, activation, startActivation, scheduleRecheck, clearActivation }}>
      {children}
    </CalmContext.Provider>
  );
}

export function useCalm() {
  const value = useContext(CalmContext);
  if (!value) throw new Error('useCalm must be used inside CalmProvider');
  return value;
}
