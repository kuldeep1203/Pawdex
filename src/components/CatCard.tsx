// One card in the home grid: photo on top, entry number + name below.
// Cards fade in one after another (staggered by their index) and
// shrink slightly while pressed.
//
// The theme's shape tokens decide the card's character: ink-outlined
// tilted stickers, flat field-guide plates, soft-shadowed polaroids...

import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import PressableScale from '@/components/PressableScale';
import TraitChip from '@/components/TraitChip';
import type { Cat } from '@/lib/types';
import { useTheme } from '@/theme/ThemeContext';

export default function CatCard({ cat, index }: { cat: Cat; index: number }) {
  const { theme } = useTheme();
  const { colors: c, shape, fonts } = theme;

  // Alternate tilt directions so the grid looks hand-placed, not broken.
  const tilt = shape.cardTilt ? (index % 2 === 0 ? '-1.5deg' : '1.5deg') : '0deg';

  // "Peeled sticker" corners: one corner stays nearly flat, and which one
  // it is cycles card by card (like the sticker-book wireframe).
  const flatCorner = index % 4;
  const corner = (position: number) =>
    shape.peelCorner && flatCorner === position ? 4 : shape.radiusCard;
  const cornerRadii = {
    borderTopLeftRadius: corner(0),
    borderTopRightRadius: corner(1),
    borderBottomRightRadius: corner(2),
    borderBottomLeftRadius: corner(3),
  };

  return (
    <Animated.View
      style={[styles.wrapper, { transform: [{ rotate: tilt }] }]}
      entering={FadeInUp.delay(Math.min(index * 70, 500)).springify().damping(16)}
    >
      {/* A "hard" shadow is a solid offset color block behind the card
          (like the sticker-book wireframe) — cycled through the theme's
          chip palette so neighbouring cards get different colors. */}
      {shape.shadow === 'hard' && (
        <View
          style={[
            StyleSheet.absoluteFill,
            cornerRadii,
            {
              backgroundColor: c.chips[index % c.chips.length],
              transform: [{ translateX: 3 }, { translateY: 3 }],
            },
          ]}
        />
      )}
      <PressableScale
        style={[
          styles.card,
          cornerRadii,
          {
            backgroundColor: c.card,
            borderColor: c.border,
            borderWidth: shape.borderWidth,
          },
          shape.shadow === 'soft' && styles.softShadow,
        ]}
        onPress={() => router.push(`/cat/${cat.id}`)}
      >
        <Image source={{ uri: cat.photoUri }} style={styles.photo} />
        <View style={styles.body}>
          <Text style={[styles.number, { color: c.accent }]}>
            №{String(cat.entryNumber).padStart(3, '0')}
          </Text>
          <Text
            style={[
              styles.name,
              { color: c.text, fontFamily: fonts.body },
              fonts.headingItalic && styles.italic,
            ]}
            numberOfLines={1}
          >
            {cat.name}
          </Text>
          {cat.traits.length > 0 && (
            <View style={styles.traits}>
              {/* Show at most two chips so the card stays tidy */}
              {cat.traits.slice(0, 2).map((trait, i) => (
                <TraitChip key={trait} small label={trait} color={c.chips[i % c.chips.length]} />
              ))}
            </View>
          )}
        </View>
      </PressableScale>
      {/* Scrapbook: a translucent washi-tape strip "holding" the card down */}
      {theme.decor.washiTape && (
        <View
          pointerEvents="none"
          style={[
            styles.tape,
            {
              backgroundColor: c.chips[index % c.chips.length],
              transform: [{ rotate: index % 2 === 0 ? '-4deg' : '3deg' }],
            },
          ]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 8,
  },
  card: {
    overflow: 'hidden',
  },
  softShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 3 },
    elevation: 3,
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
  traits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  tape: {
    position: 'absolute',
    top: -7,
    alignSelf: 'center',
    width: 46,
    height: 15,
    opacity: 0.6,
  },
  italic: {
    fontStyle: 'italic',
  },
});
