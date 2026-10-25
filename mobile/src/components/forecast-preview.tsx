import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { useSky } from '@/components/sky-background';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type Forecast } from '@/constants/theme';
import type { MockNight } from '@/health/mock-source';

const NIGHTS: { id: MockNight; label: string }[] = [
  { id: 'rested', label: 'Rested' },
  { id: 'light', label: 'Light night' },
  { id: 'short', label: 'Short night' },
];

/** Sample-data only: pick last night to preview how the forecast responds. */
export function ForecastPreview({
  forecast,
  value,
  onChange,
}: {
  forecast: Forecast;
  value: MockNight;
  onChange: (night: MockNight) => void;
}) {
  const sky = useSky(forecast);

  return (
    <View style={styles.wrap}>
      <ThemedText type="small" style={{ color: sky.textSecondary }}>
        Sample data · preview last night
      </ThemedText>
      <View style={styles.row} accessibilityRole="radiogroup">
        {NIGHTS.map((night) => {
          const selected = night.id === value;
          return (
            <Pressable
              key={night.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`Preview a ${night.label.toLowerCase()}`}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                onChange(night.id);
              }}
              style={[styles.chip, { borderColor: sky.text }, selected && { backgroundColor: sky.text }]}>
              <ThemedText type="smallBold" style={{ color: selected ? sky.inverse : sky.text }}>
                {night.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    borderRadius: Radius.chip,
    borderWidth: 1.5,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    minHeight: 44,
    justifyContent: 'center',
  },
});
