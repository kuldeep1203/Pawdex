// The form used by BOTH the "new cat" and "edit cat" screens.
// It collects a CatDraft and hands it to the screen via onSubmit —
// the form itself doesn't know (or care) whether it's adding or editing.

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import PressableScale from '@/components/PressableScale';
import RuledPaper from '@/components/RuledPaper';
import TraitChip from '@/components/TraitChip';
import { PRESET_TRAITS } from '@/constants/traits';
import type { Cat, CatDraft } from '@/lib/types';
import { useTheme } from '@/theme/ThemeContext';

type Props = {
  initial?: Cat; // present when editing, absent when adding
  submitLabel: string;
  onSubmit: (draft: CatDraft) => void;
};

export default function CatForm({ initial, submitLabel, onSubmit }: Props) {
  const { theme } = useTheme();
  const { colors: c, shape, fonts } = theme;

  // One piece of state per form field. Editing starts from the existing cat.
  const [photoUri, setPhotoUri] = useState(initial?.photoUri ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [food, setFood] = useState(initial?.food ?? '');
  const [antics, setAntics] = useState(initial?.antics ?? '');
  const [about, setAbout] = useState(initial?.about ?? '');
  const [traits, setTraits] = useState<string[]>(initial?.traits ?? []);
  const [customTrait, setCustomTrait] = useState('');
  const [locationLabel, setLocationLabel] = useState(initial?.location?.label ?? '');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | undefined>(
    initial?.location
      ? { latitude: initial.location.latitude ?? 0, longitude: initial.location.longitude ?? 0 }
      : undefined,
  );
  const [findingLocation, setFindingLocation] = useState(false);

  // Tapping a chip adds the trait if it's off, removes it if it's on.
  const toggleTrait = (trait: string) => {
    setTraits((current) =>
      current.includes(trait) ? current.filter((t) => t !== trait) : [...current, trait],
    );
  };

  const addCustomTrait = () => {
    const trait = customTrait.trim().toLowerCase();
    if (!trait) return;
    if (!traits.includes(trait)) setTraits([...traits, trait]);
    setCustomTrait('');
  };

  // The choices on screen: the presets plus any custom traits already picked.
  const traitOptions = [...PRESET_TRAITS, ...traits.filter((t) => !PRESET_TRAITS.includes(t))];

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera access needed', 'Please allow camera access to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  // Ask for the phone's location, then turn coordinates into a readable
  // place name (reverse geocoding). The label stays editable afterwards.
  const useMyLocation = async () => {
    setFindingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location access needed', 'Please allow location access to tag where you met the cat.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setCoords(position.coords);
      const places = await Location.reverseGeocodeAsync(position.coords);
      const place = places[0];
      const label = [place?.name, place?.district, place?.city]
        .filter(Boolean)
        .slice(0, 2)
        .join(', ');
      setLocationLabel(label || 'Unknown location');
    } catch {
      Alert.alert('Location unavailable', "Couldn't find your location. You can type it instead.");
    } finally {
      setFindingLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!photoUri) {
      Alert.alert('Photo missing', 'Every PawDex entry needs a photo.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Name missing', 'What do you call this cat?');
      return;
    }
    onSubmit({
      photoUri,
      name: name.trim(),
      food: food.trim(),
      antics: antics.trim(),
      traits,
      about: about.trim(),
      location: locationLabel.trim()
        ? { label: locationLabel.trim(), ...coords }
        : undefined,
    });
  };

  // Two input looks: a filled box, or the field guide's ledger style —
  // no box, just a thin ink line under the text.
  const inputStyle = [
    styles.input,
    shape.inputVariant === 'underline'
      ? {
          backgroundColor: 'transparent',
          color: c.text,
          borderBottomColor: c.border,
          borderBottomWidth: Math.max(shape.borderWidth, 1),
          borderRadius: 0,
          paddingHorizontal: 0,
          paddingVertical: 8,
          fontFamily: fonts.body,
        }
      : {
          backgroundColor: c.card,
          color: c.text,
          borderColor: c.border,
          borderWidth: Math.max(shape.borderWidth, 1),
          borderRadius: shape.radiusControl,
          fontFamily: fonts.body,
        },
  ];

  const labelStyle = [styles.label, { color: c.onBackgroundMuted }];

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      {theme.decor.ruledPaper && <RuledPaper />}
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Photo preview + picker buttons. While empty it's a dashed
          accent-colored frame — like "tap to add photo" in the wireframes.
          Its shape follows the theme: a hand-drawn blob (sticker book),
          a circle (passport), or a rounded rectangle (the rest). The blob
          is four uneven circular corners — true elliptical corners would
          need SVG, but this reads as the same idea. */}
      <View
        style={[
          styles.photoBox,
          photoUri || shape.photoFrame === 'rect'
            ? { borderRadius: Math.max(shape.radiusCard, 8) }
            : shape.photoFrame === 'circle'
              ? styles.photoFrameCircle
              : styles.photoFrameBlob,
          {
            backgroundColor: c.card,
            borderColor: photoUri ? c.border : c.accent,
            borderWidth: photoUri ? shape.borderWidth : Math.max(shape.borderWidth, 2),
            borderStyle: photoUri ? 'solid' : 'dashed',
          },
        ]}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="image-outline" size={40} color={c.textMuted} />
            <Text style={[styles.photoPlaceholderText, { color: c.textMuted }]}>No photo yet</Text>
          </View>
        )}
      </View>
      <View style={styles.row}>
        <PressableScale
          style={[styles.smallButton, { backgroundColor: c.accentSoft, borderRadius: shape.radiusControl }]}
          onPress={pickFromCamera}
        >
          <Ionicons name="camera-outline" size={18} color={c.text} />
          <Text style={[styles.smallButtonText, { color: c.text }]}>Camera</Text>
        </PressableScale>
        <PressableScale
          style={[styles.smallButton, { backgroundColor: c.accentSoft, borderRadius: shape.radiusControl }]}
          onPress={pickFromGallery}
        >
          <Ionicons name="images-outline" size={18} color={c.text} />
          <Text style={[styles.smallButtonText, { color: c.text }]}>Gallery</Text>
        </PressableScale>
      </View>

      <Text style={labelStyle}>NAME</Text>
      <TextInput
        style={inputStyle}
        value={name}
        onChangeText={setName}
        placeholder="Sir Whiskers"
        placeholderTextColor={c.textMuted}
      />

      {/* Trait picker: filled chip = selected, dashed outline = available */}
      <Text style={labelStyle}>TRAITS</Text>
      <View style={styles.traitRow}>
        {traitOptions.map((trait) => {
          const selectedIndex = traits.indexOf(trait);
          const selected = selectedIndex !== -1;
          return (
            <PressableScale key={trait} onPress={() => toggleTrait(trait)}>
              {selected ? (
                <TraitChip label={trait} color={c.chips[selectedIndex % c.chips.length]} />
              ) : (
                <View style={[styles.traitOption, { borderColor: c.onBackgroundMuted }]}>
                  <Text style={[styles.traitOptionText, { color: c.onBackgroundMuted }]}>
                    {trait}
                  </Text>
                </View>
              )}
            </PressableScale>
          );
        })}
      </View>
      <View style={styles.traitAddRow}>
        <TextInput
          style={[...inputStyle, styles.traitInput]}
          value={customTrait}
          onChangeText={setCustomTrait}
          placeholder="Add your own..."
          placeholderTextColor={c.textMuted}
          onSubmitEditing={addCustomTrait}
          returnKeyType="done"
        />
        <PressableScale
          style={[
            styles.traitAddButton,
            { backgroundColor: c.accentSoft, borderRadius: shape.radiusControl },
          ]}
          onPress={addCustomTrait}
        >
          <Ionicons name="add" size={20} color={c.text} />
        </PressableScale>
      </View>

      <Text style={labelStyle}>FAVORITE FOOD</Text>
      <TextInput
        style={inputStyle}
        value={food}
        onChangeText={setFood}
        placeholder="Tuna, chicken, your homework..."
        placeholderTextColor={c.textMuted}
      />

      <Text style={labelStyle}>WHAT IT DOES</Text>
      <TextInput
        style={inputStyle}
        value={antics}
        onChangeText={setAntics}
        placeholder="Sleeps on warm cars, judges passersby"
        placeholderTextColor={c.textMuted}
      />

      <Text style={labelStyle}>ABOUT</Text>
      <TextInput
        style={[...inputStyle, styles.multiline]}
        value={about}
        onChangeText={setAbout}
        placeholder="The full story of this cat..."
        placeholderTextColor={c.textMuted}
        multiline
      />

      <Text style={labelStyle}>SPOTTED AT</Text>
      <TextInput
        style={inputStyle}
        value={locationLabel}
        onChangeText={setLocationLabel}
        placeholder="Behind the bakery"
        placeholderTextColor={c.textMuted}
      />
      <PressableScale
        style={[
          styles.smallButton,
          styles.locationButton,
          { backgroundColor: c.accentSoft, borderRadius: shape.radiusControl },
        ]}
        onPress={useMyLocation}
        disabled={findingLocation}
      >
        <Ionicons name="location-outline" size={18} color={c.text} />
        <Text style={[styles.smallButtonText, { color: c.text }]}>
          {findingLocation ? 'Finding you...' : 'Use my location'}
        </Text>
      </PressableScale>

      <PressableScale
        style={[
          styles.submitButton,
          {
            backgroundColor: c.accent,
            borderRadius: shape.radiusControl,
            borderColor: c.border,
            borderWidth: shape.borderWidth,
          },
        ]}
        onPress={handleSubmit}
      >
        <Text style={[styles.submitText, { color: c.onAccent }]}>{submitLabel}</Text>
      </PressableScale>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  photoBox: {
    alignSelf: 'center',
    width: 180,
    height: 180,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoFrameCircle: {
    borderRadius: 90, // half of the box = a full circle
  },
  photoFrameBlob: {
    // Four uneven corners approximate the wireframe's wobbly blob.
    borderTopLeftRadius: 95,
    borderTopRightRadius: 70,
    borderBottomRightRadius: 85,
    borderBottomLeftRadius: 65,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 14,
    marginBottom: 8,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  locationButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  traitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  traitOption: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  traitOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  traitAddRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  traitInput: {
    flex: 1,
  },
  traitAddButton: {
    padding: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 7,
    marginLeft: 4,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
