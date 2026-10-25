import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Switch, View } from 'react-native';

import { Card } from '@/components/card';
import { PillButton } from '@/components/pill-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { askForNotifications, NUDGE_TEXT, notificationsAllowed } from '@/nudges/notify';
import {
  DEFAULT_NUDGE_SETTINGS,
  FREQUENCIES,
  loadNudgeSettings,
  saveNudgeSettings,
  type NudgeFrequency,
  type NudgeSettings,
} from '@/nudges/settings';
import { STRESS_CONFIG } from '@/stress/config';

const hour = (h: number) => new Date(2000, 0, 1, h).toLocaleTimeString(undefined, { hour: 'numeric' });

export default function SettingsScreen() {
  const theme = useTheme();
  const [settings, setSettings] = useState<NudgeSettings>(DEFAULT_NUDGE_SETTINGS);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    loadNudgeSettings().then(setSettings);
    notificationsAllowed().then(setAllowed).catch(() => setAllowed(false));
  }, []);

  const update = (next: NudgeSettings) => {
    setSettings(next);
    saveNudgeSettings(next);
  };

  const toggle = async (enabled: boolean) => {
    update({ ...settings, enabled });
    if (enabled) setAllowed(await askForNotifications().catch(() => false));
  };

  return (
    <Screen title="Settings">
      <Card eyebrow="Stress nudges" title="A gentle heads-up">
        <ThemedText themeColor="textSecondary">
          When your body seems to be running hot while you are sitting still, PulsePause can
          send one quiet notification: “{NUDGE_TEXT}”
        </ThemedText>
        <View style={styles.row}>
          <ThemedText type="smallBold" style={styles.flex}>
            Nudges
          </ThemedText>
          <Switch
            accessibilityLabel="Stress nudges"
            value={settings.enabled}
            onValueChange={toggle}
            trackColor={{ true: theme.accent }}
          />
        </View>
        {settings.enabled && allowed === false ? (
          <View style={styles.notice}>
            <ThemedText type="small" themeColor="textSecondary">
              Notifications are off for PulsePause, so nudges can’t appear yet.
            </ThemedText>
            <PillButton label="Open iPhone Settings" onPress={() => Linking.openSettings()} />
          </View>
        ) : null}
      </Card>

      {settings.enabled ? (
        <Card eyebrow="How often" title="Frequency">
          <View accessibilityRole="radiogroup" style={styles.options}>
            {(Object.keys(FREQUENCIES) as NudgeFrequency[]).map((key) => {
              const selected = settings.frequency === key;
              return (
                <Pressable
                  key={key}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => update({ ...settings, frequency: key })}
                  style={[
                    styles.option,
                    { borderColor: selected ? theme.accent : theme.border },
                    selected && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  <ThemedText type="smallBold">{FREQUENCIES[key].label}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {FREQUENCIES[key].detail}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            Never overnight, between {hour(STRESS_CONFIG.quietHours.start)} and{' '}
            {hour(STRESS_CONFIG.quietHours.end)}.
          </ThemedText>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  notice: {
    gap: Spacing.two,
  },
  options: {
    gap: Spacing.two,
  },
  option: {
    borderWidth: 1.5,
    borderRadius: Radius.chip,
    padding: Spacing.three,
    gap: Spacing.half,
    minHeight: 44,
  },
});
