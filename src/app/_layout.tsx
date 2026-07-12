// Root layout — the top of the app. Everything is wrapped in ThemeProvider
// so every screen can call useTheme(). The Stack navigator handles the
// welcome screen, the tabs, and the screens that sit "on top of" the tabs.

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from '@/theme/ThemeContext';

// This inner component exists because useTheme() only works *inside*
// the ThemeProvider — so the provider must wrap it.
function RootStack() {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <>
      {/* Status bar = the phone's clock/battery strip. Light text on dark theme. */}
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.background },
          headerShadowVisible: false,
          headerTintColor: c.text,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: c.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="cat/new" options={{ title: 'New Cat', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="cat/[id]" options={{ title: '' }} />
        <Stack.Screen name="cat/edit/[id]" options={{ title: 'Edit Cat' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}
