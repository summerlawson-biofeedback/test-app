import { Card } from '@/components/card';
import { PillButton } from '@/components/pill-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';

const STRATEGIES = [
  {
    name: 'Physiological sigh',
    duration: '1 min',
    description: 'Two inhales through the nose, one long exhale through the mouth.',
  },
  {
    name: 'Extended exhale',
    duration: '3 min',
    description: 'Breathe out for longer than you breathe in to slow things down.',
  },
  {
    name: 'Grounding',
    duration: '2 min',
    description: 'Notice five things you can see, four you can touch, three you can hear.',
  },
];

// Placeholder: the button and strategies don't start guided sessions yet.
export default function CalmScreen() {
  return (
    <Screen title="Calm" subtitle="Short, guided ways to come back to steady.">
      <PillButton label="I'm activated" variant="primary" size="large" />
      <ThemedText type="small" themeColor="textSecondary">
        Works anytime, no wearable needed.
      </ThemedText>

      {STRATEGIES.map((strategy) => (
        <Card key={strategy.name} eyebrow={strategy.duration} title={strategy.name}>
          <ThemedText themeColor="textSecondary">{strategy.description}</ThemedText>
        </Card>
      ))}
    </Screen>
  );
}
