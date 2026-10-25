import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { CalmProvider } from '@/calm/calm-context';
import { HealthProvider } from '@/health/health-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <HealthProvider>
        <CalmProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="connect-health"
              options={{ presentation: 'modal', title: 'Connect Apple Health' }}
            />
            <Stack.Screen name="activated" options={{ presentation: 'modal', title: '' }} />
            <Stack.Screen
              name="session/[id]"
              options={{ presentation: 'fullScreenModal', headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="support"
              options={{
                presentation: 'formSheet',
                headerShown: false,
                sheetAllowedDetents: [0.75, 1],
                sheetGrabberVisible: true,
              }}
            />
          </Stack>
        </CalmProvider>
      </HealthProvider>
    </ThemeProvider>
  );
}
