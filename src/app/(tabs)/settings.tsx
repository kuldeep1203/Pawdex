// SETTINGS — pick one of the three themes. Each option shows little
// color swatches so you can preview it before tapping.

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import PressableScale from '@/components/PressableScale';
import { useTheme } from '@/theme/ThemeContext';
import { themes } from '@/theme/themes';

export default function SettingsScreen() {
  const { theme, setThemeKey } = useTheme();
  const c = theme.colors;

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <Text style={[styles.heading, { color: c.textMuted }]}>THEME</Text>

      {Object.values(themes).map((option, index) => {
        const selected = option.key === theme.key;
        return (
          <Animated.View key={option.key} entering={FadeInDown.delay(index * 80).duration(400)}>
            <PressableScale
              style={[
                styles.option,
                {
                  backgroundColor: c.card,
                  borderColor: selected ? c.accent : c.border,
                  borderWidth: selected ? 2 : 1,
                },
              ]}
              onPress={() => setThemeKey(option.key)}
            >
              <View style={[styles.optionIcon, { backgroundColor: option.colors.accentSoft }]}>
                <Ionicons name={option.icon} size={22} color={option.colors.accent} />
              </View>
              <View style={styles.optionBody}>
                <Text style={[styles.optionName, { color: c.text }]}>{option.name}</Text>
                {/* Mini preview: the theme's own background, card and accent colors */}
                <View style={styles.swatches}>
                  {[option.colors.background, option.colors.card, option.colors.accent].map(
                    (color, i) => (
                      <View
                        key={i}
                        style={[styles.swatch, { backgroundColor: color, borderColor: c.border }]}
                      />
                    ),
                  )}
                </View>
              </View>
              {selected && <Ionicons name="checkmark-circle" size={24} color={c.accent} />}
            </PressableScale>
          </Animated.View>
        );
      })}

      <Text style={[styles.footer, { color: c.textMuted }]}>PawDex v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionBody: {
    flex: 1,
  },
  optionName: {
    fontSize: 17,
    fontWeight: '700',
  },
  swatches: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  swatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  footer: {
    textAlign: 'center',
    marginTop: 'auto',
    fontSize: 13,
    fontWeight: '600',
  },
});
