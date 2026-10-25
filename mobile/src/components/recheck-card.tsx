import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { useCalm } from '@/calm/calm-context';
import { DEFAULT_STRATEGY_ID } from '@/calm/strategies';
import { Card } from '@/components/card';
import { PillButton } from '@/components/pill-button';
import { ThemedText } from '@/components/themed-text';

/**
 * The ~5 minute recheck after "I'm activated". Answering "Back to steady" shows how fast
 * the person came back down, measured from when they tapped the button.
 */
export function RecheckCard() {
  const { activation, clearActivation } = useCalm();
  const [now, setNow] = useState(() => Date.now());
  const [recoveredIn, setRecoveredIn] = useState<number | null>(null);
  const [stillActivated, setStillActivated] = useState(false);
  const recheckAt = activation?.recheckAt ?? null;

  useEffect(() => {
    if (recheckAt === null) return;
    const timer = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(timer);
  }, [recheckAt]);

  if (recoveredIn !== null) {
    return (
      <Card eyebrow="Recovery" title={`Back to steady in about ${recoveredIn} min`}>
        <ThemedText themeColor="textSecondary">
          That is your body bouncing back. Each reset teaches it the way.
        </ThemedText>
        <PillButton
          label="Done"
          onPress={() => {
            setRecoveredIn(null);
            clearActivation();
          }}
        />
      </Card>
    );
  }

  if (!activation || recheckAt === null) return null;

  if (now < recheckAt) {
    const time = new Date(recheckAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    return (
      <Card eyebrow="Check-in" title={`At ${time}`}>
        <ThemedText themeColor="textSecondary">We will ask how you are doing then.</ThemedText>
      </Card>
    );
  }

  if (stillActivated) {
    return (
      <Card eyebrow="Check-in" title="That is okay">
        <ThemedText themeColor="textSecondary">
          Some moments take more than one reset. Another round can help.
        </ThemedText>
        <PillButton
          label="Start another reset"
          variant="primary"
          onPress={() => {
            setStillActivated(false);
            clearActivation();
            router.push({ pathname: '/session/[id]', params: { id: DEFAULT_STRATEGY_ID } });
          }}
        />
        <PillButton
          label="Not right now"
          onPress={() => {
            setStillActivated(false);
            clearActivation();
          }}
        />
      </Card>
    );
  }

  return (
    <Card eyebrow="Check-in" title="How are you now?">
      <PillButton
        label="Back to steady"
        variant="primary"
        onPress={() => setRecoveredIn(Math.max(1, Math.round((Date.now() - activation.startedAt) / 60_000)))}
      />
      <PillButton label="Still activated" onPress={() => setStillActivated(true)} />
    </Card>
  );
}
