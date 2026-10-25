import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { HealthProvider } from '@/health/health-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <HealthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="connect-health"
            options={{ presentation: 'modal', title: 'Connect Apple Health' }}
          />
        </Stack>
      </HealthProvider>
    </ThemeProvider>
  );
}
