import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { PillButton } from '@/components/pill-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

// Placeholder: buttons don't log anything yet. Calorie tracking will be opt-in only.
export default function FuelScreen() {
  return (
    <Screen title="Fuel" subtitle="A steady body starts with steady fuel.">
      <Card eyebrow="Check in" title="Have you eaten?">
        <View style={styles.row}>
          <PillButton label="Breakfast" />
          <PillButton label="AM snack" />
          <PillButton label="Lunch" />
          <PillButton label="PM snack" />
          <PillButton label="Dinner" />
        </View>
      </Card>

      <Card eyebrow="Hydration" title="Had some water?">
        <View style={styles.row}>
          <PillButton label="Glass of water" />
        </View>
      </Card>

      <ThemedText type="small" themeColor="textSecondary">
        Just a tap, no numbers to track.
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
