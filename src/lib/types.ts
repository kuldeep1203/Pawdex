// The shape of one cat entry in the PawDex.

export type CatLocation = {
  label: string; // human-readable, e.g. "Koregaon Park, Pune"
  latitude?: number;
  longitude?: number;
};

export type Cat = {
  id: string; // unique id used for routing and file names
  entryNumber: number; // Pokédex-style number: #001, #002, ...
  name: string;
  photoUri: string; // file:// URI of the saved photo on the device
  food: string; // favorite food
  antics: string; // what it does (personality, tricks, chaos)
  traits: string[]; // personality chips like "sleepy", "chaotic"
  about: string;
  location?: CatLocation;
  createdAt: number; // timestamp (ms) when the entry was created
};

// What the form produces — everything except the fields the storage
// layer fills in itself (id, entryNumber, createdAt).
export type CatDraft = Omit<Cat, 'id' | 'entryNumber' | 'createdAt'>;
