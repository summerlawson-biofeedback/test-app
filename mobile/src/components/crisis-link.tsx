import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export function CrisisLink() {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityHint="Shows 988 and Crisis Text Line"
      onPress={() => router.push('/support')}
      style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
      <ThemedText type="smallBold" themeColor="accent" style={styles.text}>
        Need more support right now?
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
