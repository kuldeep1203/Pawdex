// One rounded trait chip ("sleepy", "round", ...) — the colored sticker
// pills from the wireframes. The background color comes from the theme's
// chips palette; the label switches to white on dark chip colors so it
// stays readable in every theme.

import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

type TraitChipProps = {
  label: string;
  color: string; // chip background, from the theme's chips palette
  small?: boolean; // compact version used on the grid cards
};

// Rough brightness check: dark chip -> white text, light chip -> ink text.
function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}

export default function TraitChip({ label, color, small = false }: TraitChipProps) {
  const { theme } = useTheme();
  const { colors: c, shape } = theme;

  return (
    <View
      style={[
        styles.chip,
        small && styles.chipSmall,
        {
          backgroundColor: color,
          borderColor: c.border,
          borderWidth: Math.max(shape.borderWidth * 0.75, 1),
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          small && styles.labelSmall,
          { color: isDarkColor(color) ? '#FFFFFF' : '#26221E' },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999, // a pill: any huge radius makes fully round ends
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  chipSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  labelSmall: {
    fontSize: 10,
  },
});
