// The design system for the app. Every screen reads colors, fonts and
// shape values from here (via the useTheme() hook) instead of hard-coding
// them, so switching themes restyles the whole app instantly.
//
// The five themes are ports of the wireframes in /snapshots:
//   1a sticker book · 1b field guide · 1c scrapbook journal
//   1d cozy dexgadget · 1e cat passport
// Colors are taken directly from the wireframe HTML. Anything that could
// not be matched exactly is listed in snapshots/IMPLEMENTATION-NOTES.md.

import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';

// Any valid Ionicons icon name ("moon", "leaf", "paw", ...).
export type IconName = ComponentProps<typeof Ionicons>['name'];

export type ThemeColors = {
  background: string; // screen background (1d: the device shell, 1e: the passport cover)
  card: string; // cards, form fields (1d: the device screen, 1e: the visa page)
  text: string; // main text on cards
  textMuted: string; // secondary/hint text on cards
  onBackground: string; // main text on the content background (the device screen when chrome is on)
  onBackgroundMuted: string; // secondary text on the content background
  accentOnBackground: string; // accent that stays readable on the content background (links)
  onShell: string; // header/tab-bar text (the "shell" surface — same as onBackground unless chrome)
  onShellMuted: string; // inactive tab labels on the shell
  accentOnShell: string; // active tab tint on the shell
  accent: string; // buttons, highlights
  accentSoft: string; // soft chip/badge backgrounds
  onAccent: string; // text/icons sitting on top of the accent color
  danger: string; // destructive actions (delete)
  border: string; // card/input outlines (the "ink" line in most themes)
  tabBar: string; // bottom tab bar background
  chips: string[]; // decorative palette cycled per card (sticker shadows, stamp rings...)
};

export type ThemeFonts = {
  heading?: string; // undefined = system font
  body?: string;
  headingItalic?: boolean; // field-guide titles are italic serif
};

export type ThemeShape = {
  borderWidth: number; // 2 = bold ink outline, 1 = fine print rule
  radiusCard: number; // corner rounding for cards/photos
  radiusControl: number; // corner rounding for buttons/inputs
  cardTilt: boolean; // cards get a slight alternating hand-placed rotation
  shadow: 'hard' | 'soft' | 'none'; // hard = solid offset color block (sticker book)
  titleTilt: boolean; // screen titles get a slight handwritten rotation
  peelCorner: boolean; // one card corner stays flat, like a peeled sticker
  photoFrame: 'rect' | 'circle' | 'blob'; // shape of the empty "add photo" frame
  inputVariant: 'box' | 'underline'; // underline = field-guide ledger fields
  photoPlate: boolean; // double-framed "specimen plate" photo mount on detail
  dexLayout: 'grid' | 'ledger' | 'stamps'; // how the collection screen lists cats
};

export type ThemeDecor = {
  ruledPaper: boolean; // notebook lines behind every screen (scrapbook)
  washiTape: boolean; // little tape strip on top of each card (scrapbook)
  stampWatermark: boolean; // faint rotated REGULAR stamp on detail (passport)
  deviceChrome: boolean; // toy handheld-device shell around every screen (dexgadget)
};

export type Theme = {
  key: ThemeKey;
  name: string;
  icon: IconName;
  isDark: boolean; // controls status bar text color
  colors: ThemeColors;
  fonts: ThemeFonts;
  shape: ThemeShape;
  decor: ThemeDecor;
};

export type ThemeKey =
  | 'stickerBook'
  | 'fieldGuide'
  | 'scrapbookJournal'
  | 'cozyDexgadget'
  | 'catPassport';

// Closest built-in fonts to the wireframes' Caveat (loose handwriting),
// Patrick Hand (print handwriting) and Georgia (serif). Exact matches
// need bundled font files — see the notes file.
const handwritten = Platform.select({ ios: 'Noteworthy', android: 'casual' });
const handwrittenPrint = Platform.select({ ios: 'Marker Felt', android: 'casual' });
const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const noDecor: ThemeDecor = {
  ruledPaper: false,
  washiTape: false,
  stampWatermark: false,
  deviceChrome: false,
};

