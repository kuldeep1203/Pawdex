// MAP — placeholder tab. The wireframes show a map of where cats were
// spotted; that feature isn't built yet, so this screen says so honestly
// instead of pretending.

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import DeviceFrame from '@/components/DeviceFrame';
import RuledPaper from '@/components/RuledPaper';
import { useTheme } from '@/theme/ThemeContext';

export default function MapScreen() {
  const { theme } = useTheme();
  const { colors: c, fonts } = theme;

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      {theme.decor.ruledPaper && <RuledPaper />}
      <DeviceFrame>
        <View style={styles.content}>
          <View style={[styles.iconWrap, { backgroundColor: c.accentSoft }]}>
            <Ionicons name="map-outline" size={40} color={c.text} />
          </View>
          <Text style={[styles.title, { color: c.onBackground, fontFamily: fonts.heading }]}>
            Not added yet
          </Text>
          <Text style={[styles.hint, { color: c.onBackgroundMuted, fontFamily: fonts.body }]}>
            A map of your cat sightings is coming in a future update.
          </Text>
        </View>
      </DeviceFrame>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  hint: {
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center',
  },
});
