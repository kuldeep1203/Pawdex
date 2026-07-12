// One card in the home grid: photo on top, entry number + name below.
// Cards fade in one after another (staggered by their index) and
// shrink slightly while pressed.

import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import PressableScale from '@/components/PressableScale';
import type { Cat } from '@/lib/types';
import { useTheme } from '@/theme/ThemeContext';

export default function CatCard({ cat, index }: { cat: Cat; index: number }) {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <Animated.View style={styles.wrapper} entering={FadeInUp.delay(Math.min(index * 70, 500)).springify().damping(16)}>
      <PressableScale
        style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}
        onPress={() => router.push(`/cat/${cat.id}`)}
      >
        <Image source={{ uri: cat.photoUri }} style={styles.photo} />
        <View style={styles.body}>
          <Text style={[styles.number, { color: c.accent }]}>
            №{String(cat.entryNumber).padStart(3, '0')}
          </Text>
          <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
            {cat.name}
          </Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 8,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
  },
  number: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
});
