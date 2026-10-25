import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { Skies, type Forecast } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** The "inner weather" sky behind the top of the Today screen, fading into the page. */
export function SkyBackground({ forecast }: { forecast: Forecast }) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  return (
    <LinearGradient
      colors={Skies[scheme][forecast].colors}
      locations={[0, 0.62, 1]}
      style={styles.sky}
    />
  );
}

export function useSky(forecast: Forecast) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return Skies[scheme][forecast];
}

const styles = StyleSheet.create({
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 780,
    pointerEvents: 'none',
  },
});
