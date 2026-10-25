import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { Card } from '@/components/card';
import { PillButton } from '@/components/pill-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { mockHealthDataSource, type MockScenario } from '@/health/mock-source';
import { useTheme } from '@/hooks/use-theme';
import { askForNotifications } from '@/nudges/notify';
import { loadNudges, type NudgeRecord } from '@/nudges/nudge-log';
import { clearStressFlags, runStressCheck, type StressCheck } from '@/stress/check';
import { STRESS_CONFIG } from '@/stress/config';
import type { NotFlaggedReason } from '@/stress/detect';

const SCENARIOS: { id: MockScenario; label: string }[] = [
  { id: 'stress', label: 'Stress moment' },
  { id: 'calm', label: 'Calm' },
  { id: 'workout', label: 'Workout' },
  { id: 'after-workout', label: 'Just after a workout' },
];

const REASONS: Record<NotFlaggedReason, string> = {
  'quiet-hours': 'Quiet hours, so no flag.',
  paused: 'Paused by a recent context check-in answer.',
  'daily-limit': 'Already flagged the daily maximum for this frequency.',
  cooldown: 'Within the cooldown since the last flag.',
  learning: 'Baseline still learning.',
  'no-data': 'Not enough heart-rate readings.',
  'not-elevated': 'Heart rate is not meaningfully above baseline.',
  moving: 'Moving: looks like exercise, not stress.',
  'recent-exercise': 'Just finished exercising, so the raised heart rate makes sense.',
};

/** Developer-only: steer the mock body and run the full detect-and-nudge loop on demand. */
export default function DevScreen() {
  const theme = useTheme();
  const [scenario, setScenario] = useState<MockScenario>(mockHealthDataSource.scenario);
  const [ignoreQuietHours, setIgnoreQuietHours] = useState(true);
  const [result, setResult] = useState<StressCheck | null>(null);
  const [nudges, setNudges] = useState<NudgeRecord[]>([]);

  const refreshNudges = useCallback(() => {
    loadNudges().then((all) => setNudges(all.slice(-5).reverse()));
  }, []);
  useFocusEffect(refreshNudges);

  const run = async () => {
    await askForNotifications().catch(() => false);
    mockHealthDataSource.scenario = scenario;
    const check = await runStressCheck(mockHealthDataSource, {
      overrides: ignoreQuietHours ? { quietHours: { start: 0, end: 0 } } : {},
    });
    setResult(check);
    refreshNudges();
  };

  const numbers =
    result?.averageHeartRate !== undefined
      ? `${result.averageHeartRate} bpm average · baseline ${result.baseline} · line at ${result.threshold}`
      : result?.baseline
        ? `Baseline ${result.baseline} bpm`
        : null;

  return (
    <Screen title="Developer" subtitle="Simulate what the body is doing, then run the detector.">
      <Card eyebrow="Mock body" title="Scenario">
        <View style={styles.wrap}>
          {SCENARIOS.map((s) => (
            <PillButton
              key={s.id}
              label={s.label}
              variant={s.id === scenario ? 'primary' : 'secondary'}
              onPress={() => setScenario(s.id)}
            />
          ))}
        </View>
        <View style={styles.row}>
          <ThemedText style={styles.flex}>Ignore quiet hours</ThemedText>
          <Switch
            accessibilityLabel="Ignore quiet hours"
            value={ignoreQuietHours}
            onValueChange={setIgnoreQuietHours}
            trackColor={{ true: theme.accent }}
          />
        </View>
      </Card>

      <PillButton label="Run detector" variant="primary" size="large" onPress={run} />

      {result ? (
        <Card eyebrow="Result" title={result.flagged ? 'Stress moment detected' : 'No stress moment'}>
          {numbers ? <ThemedText themeColor="textSecondary">{numbers}</ThemedText> : null}
          <ThemedText themeColor="textSecondary">
            {!result.flagged
              ? REASONS[result.reason]
              : result.nudged
                ? 'Nudge sent. Tap the notification to open Calm.'
                : 'Nudges are off in Settings, so nothing was sent.'}
          </ThemedText>
        </Card>
      ) : null}

      <Card eyebrow="Nudge log" title="Last 5 nudges">
        {nudges.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            None yet.
          </ThemedText>
        ) : (
          nudges.map((n) => (
            <ThemedText key={n.id} type="small" themeColor="textSecondary">
              {new Date(n.sentAt).toLocaleTimeString()} · {n.outcome}
            </ThemedText>
          ))
        )}
        <PillButton label="Refresh" onPress={refreshNudges} />
        <PillButton
          label="Clear flag history (resets cooldown)"
          onPress={() => clearStressFlags().then(() => setResult(null))}
        />
      </Card>

      <Card eyebrow="Thresholds" title="src/stress/config.ts">
        <ThemedText type="code">{JSON.stringify(STRESS_CONFIG, null, 2)}</ThemedText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
});
