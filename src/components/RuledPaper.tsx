// The notebook-line background of the scrapbook theme: thin horizontal
// rules drawn behind the screen content, like ruled diary paper.
// pointerEvents="none" lets taps pass straight through to the content.

import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

const LINE_SPACING = 27; // distance between rules, matching the wireframe
const LINE_COUNT = 60; // enough lines to cover even tall scrolling screens

export default function RuledPaper() {
  const { theme } = useTheme();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: LINE_COUNT }, (_, i) => (
        <View
          key={i}
          style={[
            styles.line,
            { top: (i + 1) * LINE_SPACING, backgroundColor: theme.colors.border },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.55,
  },
});
