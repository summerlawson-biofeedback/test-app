import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Rating } from '@/calm/reset-log';
import { PillButton } from '@/components/pill-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const RATINGS: Rating[] = [1, 2, 3, 4, 5];

/**
 * "How activated do you feel?" on a 1-5 scale. Every option is the same calm colour:
 * this is a check-in, not a grade.
 */
export function ActivationRating({
  eyebrow,
  onAnswer,
  onCancel,
}: {
  eyebrow: string;
  onAnswer: (rating: Rating | null) => void;
  /** Shown as "Not now" when the person may leave instead of answering. */
  onCancel?: () => void;
}) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.fill}>
      <SafeAreaView style={styles.fill}>
        <View style={styles.content}>
          <ThemedText type="smallBold" themeColor="accent" style={styles.eyebrow}>
            {eyebrow}
          </ThemedText>
          <ThemedText type="headline" accessibilityRole="header" style={styles.center}>
            How activated do you feel?
          </ThemedText>

          <View style={styles.row} accessibilityRole="radiogroup">
            {RATINGS.map((rating) => (
              <Pressable
                key={rating}
                accessibilityRole="radio"
                accessibilityLabel={
                  rating === 1 ? '1, steady' : rating === 5 ? '5, very activated' : String(rating)
                }
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  onAnswer(rating);
                }}
                style={({ pressed }) => [
                  styles.dot,
                  { backgroundColor: theme.backgroundSelected, borderColor: theme.accent },
                  pressed && { backgroundColor: theme.accent },
                ]}>
                <ThemedText type="subtitle" themeColor="accent">
                  {rating}
                </ThemedText>
              </Pressable>
            ))}
          </View>
          <View style={styles.ends} importantForAccessibility="no-hide-descendants">
            <ThemedText type="small" themeColor="textSecondary">
              Steady
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Very activated
            </ThemedText>
          </View>
        </View>
        <View style={styles.actions}>
          <PillButton label="Skip" onPress={() => onAnswer(null)} />
          {onCancel ? <PillButton label="Not now" onPress={onCancel} /> : null}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.four,
    padding: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  center: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  dot: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 64,
    minHeight: 48,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ends: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -Spacing.three,
  },
  actions: {
    padding: Spacing.four,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.three,
  },
});
