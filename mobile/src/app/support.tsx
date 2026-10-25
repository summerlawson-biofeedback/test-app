import { router } from 'expo-router';
import { Alert, Linking, Platform, ScrollView, StyleSheet } from 'react-native';

import { Card } from '@/components/card';
import { PillButton } from '@/components/pill-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

// iOS and Android use different separators for a prefilled text message.
const TEXT_HOME = Platform.select({ ios: 'sms:741741&body=HOME', default: 'sms:741741?body=HOME' });

function open(url: string, fallback: string) {
  Linking.openURL(url).catch(() => Alert.alert('Could not open', fallback));
}

export default function SupportScreen() {
  return (
    <ThemedView style={styles.fill}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="subtitle" accessibilityRole="header">
          Support, right now
        </ThemedText>
        <ThemedText themeColor="textSecondary">
          Free and confidential, any time of day or night. You can reach a real person.
        </ThemedText>

        <Card eyebrow="988 Lifeline" title="Call or text 988">
          <PillButton label="Call 988" variant="primary" onPress={() => open('tel:988', 'Dial 988 from your phone.')} />
          <PillButton label="Text 988" onPress={() => open('sms:988', 'Text 988 from your phone.')} />
        </Card>

        <Card eyebrow="Crisis Text Line" title="Text HOME to 741741">
          <PillButton
            label="Text HOME to 741741"
            onPress={() => open(TEXT_HOME, 'Text HOME to 741741 from your phone.')}
          />
        </Card>

        <ThemedText type="small" themeColor="textSecondary">
          If you are in immediate danger, call 911.
        </ThemedText>
        <PillButton label="Close" onPress={() => router.back()} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
