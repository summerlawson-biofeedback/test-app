import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { Card } from '@/components/card';
import { PillButton } from '@/components/pill-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useHealth } from '@/health/health-context';
import { DEFAULT_SIGNALS, SIGNALS, type SignalId } from '@/health/signals';
import { useTheme } from '@/hooks/use-theme';

export default function ConnectHealthScreen() {
  const theme = useTheme();
  const { source, connect, skip } = useHealth();
  const [chosen, setChosen] = useState<SignalId[]>(DEFAULT_SIGNALS);
  const [busy, setBusy] = useState(false);

  const toggle = (id: SignalId, on: boolean) =>
    setChosen((prev) => (on ? [...prev, id] : prev.filter((s) => s !== id)));

  const onConnect = async () => {
    setBusy(true);
    try {
      await connect(chosen);
      router.back();
    } finally {
      setBusy(false);
    }
  };

  const onSkip = () => {
    skip();
    router.back();
  };

  return (
    <Screen
      title="Your body's signals"
      subtitle="PulsePause reads these from Apple Health to learn your personal baseline.">
      <Card eyebrow="What we read" title="And why">
        {SIGNALS.map((signal) => (
          <View key={signal.id} style={styles.row}>
            <View style={styles.rowText}>
              <ThemedText type="smallBold">{signal.label}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {signal.why}
              </ThemedText>
            </View>
            {signal.optional ? (
              <Switch
                accessibilityLabel={`Include ${signal.label}`}
                value={chosen.includes(signal.id)}
                onValueChange={(on) => toggle(signal.id, on)}
                trackColor={{ true: theme.accent }}
              />
            ) : null}
          </View>
        ))}
      </Card>

      <Card eyebrow="Your data" title="Stays yours">
        <ThemedText themeColor="textSecondary">
          Read-only, kept on your phone where possible, never sold and never used for ads. You
          can change access anytime in the Health app.
        </ThemedText>
      </Card>

      {source.kind === 'sample' ? (
        <ThemedText type="small" themeColor="textSecondary">
          Preview build: this shows sample data. Real Apple Health readings arrive with the
          installed PulsePause app.
        </ThemedText>
      ) : null}

      <PillButton
        label={busy ? 'Connecting…' : 'Connect Apple Health'}
        variant="primary"
        size="large"
        onPress={busy ? undefined : onConnect}
      />
      <PillButton label="Not now" onPress={onSkip} />
      <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
        Calm strategies and the &quot;I&apos;m activated&quot; button work without a wearable.
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  rowText: {
    flex: 1,
    gap: Spacing.half,
  },
  center: {
    textAlign: 'center',
  },
});
