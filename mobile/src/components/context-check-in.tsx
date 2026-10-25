import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { PillButton } from '@/components/pill-button';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useHealth } from '@/health/health-context';
import { useTheme } from '@/hooks/use-theme';
import { CONTEXT_OPTIONS, recordContext, type ContextAnswer } from '@/nudges/context';
import { STRESS_CONFIG } from '@/stress/config';

const MINUTE = 60_000;

/**
 * "What's going on right now?" after a nudge. One tap saves. "I'm moving" is
 * pre-selected when recent steps show activity. All answers look the same.
 */
export function ContextCheckIn({ nudgeId, onDone }: { nudgeId?: string; onDone: () => void }) {
  const theme = useTheme();
  const { source } = useHealth();
  const [suggested, setSuggested] = useState<ContextAnswer | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const now = new Date();
    source
      .getSteps(new Date(now.getTime() - STRESS_CONFIG.windowMinutes * MINUTE), now)
      .then((steps) => {
        const total = steps.reduce((sum, s) => sum + s.value, 0);
        if (total > STRESS_CONFIG.maxStepsInWindow) setSuggested('moving');
      })
      .catch(() => {});
  }, [source]);

  const answer = async (id: ContextAnswer) => {
    await recordContext({ answer: id, suggestedMoving: suggested === 'moving', from: 'app', nudgeId });
    setSaved(true);
  };

  if (saved) {
    return (
      <Card eyebrow="Check-in" title="Thanks, noted">
        <ThemedText themeColor="textSecondary">This helps PulsePause learn your patterns.</ThemedText>
        <PillButton label="Done" onPress={onDone} />
      </Card>
    );
  }

  return (
    <Card eyebrow="Quick check-in" title="What's going on right now?">
      <View style={styles.options} accessibilityRole="radiogroup">
        {CONTEXT_OPTIONS.map((option) => {
          const selected = option.id === suggested;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityHint={selected ? 'Suggested from your recent steps' : undefined}
              onPress={() => answer(option.id)}
              style={({ pressed }) => [
                styles.option,
                { borderColor: selected ? theme.accent : theme.border },
                selected && { backgroundColor: theme.backgroundSelected },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold">{option.label}</ThemedText>
            </Pressable>
          );
        })}
      </View>
      {suggested === 'moving' ? (
        <ThemedText type="small" themeColor="textSecondary">
          Your recent steps suggest you&apos;re moving. Tap to confirm, or pick another.
        </ThemedText>
      ) : null}
      <PillButton label="Skip" onPress={onDone} />
    </Card>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: Spacing.two,
  },
  option: {
    borderWidth: 1.5,
    borderRadius: Radius.chip,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    minHeight: 44,
  },
  pressed: {
    opacity: 0.7,
  },
});