export const themes: Record<ThemeKey, Theme> = {
  stickerBook: {
    key: 'stickerBook',
    name: 'Sticker Book',
    icon: 'sparkles',
    isDark: false,
    colors: {
      background: '#FFF7F9',
      card: '#FFFFFF',
      text: '#26221E',
      textMuted: '#BB7788',
      onBackground: '#26221E',
      onBackgroundMuted: '#BB7788',
      accentOnBackground: '#F26D9E',
      onShell: '#26221E',
      onShellMuted: '#BB7788',
      accentOnShell: '#F26D9E',
      accent: '#F26D9E',
      accentSoft: '#F9C9DA',
      onAccent: '#FFFFFF',
      danger: '#D9534F',
      border: '#26221E',
      tabBar: '#FFFFFF',
      chips: ['#F9C9DA', '#CDD9F6', '#FFE08A', '#BFE6C8'],
    },
    fonts: { heading: handwritten, body: handwrittenPrint },
    shape: {
      borderWidth: 2,
      radiusCard: 16,
      radiusControl: 12,
      cardTilt: true,
      shadow: 'hard',
      titleTilt: true,
      peelCorner: true,
      photoFrame: 'blob',
      inputVariant: 'box',
      photoPlate: false,
      dexLayout: 'grid',
    },
    decor: noDecor,
  },
  fieldGuide: {
    key: 'fieldGuide',
    name: 'Field Guide',
    icon: 'book',
    isDark: false,
    colors: {
      background: '#F7F3E8',
      card: '#FFFDF6',
      text: '#26221E',
      textMuted: '#8A7F68',
      onBackground: '#26221E',
      onBackgroundMuted: '#8A7F68',
      accentOnBackground: '#3F6B4F',
      onShell: '#26221E',
      onShellMuted: '#8A7F68',
      accentOnShell: '#3F6B4F',
      accent: '#3F6B4F',
      accentSoft: '#E6E0CC',
      onAccent: '#F7F3E8',
      danger: '#A45560',
      border: '#26221E',
      tabBar: '#F7F3E8',
      chips: ['#3F6B4F'],
    },
    fonts: { heading: serif, body: serif, headingItalic: true },
    shape: {
      borderWidth: 1,
      radiusCard: 2,
      radiusControl: 2,
      cardTilt: false,
      shadow: 'none',
      titleTilt: false,
      peelCorner: false,
      photoFrame: 'rect',
      inputVariant: 'underline',
      photoPlate: true,
      dexLayout: 'ledger',
    },
    decor: noDecor,
  },
  scrapbookJournal: {
    key: 'scrapbookJournal',
    name: 'Scrapbook Journal',
    icon: 'journal',
    isDark: false,
    colors: {
      background: '#FDFAF2',
      card: '#FFFFFF',
      text: '#4A4438',
      textMuted: '#A09070',
      onBackground: '#26221E',
      onBackgroundMuted: '#A09070',
      accentOnBackground: '#D99A2B',
      onShell: '#26221E',
      onShellMuted: '#A09070',
      accentOnShell: '#D99A2B',
      accent: '#D99A2B',
      accentSoft: '#F6E6C0',
      onAccent: '#FFFFFF',
      danger: '#C0605E',
      border: '#D9CDB2',
      tabBar: '#FDFAF2',
      chips: ['#E7C588', '#B2CBB8', '#F9C9DA'],
    },
    fonts: { heading: handwritten, body: handwritten },
    shape: {
      borderWidth: 2,
      radiusCard: 4,
      radiusControl: 8,
      cardTilt: true,
      shadow: 'soft',
      titleTilt: false,
      peelCorner: false,
      photoFrame: 'rect',
      inputVariant: 'box',
      photoPlate: false,
      dexLayout: 'grid',
    },
    decor: { ruledPaper: true, washiTape: true, stampWatermark: false, deviceChrome: false },
  },
  cozyDexgadget: {
    key: 'cozyDexgadget',
    name: 'Cozy Dexgadget',
    icon: 'game-controller',
    isDark: true,
    colors: {
      background: '#E2574C',
      card: '#FDF8EE',
      text: '#26221E',
      textMuted: '#8A7F68',
      // With the device chrome on, content sits on the cream "screen",
      // so content text is ink; only the shell (header/tabs) text is white.
      onBackground: '#26221E',
      onBackgroundMuted: '#8A7F68',
      accentOnBackground: '#26221E',
      onShell: '#FFFFFF',
      onShellMuted: '#F4B6AE',
      accentOnShell: '#FFE08A',
      accent: '#26221E',
      accentSoft: '#FFE08A',
      onAccent: '#FFE08A',
      danger: '#B33A30',
      border: '#26221E',
      tabBar: '#E2574C',
      chips: ['#FFE08A', '#BFE6C8', '#BFE0F2'],
    },
    fonts: {},
    shape: {
      borderWidth: 2,
      radiusCard: 10,
      radiusControl: 8,
      cardTilt: false,
      shadow: 'none',
      titleTilt: false,
      peelCorner: false,
      photoFrame: 'rect',
      inputVariant: 'box',
      photoPlate: false,
      dexLayout: 'grid',
    },
    decor: { ruledPaper: false, washiTape: false, stampWatermark: false, deviceChrome: true },
  },
  catPassport: {
    key: 'catPassport',
    name: 'Cat Passport',
    icon: 'airplane',
    isDark: true,
    colors: {
      background: '#3D4470',
      card: '#F4F0E4',
      text: '#26221E',
      textMuted: '#8A7F68',
      onBackground: '#FFFFFF',
      onBackgroundMuted: '#9AA2CC',
      accentOnBackground: '#E8C977',
      onShell: '#FFFFFF',
      onShellMuted: '#9AA2CC',
      accentOnShell: '#E8C977',
      accent: '#5560A4',
      accentSoft: '#DFDCEC',
      onAccent: '#FFFFFF',
      danger: '#A45560',
      border: '#C9BDA2',
      tabBar: '#3D4470',
      chips: ['#5560A4', '#A45560', '#55A48A', '#C98A3D'],
    },
    fonts: {},
    shape: {
      borderWidth: 1.5,
      radiusCard: 12,
      radiusControl: 6,
      cardTilt: true,
      shadow: 'none',
      titleTilt: false,
      peelCorner: false,
      photoFrame: 'circle',
      inputVariant: 'box',
      photoPlate: false,
      dexLayout: 'stamps',
    },
    decor: { ruledPaper: false, washiTape: false, stampWatermark: true, deviceChrome: false },
  },
};

export const defaultThemeKey: ThemeKey = 'stickerBook';
