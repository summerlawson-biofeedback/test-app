import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';

// Placeholder content. The forecast, baseline progress and wins will come from real data later.
export default function TodayScreen() {
  return (
    <Screen title="Today" subtitle="Building your foundation, one day at a time.">
      <Card eyebrow="Inner weather" title="Mostly calm, light breeze">
        <ThemedText themeColor="textSecondary">
          Your daily forecast will appear here once PulsePause knows your rhythms.
        </ThemedText>
      </Card>

      <Card eyebrow="Your baseline" title="Day 0 of 14">
        <ThemedText themeColor="textSecondary">
          For the first two weeks, PulsePause learns what normal looks like for you. No stress
          alerts until then, just learning.
        </ThemedText>
      </Card>

      <Card eyebrow="This evening" title="Today's wins">
        <ThemedText themeColor="textSecondary">
          Things that went right will collect here: a steady breath, a good meal, a consistent
          wake time.
        </ThemedText>
      </Card>
    </Screen>
  );
}
