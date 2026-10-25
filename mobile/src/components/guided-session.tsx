import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { needsFuel, RECHECK_MINUTES, useCalm } from '@/calm/calm-context';
import { rated, saveReset, type RatingEntry } from '@/calm/reset-log';
import { formatDuration, type PhaseKind, type Strategy } from '@/calm/strategies';
import { useGuidedSession } from '@/calm/use-guided-session';
import { ActivationRating } from '@/components/activation-rating';
import { BreathingShape } from '@/components/breathing-shape';
import { Card } from '@/components/card';
import { PillButton } from '@/components/pill-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const TAPS: Record<PhaseKind, () => Promise<void>> = {
  in: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
  topUp: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
  out: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  prompt: () => Haptics.selectionAsync(),
};

type GuidedSessionProps = {
  strategy: Strategy;
  before: RatingEntry;
  onAgain: () => void;
};

export function GuidedSession({ strategy, before, onAgain }: GuidedSessionProps) {
  // The web wake lock activates asynchronously; closing quickly shouldn't log an error.
  useKeepAwake(undefined, { suppressDeactivateWarnings: true });
  const { haptics, activation, scheduleRecheck } = useCalm();
  const { phase, step, secondsLeft, outcome, endEarly } = useGuidedSession(strategy);
  const [after, setAfter] = useState<RatingEntry | null>(null);

  // One gentle tap as each phase begins, if haptic pacing is on.
  useEffect(() => {
    if (haptics && !outcome) TAPS[phase.kind]().catch(() => {});
  }, [haptics, phase, step, outcome]);

  // Breathing cues change every few seconds, so only prompts are read aloud.
  useEffect(() => {
    if (phase.kind === 'prompt' && !outcome) AccessibilityInfo.announceForAccessibility(phase.cue);
  }, [phase, outcome]);

  if (outcome && !after) {
    return (
      <ActivationRating
        eyebrow="And now"
        onAnswer={(rating) => {
          const entry = rated(rating);
          setAfter(entry);
          saveReset({ strategyId: strategy.id, before, after: entry, ...outcome });
        }}
      />
    );
  }

  if (outcome && after) {
    const recheckOffered = activation !== null && activation.recheckAt === null;
    // Reinforce a drop when there is one; never compare when there isn't.
    const easing = before.rating !== null && after.rating !== null && after.rating < before.rating;
    return (
      <ThemedView style={styles.fill}>
        <SafeAreaView style={styles.fill}>
          <View style={styles.done}>
            <BreathingShape phase="idle" size={160} />
            <ThemedText type="headline" accessibilityRole="header" style={styles.center}>
              {outcome.completed
                ? `You gave your body ${formatDuration(outcome.seconds)} to come back down.`
                : outcome.seconds < 15
                  ? 'Even a few breaths count.'
                  : `You gave your body ${formatDuration(outcome.seconds)}. That counts.`}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.center}>
              {easing
                ? 'Your body is already coming down. Steady is a skill, and you are building it.'
                : 'Notice how you feel now. Steady is a skill, and you are building it.'}
            </ThemedText>

            {needsFuel(activation?.lastFuel ?? null) ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
                If you have not had a chance yet, a small snack can help your body settle.
              </ThemedText>
            ) : null}

            {activation?.recheckAt ? (
              <Card eyebrow="Check-in" title={`We'll ask in ${RECHECK_MINUTES} minutes`}>
                <ThemedText themeColor="textSecondary">
                  It will be waiting on the Calm tab.
                </ThemedText>
              </Card>
            ) : recheckOffered ? (
              <PillButton label={`Check in again in ${RECHECK_MINUTES} minutes`} onPress={scheduleRecheck} />
            ) : null}

            <PillButton label="Done" variant="primary" size="large" onPress={() => router.back()} />
            <PillButton label="Another round" onPress={onAgain} />
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.fill}>
      <SafeAreaView style={styles.fill}>
        <View style={styles.running}>
          <ThemedText type="smallBold" themeColor="accent" style={styles.eyebrow}>
            {strategy.name}
          </ThemedText>
          <BreathingShape phase={phase} step={step} />
          <ThemedText
            type="headline"
            style={styles.center}
            accessibilityLiveRegion="polite">
            {phase.cue}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" accessibilityLabel={`About ${secondsLeft} seconds left`}>
            {secondsLeft}s
          </ThemedText>
        </View>
        <View style={styles.actions}>
          <PillButton label="End early" onPress={endEarly} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  running: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    padding: Spacing.four,
  },
  done: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  actions: {
    padding: Spacing.four,
    alignItems: 'center',
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  center: {
    textAlign: 'center',
  },
});
