// All reading/writing of cat data lives in this one file.
//
// Two kinds of storage are used:
// 1. AsyncStorage — a small key-value store. We keep the whole cat list
//    as one JSON string under a single key.
// 2. The file system (expo-file-system) — photos from the camera/gallery
//    land in a *temporary* cache folder that the OS may wipe, so we copy
//    each photo into the app's permanent "document" folder.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';

import type { Cat, CatDraft } from './types';

const STORAGE_KEY = 'pawdex.cats';

export async function getCats(): Promise<Cat[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? (JSON.parse(json) as Cat[]) : [];
}

export async function getCat(id: string): Promise<Cat | undefined> {
  const cats = await getCats();
  return cats.find((cat) => cat.id === id);
}

export async function addCat(draft: CatDraft): Promise<Cat> {
  const cats = await getCats();
  const id = makeId();
  const cat: Cat = {
    ...draft,
    id,
    entryNumber: nextEntryNumber(cats),
    createdAt: Date.now(),
    photoUri: savePhoto(draft.photoUri, id),
  };
  await saveCats([...cats, cat]);
  return cat;
}

export async function updateCat(id: string, draft: CatDraft): Promise<void> {
  const cats = await getCats();
  const updated = cats.map((cat) => {
    if (cat.id !== id) return cat;
    const photoUri = savePhoto(draft.photoUri, id);
    if (photoUri !== cat.photoUri) deletePhoto(cat.photoUri);
    return { ...cat, ...draft, photoUri };
  });
  await saveCats(updated);
}

export async function deleteCat(id: string): Promise<void> {
  const cats = await getCats();
  const cat = cats.find((c) => c.id === id);
  if (cat) deletePhoto(cat.photoUri);
  await saveCats(cats.filter((c) => c.id !== id));
}

async function saveCats(cats: Cat[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
}

// Copies a freshly picked photo into permanent storage and returns its new
// URI. If the URI already points at our document folder (editing a cat
// without changing its photo), it is returned unchanged.
function savePhoto(photoUri: string, catId: string): string {
  if (photoUri.startsWith(Paths.document.uri)) {
    return photoUri;
  }
  const source = new File(photoUri);
  // Include a timestamp so an edited photo gets a fresh name — otherwise
  // the <Image> cache could keep showing the old picture.
  const destination = new File(Paths.document, `cat-${catId}-${Date.now()}.jpg`);
  source.copy(destination);
  return destination.uri;
}

function deletePhoto(photoUri: string): void {
  const photo = new File(photoUri);
  if (photo.exists) photo.delete();
}

function nextEntryNumber(cats: Cat[]): number {
  return cats.reduce((max, cat) => Math.max(max, cat.entryNumber), 0) + 1;
}

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
