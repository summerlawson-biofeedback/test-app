import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { HeartLayer, SleepLayer } from '@/forecast/engine';
import type { MorningSummary } from '@/forecast/use-morning-forecast';

const SLEEP_WORDS: Record<SleepLayer, string> = {
  solid: 'a solid night',
  light: 'a lighter night',
  short: 'a short night',
};

const HEART_WORDS: Record<HeartLayer, string> = {
  usual: 'right around your usual',
  'a-little-higher': 'a little higher than your usual',
  higher: 'higher than your usual',
};

const hoursAndMinutes = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

/** The layers behind this morning's forecast: sleep, then resting heart. */
export function MorningLayersCard({ summary, eyebrow }: { summary: MorningSummary; eyebrow: string }) {
  const { forecast, asleepMinutes, restingToday, restingUsual } = summary;
  if (!forecast) return null;

  return (
    <Card eyebrow={eyebrow} title="Your foundation">
      <Layer
        label="Sleep"
        value={
          asleepMinutes !== null && forecast.sleep
            ? `${hoursAndMinutes(asleepMinutes)}, ${SLEEP_WORDS[forecast.sleep]}`
            : 'No sleep data last night'
        }
      />
      <Layer
        label="Resting heart"
        value={
          restingToday !== null && forecast.heart
            ? `${restingToday} bpm, ${HEART_WORDS[forecast.heart]} (${restingUsual})`
            : 'Still learning your usual'
        }
      />
    </Card>
  );
}

function Layer({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.layer} accessible accessibilityLabel={`${label}: ${value}`}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <ThemedText themeColor="textSecondary">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    gap: Spacing.half,
    paddingVertical: Spacing.one,
  },
});
