import { router } from 'expo-router';
import { useState } from 'react';

import { needsFuel, useCalm, type LastFuel } from '@/calm/calm-context';
import { DEFAULT_STRATEGY_ID, getStrategy, totalSeconds, VISIBLE_STRATEGIES } from '@/calm/strategies';
import { Card } from '@/components/card';
import { CrisisLink } from '@/components/crisis-link';
import { PillButton } from '@/components/pill-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';

const FUEL_OPTIONS: { value: LastFuel; label: string }[] = [
  { value: 'recent', label: 'Within 4 hours' },
  { value: 'while-ago', label: '4+ hours ago' },
  { value: 'not-sure', label: 'Not sure' },
];

const start = (id: string) => router.replace({ pathname: '/session/[id]', params: { id } });

export default function ActivatedScreen() {
  const { activation, startActivation } = useCalm();
  const [answered, setAnswered] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const sigh = getStrategy(DEFAULT_STRATEGY_ID)!;

  if (!answered) {
    return (
      <Screen title="Let's reset" subtitle="One quick question first." footer={<CrisisLink />}>
        <ThemedText type="subtitle" accessibilityRole="header">
          When did you last eat?
        </ThemedText>
        {FUEL_OPTIONS.map((option) => (
          <PillButton
            key={option.value}
            label={option.label}
            size="large"
            onPress={() => {
              startActivation(option.value);
              setAnswered(true);
            }}
          />
        ))}
      </Screen>
    );
  }

  return (
    <Screen title="Let's reset" subtitle="About a minute, right where you are." footer={<CrisisLink />}>
      {needsFuel(activation?.lastFuel ?? null) ? (
        <Card eyebrow="Fuel first" title="A small snack can help">
          <ThemedText themeColor="textSecondary">
            Low fuel can feel a lot like stress. If a snack is handy, have a few bites alongside
            this reset.
          </ThemedText>
        </Card>
      ) : null}

      <Card eyebrow={`${totalSeconds(sigh)} seconds`} title={sigh.name}>
        <ThemedText themeColor="textSecondary">{sigh.why}</ThemedText>
        <PillButton label="Start" variant="primary" size="large" onPress={() => start(sigh.id)} />
      </Card>

      {showAll ? (
        VISIBLE_STRATEGIES.filter((s) => s.id !== sigh.id).map((strategy) => (
          <Card key={strategy.id} eyebrow={`${totalSeconds(strategy)} seconds`} title={strategy.name}>
            <ThemedText themeColor="textSecondary">{strategy.why}</ThemedText>
            <PillButton label="Start" onPress={() => start(strategy.id)} />
          </Card>
        ))
      ) : (
        <PillButton label="Or choose another" onPress={() => setShowAll(true)} />
      )}
    </Screen>
  );
}
