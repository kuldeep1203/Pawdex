// WELCOME — the first screen you see when the app opens.
// A calm landing page: logo mark, tagline, how many cats you've
// collected, and a button into the main app.

import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import PressableScale from '@/components/PressableScale';
import { getCats } from '@/lib/storage';
import { useTheme } from '@/theme/ThemeContext';

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const [count, setCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      getCats().then((cats) => setCount(cats.length));
    }, []),
  );

  // A slow, gentle "breathing" pulse on the logo mark, repeating forever.
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.set(
      withRepeat(
        withSequence(
          withTiming(1.06, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        ),
        -1, // -1 = repeat forever
      ),
    );
  }, [pulse]);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.get() }] }));

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <View style={styles.center}>
        <Animated.View entering={FadeInDown.duration(500)} style={pulseStyle}>
          <View style={[styles.logoMark, { backgroundColor: c.accent }]}>
            <Ionicons name="paw" size={52} color={c.onAccent} />
          </View>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(120).duration(500)}
          style={[styles.title, { color: c.text }]}
        >
          PawDex
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(220).duration(500)}
          style={[styles.tagline, { color: c.textMuted }]}
        >
          Every cat you meet, remembered.
        </Animated.Text>

        {count !== null && (
          <Animated.View
            entering={FadeInDown.delay(320).duration(500)}
            style={[styles.countChip, { backgroundColor: c.accentSoft }]}
          >
            <Ionicons name="paw-outline" size={15} color={c.text} />
            <Text style={[styles.countText, { color: c.text }]}>
              {count === 0
                ? 'No cats collected yet'
                : `${count} ${count === 1 ? 'cat' : 'cats'} collected`}
            </Text>
          </Animated.View>
        )}
      </View>

      <Animated.View entering={FadeInDown.delay(420).duration(500)} style={styles.footer}>
        <PressableScale
          style={[styles.button, { backgroundColor: c.accent }]}
          onPress={() => router.replace('/dex')}
        >
          <Text style={[styles.buttonText, { color: c.onAccent }]}>Open PawDex</Text>
          <Ionicons name="arrow-forward" size={19} color={c.onAccent} />
        </PressableScale>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 28,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    width: 108,
    height: 108,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 26,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
  },
  countChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginTop: 22,
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    paddingBottom: 18,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 18,
    paddingVertical: 17,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
