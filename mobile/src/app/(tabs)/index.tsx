import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { BodySignalsCard } from '@/components/body-signals-card';
import { Card } from '@/components/card';
import { ForecastHero } from '@/components/forecast-hero';
import { ForecastPreview } from '@/components/forecast-preview';
import { MorningLayersCard } from '@/components/morning-layers-card';
import { Screen } from '@/components/screen';
import { SkyBackground, useSky } from '@/components/sky-background';
import { ThemedText } from '@/components/themed-text';
import { WinsCard } from '@/components/wins-card';
import { SAMPLE_DAYS } from '@/forecast/forecast';
import { useMorningForecast } from '@/forecast/use-morning-forecast';
import { useHealth } from '@/health/health-context';
import { mockHealthDataSource, type MockNight } from '@/health/mock-source';

const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

// The forecast comes from last night's sleep and resting heart (mock data for now).
// Recovery time and wins are still sample values until resets feed them.
export default function TodayScreen() {
  const { source } = useHealth();
  const [night, setNight] = useState<MockNight>(mockHealthDataSource.night);
  const morning = useMorningForecast(night);
  const forecast = morning.forecast?.forecast ?? 'variable';
  const day = SAMPLE_DAYS[forecast];
  const sky = useSky(forecast);

  return (
    <Screen
      title="Today"
      subtitle={today}
      titleColor={sky.text}
      subtitleColor={sky.textSecondary}
      background={<SkyBackground forecast={forecast} />}
      // Hidden developer screen: long-press the title, development builds only.
      onTitleLongPress={__DEV__ ? () => router.push('/dev') : undefined}
      titleAccessory={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          hitSlop={8}
          onPress={() => router.push('/settings')}
          style={styles.gear}>
          <SymbolView name="gearshape" tintColor={sky.text} size={24} />
        </Pressable>
      }>
      <ForecastHero day={day} line={morning.forecast?.suggestion} />
      {source.kind === 'mock' ? (
        <ForecastPreview
          forecast={forecast}
          value={night}
          onChange={(next) => {
            mockHealthDataSource.night = next;
            setNight(next);
          }}
        />
      ) : null}

      <MorningLayersCard eyebrow="This morning" summary={morning} />

      <WinsCard eyebrow="Clearing sky" wins={day.wins} />

      <BodySignalsCard />

      <Card eyebrow="Your baseline" title="Day 0 of 14">
        <ThemedText themeColor="textSecondary">
          For the first two weeks, PulsePause learns what normal looks like for you. No stress
          alerts until then, just learning.
        </ThemedText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gear: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
