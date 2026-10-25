import { useEffect, useMemo, useState } from 'react';

import { totalSeconds, type Strategy } from '@/calm/strategies';

type Outcome = { seconds: number; completed: boolean };

/** Steps through a strategy's phases in real time. */
export function useGuidedSession(strategy: Strategy) {
  const steps = useMemo(
    () => Array.from({ length: strategy.rounds }, () => strategy.phases).flat(),
    [strategy]
  );
  const total = totalSeconds(strategy);
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(startedAt);
  const [index, setIndex] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // Advance to the next phase when this one's time is up.
  useEffect(() => {
    if (outcome) return;
    const timer = setTimeout(() => {
      if (index + 1 < steps.length) setIndex(index + 1);
      else setOutcome({ seconds: total, completed: true });
    }, steps[index].seconds * 1000);
    return () => clearTimeout(timer);
  }, [index, outcome, steps, total]);

  // Tick once a second for the time-remaining label.
  useEffect(() => {
    if (outcome) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [outcome]);

  const endEarly = () =>
    setOutcome({ seconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)), completed: false });

  return {
    phase: steps[index],
    step: index,
    secondsLeft: Math.max(0, total - Math.floor((now - startedAt) / 1000)),
    outcome,
    endEarly,
  };
}
