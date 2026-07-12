// Layout for the bottom tab bar: Dex (collection) and Settings.

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { DeviceLens } from '@/components/DeviceFrame';
import HeaderTitle from '@/components/HeaderTitle';
import { useTheme } from '@/theme/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.accentOnShell,
        tabBarInactiveTintColor: c.onShellMuted,
        tabBarStyle: { backgroundColor: c.tabBar, borderTopColor: c.border },
        tabBarLabelStyle: { fontWeight: '700' },
        headerStyle: { backgroundColor: c.background },
        headerShadowVisible: false,
        headerTintColor: c.onShell,
        headerTitle: ({ children }) => <HeaderTitle text={children} />,
        // The dexgadget theme shows its camera lens + blinking light here.
        headerLeft: theme.decor.deviceChrome ? () => <DeviceLens /> : undefined,
        headerTitleAlign: 'left',
        sceneStyle: { backgroundColor: c.background },
      }}
    >
      <Tabs.Screen
        name="dex"
        options={{
          title: 'PawDex',
          tabBarLabel: 'Dex',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'paw' : 'paw-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Themes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'color-palette' : 'color-palette-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
