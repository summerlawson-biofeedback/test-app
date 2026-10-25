import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { useSky } from '@/components/sky-background';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type Forecast } from '@/constants/theme';
import { FORECAST_COPY } from '@/forecast/forecast';

const OPTIONS: Forecast[] = ['clear', 'variable', 'stormy'];

/** Sample-data only: lets you flip between skies to preview the design. */
export function ForecastPreview({
  value,
  onChange,
}: {
  value: Forecast;
  onChange: (forecast: Forecast) => void;
}) {
  const sky = useSky(value);

  return (
    <View style={styles.wrap}>
      <ThemedText type="small" style={{ color: sky.textSecondary }}>
        Sample data · preview a forecast
      </ThemedText>
      <View style={styles.row} accessibilityRole="radiogroup">
        {OPTIONS.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`Preview ${FORECAST_COPY[option].label} forecast`}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                onChange(option);
              }}
              style={[
                styles.chip,
                { borderColor: sky.text },
                selected && { backgroundColor: sky.text },
              ]}>
              <ThemedText
                type="smallBold"
                style={{ color: selected ? sky.inverse : sky.text }}>
                {FORECAST_COPY[option].label}
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
