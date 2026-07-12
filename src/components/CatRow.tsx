// One ledger row in the field-guide dex: entry number, a small round
// portrait, the cat's name in italic serif, and where it was spotted —
// separated by dotted rules like a naturalist's index.

import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import PressableScale from '@/components/PressableScale';
import type { Cat } from '@/lib/types';
import { useTheme } from '@/theme/ThemeContext';

export default function CatRow({ cat, index }: { cat: Cat; index: number }) {
  const { theme } = useTheme();
  const { colors: c, fonts } = theme;

  return (
    <Animated.View entering={FadeInUp.delay(Math.min(index * 60, 400)).duration(350)}>
      <PressableScale
        style={[styles.row, { borderBottomColor: c.textMuted }]}
        onPress={() => router.push(`/cat/${cat.id}`)}
      >
        <View style={styles.numberBlock}>
          <Text style={[styles.numberLabel, { color: c.textMuted, fontFamily: fonts.body }]}>
            No.
          </Text>
          <Text style={[styles.number, { color: c.text, fontFamily: fonts.body }]}>
            {String(cat.entryNumber).padStart(3, '0')}
          </Text>
        </View>
        <Image source={{ uri: cat.photoUri }} style={[styles.photo, { borderColor: c.border }]} />
        <View style={styles.body}>
          <Text
            style={[styles.name, { color: c.text, fontFamily: fonts.heading }]}
            numberOfLines={1}
          >
            {cat.name}
          </Text>
          <Text
            style={[styles.subtitle, { color: c.textMuted, fontFamily: fonts.body }]}
            numberOfLines={1}
          >
            {cat.location?.label ?? 'whereabouts unknown'}
          </Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
  },
  numberBlock: {
    width: 38,
  },
  numberLabel: {
    fontSize: 11,
  },
  number: {
    fontSize: 15,
    fontWeight: '700',
  },
  photo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 1,
  },
});
