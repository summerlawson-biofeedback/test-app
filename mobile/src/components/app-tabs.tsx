import { NativeTabs } from 'expo-router/native-tabs';

import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <NativeTabs tintColor={theme.accent}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'sun.max', selected: 'sun.max.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calm">
        <NativeTabs.Trigger.Label>Calm</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'wind', selected: 'wind' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="sleep">
        <NativeTabs.Trigger.Label>Sleep</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'moon', selected: 'moon.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="fuel">
        <NativeTabs.Trigger.Label>Fuel</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'leaf', selected: 'leaf.fill' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
