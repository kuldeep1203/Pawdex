// The form used by BOTH the "new cat" and "edit cat" screens.
// It collects a CatDraft and hands it to the screen via onSubmit —
// the form itself doesn't know (or care) whether it's adding or editing.

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import PressableScale from '@/components/PressableScale';
import type { Cat, CatDraft } from '@/lib/types';
import { useTheme } from '@/theme/ThemeContext';

type Props = {
  initial?: Cat; // present when editing, absent when adding
  submitLabel: string;
  onSubmit: (draft: CatDraft) => void;
};

export default function CatForm({ initial, submitLabel, onSubmit }: Props) {
  const { theme } = useTheme();
  const c = theme.colors;

  // One piece of state per form field. Editing starts from the existing cat.
  const [photoUri, setPhotoUri] = useState(initial?.photoUri ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [food, setFood] = useState(initial?.food ?? '');
  const [antics, setAntics] = useState(initial?.antics ?? '');
  const [about, setAbout] = useState(initial?.about ?? '');
  const [locationLabel, setLocationLabel] = useState(initial?.location?.label ?? '');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | undefined>(
    initial?.location
      ? { latitude: initial.location.latitude ?? 0, longitude: initial.location.longitude ?? 0 }
      : undefined,
  );
  const [findingLocation, setFindingLocation] = useState(false);

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
      about: about.trim(),
      location: locationLabel.trim()
        ? { label: locationLabel.trim(), ...coords }
        : undefined,
    });
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: c.card, color: c.text, borderColor: c.border },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Photo preview + picker buttons */}
      <View style={[styles.photoBox, { backgroundColor: c.card, borderColor: c.border }]}>
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
          style={[styles.smallButton, { backgroundColor: c.accentSoft }]}
          onPress={pickFromCamera}
        >
          <Ionicons name="camera-outline" size={18} color={c.text} />
          <Text style={[styles.smallButtonText, { color: c.text }]}>Camera</Text>
        </PressableScale>
        <PressableScale
          style={[styles.smallButton, { backgroundColor: c.accentSoft }]}
          onPress={pickFromGallery}
        >
          <Ionicons name="images-outline" size={18} color={c.text} />
          <Text style={[styles.smallButtonText, { color: c.text }]}>Gallery</Text>
        </PressableScale>
      </View>

      <Text style={[styles.label, { color: c.textMuted }]}>NAME</Text>
      <TextInput
        style={inputStyle}
        value={name}
        onChangeText={setName}
        placeholder="Sir Whiskers"
        placeholderTextColor={c.textMuted}
      />

      <Text style={[styles.label, { color: c.textMuted }]}>FAVORITE FOOD</Text>
      <TextInput
        style={inputStyle}
        value={food}
        onChangeText={setFood}
        placeholder="Tuna, chicken, your homework..."
        placeholderTextColor={c.textMuted}
      />

      <Text style={[styles.label, { color: c.textMuted }]}>WHAT IT DOES</Text>
      <TextInput
        style={inputStyle}
        value={antics}
        onChangeText={setAntics}
        placeholder="Sleeps on warm cars, judges passersby"
        placeholderTextColor={c.textMuted}
      />

      <Text style={[styles.label, { color: c.textMuted }]}>ABOUT</Text>
      <TextInput
        style={[...inputStyle, styles.multiline]}
        value={about}
        onChangeText={setAbout}
        placeholder="The full story of this cat..."
        placeholderTextColor={c.textMuted}
        multiline
      />

      <Text style={[styles.label, { color: c.textMuted }]}>SPOTTED AT</Text>
      <TextInput
        style={inputStyle}
        value={locationLabel}
        onChangeText={setLocationLabel}
        placeholder="Behind the bakery"
        placeholderTextColor={c.textMuted}
      />
      <PressableScale
        style={[styles.smallButton, styles.locationButton, { backgroundColor: c.accentSoft }]}
        onPress={useMyLocation}
        disabled={findingLocation}
      >
        <Ionicons name="location-outline" size={18} color={c.text} />
        <Text style={[styles.smallButtonText, { color: c.text }]}>
          {findingLocation ? 'Finding you...' : 'Use my location'}
        </Text>
      </PressableScale>

      <PressableScale
        style={[styles.submitButton, { backgroundColor: c.accent }]}
        onPress={handleSubmit}
      >
        <Text style={[styles.submitText, { color: c.onAccent }]}>{submitLabel}</Text>
      </PressableScale>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  photoBox: {
    alignSelf: 'center',
    width: 180,
    height: 180,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 16,
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  locationButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
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
    borderRadius: 16,
    borderWidth: 1,
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
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
