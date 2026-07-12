// Edit screen. The [id] in the filename makes this a *dynamic* route:
// /cat/edit/abc123 renders this screen with id = "abc123".

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import CatForm from '@/components/CatForm';
import { getCat, updateCat } from '@/lib/storage';
import type { Cat } from '@/lib/types';

export default function EditCatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cat, setCat] = useState<Cat | undefined>();

  // Load the cat once when the screen opens.
  useEffect(() => {
    getCat(id).then(setCat);
  }, [id]);

  if (!cat) return null; // brief moment while loading from storage

  return (
    <CatForm
      initial={cat}
      submitLabel="Save Changes"
      onSubmit={async (draft) => {
        await updateCat(cat.id, draft);
        router.back();
      }}
    />
  );
}
