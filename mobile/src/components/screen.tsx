import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

type ScreenProps = {
  title: string;
  subtitle?: string;
  /** Drawn behind the scrolling content, e.g. the Today sky. */
  background?: ReactNode;
  /** Overrides for when the title sits on a coloured background. */
  titleColor?: string;
  subtitleColor?: string;
  children: ReactNode;
};

/** Scrollable page with a large title; safe-area and tab-bar insets are handled automatically. */
export function Screen({ title, subtitle, background, titleColor, subtitleColor, children }: ScreenProps) {
  return (
    <ThemedView style={styles.fill}>
      {background}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        <View style={styles.inner}>
          <ThemedText type="title" accessibilityRole="header" style={titleColor ? { color: titleColor } : undefined}>
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText
              themeColor="textSecondary"
              style={subtitleColor ? { color: subtitleColor } : undefined}>
              {subtitle}
            </ThemedText>
          ) : null}
          <View style={styles.body}>{children}</View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.two,
  },
  body: {
    marginTop: Spacing.three,
    gap: Spacing.three,
  },
});
