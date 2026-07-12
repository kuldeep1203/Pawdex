// Shown if the app navigates to a route that doesn't exist.

import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

export default function NotFoundScreen() {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <Ionicons name="help-circle-outline" size={56} color={c.onBackgroundMuted} />
        <Link href="/" style={[styles.button, { color: c.accentOnBackground }]}>
          Back to PawDex
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  button: {
    fontSize: 18,
    fontWeight: '700',
  },
});
