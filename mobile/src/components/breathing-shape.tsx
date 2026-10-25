import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { Phase } from '@/calm/strategies';
import { useTheme } from '@/hooks/use-theme';

const SIZES = { in: 0.86, topUp: 1, out: 0.55, rest: 0.72 } as const;
const ease = Easing.inOut(Easing.quad);

/**
 * The breathing shape: grows on in-breaths, shrinks on out-breaths, and drifts slowly
 * during prompts or while idle. Holds still when Reduce Motion is on; cues carry the pace.
 */
export function BreathingShape({ phase, step = 0, size = 260 }: { phase: Phase | 'idle'; step?: number; size?: number }) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue<number>(SIZES.rest);
  const drifting = useRef(false);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(scale);
      drifting.current = false;
      scale.set(SIZES.rest);
      return;
    }
    if (phase === 'idle' || phase.kind === 'prompt') {
      // Keep one continuous slow drift across consecutive prompts.
      if (drifting.current) return;
      drifting.current = true;
      scale.set(
        withRepeat(
          withSequence(
            withTiming(SIZES.in, { duration: 5000, easing: ease }),
            withTiming(SIZES.out + 0.05, { duration: 5000, easing: ease })
          ),
          -1
        )
      );
      return;
    }
    drifting.current = false;
    scale.set(withTiming(SIZES[phase.kind], { duration: phase.seconds * 1000, easing: ease }));
  }, [phase, step, reduceMotion, scale]);

  const halo = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
    opacity: 0.1 + 0.2 * scale.get(),
  }));
  const core = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() * 0.78 }] }));

  return (
    <View
      style={[styles.frame, { width: size, height: size }]}
      accessible={false}
      importantForAccessibility="no-hide-descendants">
      <Animated.View
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.sage }, halo]}
      />
      <Animated.View
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.sage }, core]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  circle: {
    position: 'absolute',
  },
});
