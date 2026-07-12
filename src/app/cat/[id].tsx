// DETAIL — one cat's full PawDex entry: big photo, info rows,
// and Edit / Remove buttons. Sections fade in one after another.

import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import DeviceFrame from '@/components/DeviceFrame';
import PressableScale from '@/components/PressableScale';
import RuledPaper from '@/components/RuledPaper';
import TraitChip from '@/components/TraitChip';
import { deleteCat, getCat, getCats } from '@/lib/storage';
import type { Cat } from '@/lib/types';
import { useTheme } from '@/theme/ThemeContext';
import type { IconName } from '@/theme/themes';
import { toRoman } from '@/utils/roman-numerals';

export default function CatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { colors: c, shape } = theme;
  const [cat, setCat] = useState<Cat | undefined>();
  const [cats, setCats] = useState<Cat[]>([]);

  // Refresh when returning from the edit screen. The full list is only
  // needed for the dexgadget's previous/next entry pager.
  useFocusEffect(
    useCallback(() => {
      getCat(id).then(setCat);
      getCats().then(setCats);
    }, [id]),
  );

  if (!cat) return null;

  // Where this cat sits in the collection, for the ◂ ▸ pager.
  const position = cats.findIndex((entry) => entry.id === cat.id);
  const hasPrevious = position > 0;
  const hasNext = position !== -1 && position < cats.length - 1;

  const confirmDelete = () => {
    Alert.alert('Remove this cat?', `${cat.name} will be removed from your PawDex.`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await deleteCat(cat.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
    {theme.decor.ruledPaper && <RuledPaper />}
    <DeviceFrame>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Sets the header title for this screen */}
      <Stack.Screen options={{ title: cat.name }} />

      {/* Dexgadget: "one big entry at a time" pager with ◂ ▸ arrows */}
      {theme.decor.deviceChrome && (
        <View style={styles.pager}>
          <Text style={[styles.pagerText, { color: c.textMuted }]}>
            ENTRY {String(cat.entryNumber).padStart(3, '0')} /{' '}
            {String(Math.max(cats.length, 1)).padStart(3, '0')}
          </Text>
          <View style={styles.pagerButtons}>
            <PressableScale
              disabled={!hasPrevious}
              onPress={() => router.replace(`/cat/${cats[position - 1].id}`)}
            >
              <Ionicons name="caret-back" size={24} color={hasPrevious ? c.text : c.border} />
            </PressableScale>
            <PressableScale
              disabled={!hasNext}
              onPress={() => router.replace(`/cat/${cats[position + 1].id}`)}
            >
              <Ionicons name="caret-forward" size={24} color={hasNext ? c.text : c.border} />
            </PressableScale>
          </View>
        </View>
      )}

      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[
          styles.photoWrap,
          // Tilted themes (sticker book, scrapbook, passport) tip the big photo too.
          shape.cardTilt && { transform: [{ rotate: '-1.5deg' }] },
        ]}
      >
        {shape.photoPlate ? (
          // Field guide: the photo sits in a double-framed "specimen
          // plate" with a numbered caption, like a vintage encyclopedia.
          <View style={[styles.plate, { borderColor: c.border, backgroundColor: c.card }]}>
            <View style={[styles.plateInner, { borderColor: c.border }]}>
              <Image source={{ uri: cat.photoUri }} style={styles.platePhoto} />
            </View>
            <Text style={[styles.plateCaption, { color: c.textMuted, fontFamily: theme.fonts.body }]}>
              PLATE {toRoman(cat.entryNumber)} · No. {String(cat.entryNumber).padStart(3, '0')}
            </Text>
          </View>
        ) : (
          <>
            <Image
              source={{ uri: cat.photoUri }}
              style={[
                styles.photo,
                {
                  borderColor: c.border,
                  borderWidth: shape.borderWidth,
                  borderRadius: Math.max(shape.radiusCard, 2),
                },
              ]}
            />
            <View style={[styles.numberBadge, { backgroundColor: c.accent }]}>
              <Text style={[styles.numberText, { color: c.onAccent }]}>
                №{String(cat.entryNumber).padStart(3, '0')}
              </Text>
            </View>
          </>
        )}
      </Animated.View>

      {cat.traits.length > 0 && (
        <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.traits}>
          {cat.traits.map((trait, i) => (
            <TraitChip key={trait} label={trait} color={c.chips[i % c.chips.length]} />
          ))}
        </Animated.View>
      )}

      <Animated.View
        entering={FadeInDown.delay(120).duration(400)}
        style={[
          styles.sheet,
          {
            backgroundColor: c.card,
            borderColor: c.border,
            borderWidth: shape.borderWidth,
            borderRadius: shape.radiusCard,
          },
        ]}
      >
        <InfoRow icon="restaurant-outline" label="Favorite food" value={cat.food} />
        <InfoRow icon="happy-outline" label="What it does" value={cat.antics} />
        <InfoRow icon="book-outline" label="About" value={cat.about} />
        <InfoRow icon="location-outline" label="Spotted at" value={cat.location?.label ?? ''} last />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(240).duration(400)} style={styles.buttonRow}>
        <PressableScale
          style={[styles.button, { backgroundColor: c.accentSoft, borderRadius: shape.radiusControl }]}
          onPress={() => router.push(`/cat/edit/${cat.id}`)}
        >
          <Ionicons name="pencil-outline" size={18} color={c.text} />
          <Text style={[styles.buttonText, { color: c.text }]}>Edit</Text>
        </PressableScale>
        <PressableScale
          style={[styles.button, { backgroundColor: c.accentSoft, borderRadius: shape.radiusControl }]}
          onPress={confirmDelete}
        >
          <Ionicons name="trash-outline" size={18} color={c.danger} />
          <Text style={[styles.buttonText, { color: c.danger }]}>Remove</Text>
        </PressableScale>
      </Animated.View>

      {/* Passport: the faint rotated rubber stamp in the page corner */}
      {theme.decor.stampWatermark && (
        <View pointerEvents="none" style={[styles.watermark, { borderColor: c.danger }]}>
          <Text style={[styles.watermarkText, { color: c.danger }]}>REGULAR</Text>
        </View>
      )}
    </ScrollView>
    </DeviceFrame>
    </View>
  );
}

