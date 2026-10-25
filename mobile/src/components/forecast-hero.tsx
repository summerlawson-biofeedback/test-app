import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { useSky } from '@/components/sky-background';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { FORECAST_COPY, type TodaySummary } from '@/forecast/forecast';

/** Today's focal element: the forecast and recovery time, sitting directly on the sky. */
export function ForecastHero({ day }: { day: TodaySummary }) {
  const sky = useSky(day.forecast);
  const copy = FORECAST_COPY[day.forecast];
  const { recoveryMinutes: today, averageRecoveryMinutes: average } = day;

  // Reinforcement only: compare with the average when today was quicker, never when slower.
  const recoveryLine =
    today === null
      ? 'Your first reset of the day will show here.'
      : today <= average
        ? `Quickest recovery today · ${average} min average last month`
        : `Quickest recovery today · every reset counts`;

  const spoken =
    `Forecast: ${copy.label}. ${copy.line} ` +
    (today === null ? recoveryLine : `Quickest recovery today: ${today} minutes. `) +
    (today !== null && today <= average ? `Your average last month was ${average} minutes.` : '');

  return (
    <View accessible accessibilityLabel={spoken} style={styles.hero}>
      <View style={styles.forecastRow}>
        <SymbolView name={copy.symbol} tintColor={sky.text} size={34} type="hierarchical" />
        <ThemedText type="headline" style={{ color: sky.text }}>
          {copy.label}
        </ThemedText>
      </View>
      <ThemedText style={{ color: sky.textSecondary }}>{copy.line}</ThemedText>

      <View style={styles.metric}>
        <ThemedText type="display" maxFontSizeMultiplier={1.6} style={{ color: sky.text }}>
          {today === null ? '–' : `${today} min`}
        </ThemedText>
        <ThemedText type="small" style={{ color: sky.textSecondary }}>
          {recoveryLine}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  metric: {
    marginTop: Spacing.four,
    gap: Spacing.one,
  },
});
