import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PillButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';
  size?: 'regular' | 'large';
  onPress?: () => void;
};

export function PillButton({ label, variant = 'secondary', size = 'regular', onPress }: PillButtonProps) {
  const theme = useTheme();
  const primary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'large' && styles.large,
        primary
          ? { backgroundColor: theme.accent }
          : { backgroundColor: theme.backgroundSelected },
        pressed && styles.pressed,
      ]}>
      <ThemedText
        type={size === 'large' ? 'subtitle' : 'smallBold'}
        style={{ color: primary ? theme.onAccent : theme.accent }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.button,
    paddingVertical: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    paddingVertical: Spacing.four,
  },
  pressed: {
    opacity: 0.7,
  },
});