// A small helper component for one labeled row of the entry.
function InfoRow({
  icon,
  label,
  value,
  last,
}: {
  icon: IconName;
  label: string;
  value: string;
  last?: boolean;
}) {
  const { theme } = useTheme();
  const c = theme.colors;
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: c.border }]}>
      <View style={styles.rowHeader}>
        <Ionicons name={icon} size={15} color={c.textMuted} />
        <Text style={[styles.rowLabel, { color: c.textMuted }]}>{label.toUpperCase()}</Text>
      </View>
      <Text style={[styles.rowValue, { color: c.text }]}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  pager: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pagerText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  pagerButtons: {
    flexDirection: 'row',
    gap: 18,
  },
  plate: {
    borderWidth: 1.5,
    padding: 8,
  },
  plateInner: {
    borderWidth: 1,
    padding: 4,
  },
  platePhoto: {
    width: 220,
    height: 220,
  },
  plateCaption: {
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 7,
  },
  watermark: {
    position: 'absolute',
    right: 2,
    bottom: 26,
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
    transform: [{ rotate: '-14deg' }],
  },
  watermarkText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  photoWrap: {
    alignSelf: 'center',
  },
  photo: {
    width: 240,
    height: 240,
  },
  numberBadge: {
    position: 'absolute',
    bottom: -12,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  numberText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  traits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginTop: 26, // clears the number badge hanging below the photo
  },
  sheet: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  row: {
    paddingVertical: 14,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  rowLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rowValue: {
    fontSize: 16,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
