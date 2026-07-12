// React Context is how we share data (here: the current theme) with every
// screen without passing it down manually through props.
//
// - <ThemeProvider> wraps the whole app once (in the root _layout.tsx).
// - Any component can then call useTheme() to read the theme or switch it.
// - The chosen theme key is saved to AsyncStorage (the phone's tiny
//   key-value disk storage) so it survives closing the app.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { defaultThemeKey, themes, type Theme, type ThemeKey } from './themes';

const STORAGE_KEY = 'pawdex.theme';

type ThemeContextValue = {
  theme: Theme;
  setThemeKey: (key: ThemeKey) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes[defaultThemeKey],
  setThemeKey: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeKey, setThemeKeyState] = useState<ThemeKey>(defaultThemeKey);

  // On app start, load the previously saved theme (if any).
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && saved in themes) {
        setThemeKeyState(saved as ThemeKey);
      }
    });
  }, []);

  const setThemeKey = (key: ThemeKey) => {
    setThemeKeyState(key);
    AsyncStorage.setItem(STORAGE_KEY, key);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[themeKey], setThemeKey }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
