import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Switch, View } from 'react-native';

import { useCalm } from '@/calm/calm-context';
import { totalSeconds, VISIBLE_STRATEGIES } from '@/calm/strategies';
import { BreathingShape } from '@/components/breathing-shape';
import { Card } from '@/components/card';
import { ContextCheckIn } from '@/components/context-check-in';
import { CrisisLink } from '@/components/crisis-link';
import { PillButton } from '@/components/pill-button';
import { RecheckCard } from '@/components/recheck-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function CalmScreen() {
  const theme = useTheme();
  const { haptics, setHaptics } = useCalm();
  // Set when Calm was opened from a nudge.
  const { checkin } = useLocalSearchParams<{ checkin?: string }>();

  return (
    <Screen title="Calm" subtitle="Short, guided ways back to steady." footer={<CrisisLink />}>
      {checkin ? (
        <ContextCheckIn
          key={checkin}
          nudgeId={checkin}
          onDone={() => router.setParams({ checkin: undefined })}
        />
      ) : null}

      <BreathingShape phase="idle" size={200} />

      <PillButton
        label="I'm activated"
        variant="primary"
        size="large"
        onPress={() => router.push('/activated')}
      />
      <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
        Works anytime, no wearable needed.
      </ThemedText>

      <RecheckCard />

      {VISIBLE_STRATEGIES.map((strategy) => (
        <Card key={strategy.id} eyebrow={`${totalSeconds(strategy)} seconds`} title={strategy.name}>
          <ThemedText themeColor="textSecondary">{strategy.why}</ThemedText>
          <PillButton
            label="Start"
            onPress={() => router.push({ pathname: '/session/[id]', params: { id: strategy.id } })}
          />
        </Card>
      ))}

      <View style={[styles.setting, { borderColor: theme.border }]}>
        <View style={styles.settingText}>
          <ThemedText type="smallBold">Haptic pacing</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            A gentle tap as each breath begins.
          </ThemedText>
        </View>
        <Switch
          accessibilityLabel="Haptic pacing"
          value={haptics}
          onValueChange={setHaptics}
          trackColor={{ true: theme.accent }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  settingText: {
    flex: 1,
    gap: Spacing.half,
  },
});
