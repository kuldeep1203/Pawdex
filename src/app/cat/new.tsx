// Screen for adding a new cat. The route is /cat/new because of this
// file's location: src/app/cat/new.tsx (expo-router file-based routing).

import { router } from 'expo-router';

import CatForm from '@/components/CatForm';
import { addCat } from '@/lib/storage';

export default function NewCatScreen() {
  return (
    <CatForm
      submitLabel="Add to PawDex"
      onSubmit={async (draft) => {
        await addCat(draft);
        router.back(); // return to the home grid
      }}
    />
  );
}
