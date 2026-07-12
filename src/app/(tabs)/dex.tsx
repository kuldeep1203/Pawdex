// DEX — the main collection screen: a 2-column grid of every cat
// you've logged, plus a floating + button to add a new one.

import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import CatCard from '@/components/CatCard';
import PressableScale from '@/components/PressableScale';
import { getCats } from '@/lib/storage';
import type { Cat } from '@/lib/types';
import { useTheme } from '@/theme/ThemeContext';

export default function DexScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const [cats, setCats] = useState<Cat[]>([]);

  // useFocusEffect re-runs every time this screen becomes visible again —
  // so the grid refreshes after you add, edit, or delete a cat.
  useFocusEffect(
    useCallback(() => {
      getCats().then(setCats);
    }, []),
  );

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      {cats.length === 0 ? (
        <Animated.View entering={FadeIn.duration(400)} style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: c.accentSoft }]}>
            <Ionicons name="paw-outline" size={40} color={c.text} />
          </View>
          <Text style={[styles.emptyTitle, { color: c.text }]}>No cats spotted yet</Text>
          <Text style={[styles.emptyHint, { color: c.textMuted }]}>
            Tap the + button to log your first cat.
          </Text>
        </Animated.View>
      ) : (
        <FlatList
          data={cats}
          renderItem={({ item, index }) => <CatCard cat={item} index={index} />}
          keyExtractor={(cat) => cat.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
        />
      )}

      {/* Floating action button */}
      <PressableScale
        style={[styles.fab, { backgroundColor: c.accent }]}
        onPress={() => router.push('/cat/new')}
      >
        <Ionicons name="add" size={30} color={c.onAccent} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  grid: {
    padding: 8,
    paddingBottom: 96, // keep the last row clear of the floating button
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  emptyHint: {
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
});
