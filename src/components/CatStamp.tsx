// One round "ink stamp" in the passport dex grid: a circular photo inside
// a colored stamp ring, slightly rotated, with the name underneath.

import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import PressableScale from '@/components/PressableScale';
import type { Cat } from '@/lib/types';
import { useTheme } from '@/theme/ThemeContext';

// The wireframe's stamps sit at slightly different angles — cycle a few.
const STAMP_TILTS = ['-8deg', '5deg', '-3deg', '10deg'];

export default function CatStamp({ cat, index }: { cat: Cat; index: number }) {
  const { theme } = useTheme();
  const { colors: c } = theme;

  return (
    <Animated.View
      style={styles.wrapper}
      entering={FadeInUp.delay(Math.min(index * 60, 400)).duration(350)}
    >
      <PressableScale style={styles.press} onPress={() => router.push(`/cat/${cat.id}`)}>
        <View
          style={[
            styles.ring,
            {
              borderColor: c.chips[index % c.chips.length],
              transform: [{ rotate: STAMP_TILTS[index % STAMP_TILTS.length] }],
            },
          ]}
        >
          <Image source={{ uri: cat.photoUri }} style={styles.photo} />
        </View>
        <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
          {cat.name}
        </Text>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 10,
  },
  press: {
    alignItems: 'center',
  },
  ring: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    maxWidth: 90,
    textAlign: 'center',
  },
});
