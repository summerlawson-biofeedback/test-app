import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { rated, type RatingEntry } from '@/calm/reset-log';
import { DEFAULT_STRATEGY_ID, getStrategy } from '@/calm/strategies';
import { ActivationRating } from '@/components/activation-rating';
import { GuidedSession } from '@/components/guided-session';

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const strategy = getStrategy(id) ?? getStrategy(DEFAULT_STRATEGY_ID)!;
  const [before, setBefore] = useState<RatingEntry | null>(null);
  // Changing the key restarts the session for "Another round".
  const [run, setRun] = useState(0);

  if (!before) {
    return (
      <ActivationRating
        eyebrow={strategy.name}
        onAnswer={(rating) => setBefore(rated(rating))}
        onCancel={() => router.back()}
      />
    );
  }

  return (
    <GuidedSession
      key={run}
      strategy={strategy}
      before={before}
      onAgain={() => {
        setBefore(null);
        setRun((r) => r + 1);
      }}
    />
  );
}
