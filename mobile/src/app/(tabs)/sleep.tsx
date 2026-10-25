import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';

// Placeholder content. Sleep data and the streak will come from Apple Health later.
export default function SleepScreen() {
  return (
    <Screen title="Sleep" subtitle="Rest is part of your foundation.">
      <Card eyebrow="Last night" title="Your sleep story">
        <ThemedText themeColor="textSecondary">
          A gentle summary of last night's rest will appear here.
        </ThemedText>
      </Card>

      <Card eyebrow="Wake-time streak" title="Starting fresh">
        <ThemedText themeColor="textSecondary">
          Waking up around the same time helps steady your nervous system. Each consistent morning
          adds to your streak.
        </ThemedText>
      </Card>
    </Screen>
  );
}
