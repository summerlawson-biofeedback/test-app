import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { PillButton } from '@/components/pill-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useHealth } from '@/health/health-context';
import { SIGNALS } from '@/health/signals';

const openConnect = () => router.push('/connect-health');

export function BodySignalsCard() {
  const { status, source, signals, readings } = useHealth();

  if (status !== 'connected') {
    return (
      <Card eyebrow="Body signals" title="Connect Apple Health">
        <ThemedText themeColor="textSecondary">
          {status === 'skipped'
            ? 'Whenever you are ready. PulsePause still works without it.'
            : 'Let PulsePause learn your heart rate, recovery and sleep so it can spot your patterns.'}
        </ThemedText>
        <PillButton label={status === 'skipped' ? 'Connect now' : 'Get started'} onPress={openConnect} />
      </Card>
    );
  }

  return (
    <Card
      eyebrow={source.kind === 'sample' ? 'Body signals · sample data' : 'Body signals'}
      title="Connected">
      {SIGNALS.filter((s) => signals.includes(s.id)).map((signal) => {
        const reading = readings[signal.id];
        return (
          <View key={signal.id} style={styles.row}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
              {signal.label}
            </ThemedText>
            <ThemedText type="smallBold">
              {reading ? `${reading.value}${reading.unit ? ` ${reading.unit}` : ''}` : 'No data yet'}
            </ThemedText>
          </View>
        );
      })}
      <PillButton label="Manage" onPress={openConnect} />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  label: {
    flex: 1,
  },
});
