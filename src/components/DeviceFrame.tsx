// The cozy-dexgadget theme wraps every screen in a toy handheld device:
// the content shows on a cream "screen" panel with an ink border and one
// big rounded corner, with decorative hardware (d-pad, pill buttons,
// speaker) underneath. For every other theme this component renders the
// content untouched — so screens can always wrap themselves in it.

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import PressableScale from '@/components/PressableScale';
import { useTheme } from '@/theme/ThemeContext';

// The camera-lens circle and little blinking light shown in the header
// when the device chrome is active.
export function DeviceLens() {
  const { theme } = useTheme();
  const { colors: c } = theme;

  // A slow blink on the small light, repeating forever.
  const blink = useSharedValue(1);
  useEffect(() => {
    blink.set(
      withRepeat(
        withSequence(withTiming(0.25, { duration: 900 }), withTiming(1, { duration: 900 })),
        -1,
      ),
    );
  }, [blink]);
  const blinkStyle = useAnimatedStyle(() => ({ opacity: blink.get() }));

  return (
    <View style={styles.lensRow}>
      <View style={[styles.lens, { backgroundColor: c.chips[2], borderColor: c.border }]} />
      <Animated.View
        style={[styles.light, { backgroundColor: c.accentSoft, borderColor: c.border }, blinkStyle]}
      />
    </View>
  );
}

export default function DeviceFrame({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { colors: c } = theme;

  if (!theme.decor.deviceChrome) return <>{children}</>;

  return (
    <View style={styles.frame}>
      <View style={[styles.screen, { backgroundColor: c.card, borderColor: c.border }]}>
        {/* A faded paw-print wallpaper behind the content. Low opacity keeps
            it subtle so it never fights the cats or text on the screen. */}
        <Image
          source={require('../../assets/images/paw-pattern.png')}
          style={styles.wallpaper}
          contentFit="cover"
          pointerEvents="none"
        />
        {children}
      </View>
      {/* Hardware row: the round black "+" pad on the left is the gadget's
          own button for logging a new cat; the pills and speaker bar are
          decorative. */}
      <View style={styles.hardware}>
        <PressableScale
          style={[styles.dpad, { backgroundColor: c.border }]}
          onPress={() => router.push('/cat/new')}
          accessibilityRole="button"
          accessibilityLabel="Add a new cat"
        >
          <View style={[styles.dpadBarH, { backgroundColor: c.background }]} />
          <View style={[styles.dpadBarV, { backgroundColor: c.background }]} />
        </PressableScale>
        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: c.chips[0], borderColor: c.border }]} />
          <View style={[styles.pill, { backgroundColor: c.chips[2], borderColor: c.border }]} />
        </View>
        <View style={[styles.speaker, { backgroundColor: c.border }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    alignSelf: 'stretch',
  },
  screen: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 4,
    borderWidth: 2,
    borderRadius: 10,
    borderBottomLeftRadius: 34, // the wireframe's one big asymmetric corner
    overflow: 'hidden',
  },
  wallpaper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15, // faded so the paws stay a subtle texture, not loud
  },
  hardware: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dpad: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadBarH: {
    position: 'absolute',
    width: 30,
    height: 10,
    borderRadius: 2,
  },
  dpadBarV: {
    position: 'absolute',
    width: 10,
    height: 30,
    borderRadius: 2,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    width: 36,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  speaker: {
    width: 56,
    height: 14,
    borderRadius: 7,
  },
  lensRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 6,
  },
  lens: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
  light: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.5,
  },
});
