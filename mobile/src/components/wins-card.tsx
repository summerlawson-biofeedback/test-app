import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Wins as quiet "clearing sky" moments: a soft glyph and a sentence, no badges or counts. */
export function WinsCard({ wins, eyebrow }: { wins: string[]; eyebrow: string }) {
  const theme = useTheme();

  return (
    <Card eyebrow={eyebrow} title="What went right">
      {wins.length === 0 ? (
        <ThemedText themeColor="textSecondary">
          Moments that went right will gather here as the day goes on.
        </ThemedText>
      ) : (
        wins.map((win) => (
          <View key={win} style={styles.row} accessible accessibilityLabel={win}>
            <View style={[styles.glyph, { backgroundColor: theme.sandSoft }]}>
              <SymbolView name="sun.haze.fill" tintColor={theme.sand} size={18} />
            </View>
            <ThemedText style={styles.text}>{win}</ThemedText>
          </View>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  glyph: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
});
