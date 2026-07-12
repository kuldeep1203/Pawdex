// The color palettes for the app. Every screen reads colors from here
// (via the useTheme() hook) instead of hard-coding them, so switching
// themes instantly restyles the whole app.

import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

// Any valid Ionicons icon name ("moon", "leaf", "paw", ...).
export type IconName = ComponentProps<typeof Ionicons>['name'];

export type ThemeColors = {
  background: string; // screen background
  card: string; // cards, form fields
  text: string; // main text
  textMuted: string; // secondary/hint text
  accent: string; // buttons, active tab, highlights
  accentSoft: string; // soft chip/badge backgrounds
  onAccent: string; // text/icons sitting on top of the accent color
  danger: string; // destructive actions (delete)
  border: string; // subtle outlines
  tabBar: string; // bottom tab bar background
};

export type Theme = {
  key: ThemeKey;
  name: string;
  icon: IconName;
  isDark: boolean; // controls status bar text color
  colors: ThemeColors;
};

export type ThemeKey = 'midnightNap' | 'strawberryCocoa' | 'matchaCream';

export const themes: Record<ThemeKey, Theme> = {
  midnightNap: {
    key: 'midnightNap',
    name: 'Midnight Nap',
    icon: 'moon',
    isDark: true,
    colors: {
      background: '#151A2E',
      card: '#212842',
      text: '#EDEFF7',
      textMuted: '#9AA3C0',
      accent: '#FFD33D',
      accentSoft: '#343C5E',
      onAccent: '#151A2E',
      danger: '#FF7A8A',
      border: '#303757',
      tabBar: '#1B2138',
    },
  },
  strawberryCocoa: {
    key: 'strawberryCocoa',
    name: 'Strawberry Cocoa',
    icon: 'heart',
    isDark: false,
    colors: {
      background: '#FFF3EC',
      card: '#FFE9EF',
      text: '#5C4033',
      textMuted: '#A98D80',
      accent: '#E56B8C',
      accentSoft: '#FFD9E2',
      onAccent: '#FFFFFF',
      danger: '#D9534F',
      border: '#F3DACD',
      tabBar: '#FFECE2',
    },
  },
  matchaCream: {
    key: 'matchaCream',
    name: 'Matcha Cream',
    icon: 'leaf',
    isDark: false,
    colors: {
      background: '#F7F5EC',
      card: '#ECF1E1',
      text: '#44523D',
      textMuted: '#8A967F',
      accent: '#7BA05B',
      accentSoft: '#DFE9CE',
      onAccent: '#FFFFFF',
      danger: '#C0605E',
      border: '#DCE3CD',
      tabBar: '#F0F2E5',
    },
  },
};

export const defaultThemeKey: ThemeKey = 'strawberryCocoa';
