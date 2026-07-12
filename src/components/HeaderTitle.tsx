// The screen title shown in the navigation header. The built-in header
// title only supports font family/size/weight, so this custom component
// exists to add what the themes need: a slight handwritten tilt
// (sticker book) and italics (field guide).

import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

export default function HeaderTitle({ text }: { text: string }) {
  const { theme } = useTheme();
  const { colors: c, fonts, shape } = theme;

  return (
    <Text
      numberOfLines={1}
      style={[
        styles.title,
        {
          color: c.onShell,
          fontFamily: fonts.heading,
          fontStyle: fonts.headingItalic ? 'italic' : 'normal',
          transform: [{ rotate: shape.titleTilt ? '-2deg' : '0deg' }],
        },
      ]}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
});
