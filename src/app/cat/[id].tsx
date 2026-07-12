// DETAIL — one cat's full PawDex entry: big photo, info rows,
// and Edit / Remove buttons. Sections fade in one after another.

import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import PressableScale from '@/components/PressableScale';
import { deleteCat, getCat } from '@/lib/storage';
import type { Cat } from '@/lib/types';
import { useTheme } from '@/theme/ThemeContext';
import type { IconName } from '@/theme/themes';

export default function CatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const c = theme.colors;
  const [cat, setCat] = useState<Cat | undefined>();

  // Refresh when returning from the edit screen.
  useFocusEffect(
    useCallback(() => {
      getCat(id).then(setCat);
    }, [id]),
  );

  if (!cat) return null;

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
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={styles.container}>
      {/* Sets the header title for this screen */}
      <Stack.Screen options={{ title: cat.name }} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.photoWrap}>
        <Image source={{ uri: cat.photoUri }} style={[styles.photo, { borderColor: c.border }]} />
        <View style={[styles.numberBadge, { backgroundColor: c.accent }]}>
          <Text style={[styles.numberText, { color: c.onAccent }]}>
            №{String(cat.entryNumber).padStart(3, '0')}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(120).duration(400)}
        style={[styles.sheet, { backgroundColor: c.card, borderColor: c.border }]}
      >
        <InfoRow icon="restaurant-outline" label="Favorite food" value={cat.food} />
        <InfoRow icon="happy-outline" label="What it does" value={cat.antics} />
        <InfoRow icon="book-outline" label="About" value={cat.about} />
        <InfoRow icon="location-outline" label="Spotted at" value={cat.location?.label ?? ''} last />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(240).duration(400)} style={styles.buttonRow}>
        <PressableScale
          style={[styles.button, { backgroundColor: c.accentSoft }]}
          onPress={() => router.push(`/cat/edit/${cat.id}`)}
        >
          <Ionicons name="pencil-outline" size={18} color={c.text} />
          <Text style={[styles.buttonText, { color: c.text }]}>Edit</Text>
        </PressableScale>
        <PressableScale
          style={[styles.button, { backgroundColor: c.accentSoft }]}
          onPress={confirmDelete}
        >
          <Ionicons name="trash-outline" size={18} color={c.danger} />
          <Text style={[styles.buttonText, { color: c.danger }]}>Remove</Text>
        </PressableScale>
      </Animated.View>
    </ScrollView>
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
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  photoWrap: {
    alignSelf: 'center',
  },
  photo: {
    width: 240,
    height: 240,
    borderRadius: 28,
    borderWidth: 1,
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
  sheet: {
    marginTop: 30,
    borderRadius: 20,
    borderWidth: 1,
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
    borderRadius: 18,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
