# Current State

Latest Change:
Added a faded paw-print wallpaper behind the Cozy Dexgadget device screen (converted the user's AVIF to PNG; subtle 15% opacity).

Current Focus:
The app now closely follows all five /snapshots wireframes, including the device chrome. Remaining gaps are feature-level (sightings, real map) — listed in snapshots/IMPLEMENTATION-NOTES.md.

Last Modified:
2026-07-12 (late evening) +0400

Next Expected Step:
Possibly a sightings feature (tallies, dated entry stamps, diary feed) — the biggest wireframe element still missing.

---

# Project Timeline

## 2026-07-12 (late evening) +0400

### Added a faded paw-print wallpaper to the Cozy Dexgadget theme

**Files**
- `assets/images/paw-pattern.png` (new — converted from the user's supplied AVIF)
- `src/components/DeviceFrame.tsx` (renders the wallpaper behind the device screen)

**Summary**
The user dropped a paw-print pattern image (AVIF) into assets. AVIF isn't safe for React Native (Metro doesn't bundle it by default and it only decodes on iOS 16+/newer Android), so it was converted once to PNG using `sharp` in a throwaway scratchpad — no new dependency was added to the project (package.json/lock were restored and the original AVIF removed). The PNG now renders as a subtle wallpaper (15% opacity, `contentFit: cover`) inside the Cozy Dexgadget device's cream screen, behind all content. Because the image's own background is light cream like the screen, only the faint pink paws/hearts show through. It appears for the dexgadget theme only (it lives inside DeviceFrame). TypeScript and ESLint pass.

**Reason**
User asked to use their added image as a subtle, faded background for this theme.

---

## 2026-07-12 (late evening) +0400

### Added the Cozy Dexgadget device chrome

**Files**
- `src/components/DeviceFrame.tsx` (new — the toy-device wrapper + `DeviceLens` header piece; the d-pad routes to /cat/new)
- `src/theme/themes.ts` (new `decor.deviceChrome` flag; split content vs. shell colors into `onBackground*` and `onShell*` tokens)
- `src/app/_layout.tsx`, `src/app/(tabs)/_layout.tsx` (header/tab text uses shell tokens; header lens for the gadget theme)
- `src/components/HeaderTitle.tsx` (uses `onShell`)
- `src/app/(tabs)/dex.tsx` (wrapped in DeviceFrame; floating + hidden when chrome is on)
- `src/app/(tabs)/settings.tsx`, `src/app/(tabs)/map.tsx`, `src/app/index.tsx` (wrapped in DeviceFrame)
- `src/app/cat/[id].tsx` (wrapped in DeviceFrame; one-big-entry ◂ ▸ pager stepping through the collection)

**Summary**
The Cozy Dexgadget theme now renders every screen "inside" a soft handheld device: a cream screen panel with the wireframe's one big asymmetric corner, a header camera lens with a slowly blinking light, and a hardware row (d-pad, pill buttons, speaker bar). The device's black d-pad is the working button to log a new cat, so the floating + is hidden for this theme; the cat detail page gains the "ENTRY 003 / 014" pager whose arrows walk through the collection. A `DeviceFrame` wrapper does all this and renders children untouched for the other four themes. To keep text readable both on the red shell and on the cream screen, the on-surface colors were split into `onShell*` (header/tabs) and `onBackground*` (content). TypeScript and ESLint pass.

**Reason**
User asked whether the 1d device chrome could live "within the theme" — it can, via a wrapper keyed off a `deviceChrome` decor flag — and then asked that the gadget's own black d-pad button do the adding, for immersion.

---

## 2026-07-12 (late evening) +0400

### Implemented the remaining theme-specific layouts and decorations

**Files**
- `src/theme/themes.ts` (new tokens: `inputVariant`, `photoPlate`, `dexLayout`, and a `decor` group: `ruledPaper`, `washiTape`, `stampWatermark`; sticker-book body font is now print-handwriting)
- `src/utils/roman-numerals.ts` (new — number to roman numeral)
- `src/components/RuledPaper.tsx` (new — notebook-lines background)
- `src/components/CatRow.tsx` (new — field-guide ledger row with dotted separators)
- `src/components/CatStamp.tsx` (new — passport round stamp grid item)
- `src/app/(tabs)/dex.tsx` (dex switches grid / ledger / stamps per theme)
- `src/components/CatForm.tsx` (underline "ledger" inputs for field guide; ruled paper)
- `src/app/cat/[id].tsx` (double-framed specimen plate with "PLATE III · No. 003" caption; REGULAR stamp watermark; ruled paper)
- `src/components/CatCard.tsx` (washi-tape strip on scrapbook cards)
- `src/app/(tabs)/settings.tsx`, `src/app/(tabs)/map.tsx`, `src/app/index.tsx` (ruled paper)

**Summary**
Each theme now gets its wireframe's structural look, not just its colors. Field Guide: the dex is a numbered ledger list with round portraits, italic serif names and dotted rules; form fields are underline-only; the detail photo sits in a double-framed specimen plate with a roman-numeral caption. Scrapbook: every screen has ruled notebook lines and each card is "taped down" with a translucent washi strip. Passport: the dex is a grid of rotated circular stamps on a parchment panel, and the detail page carries a faint rotated REGULAR rubber stamp. Fonts stay the closest built-ins (user chose not to add font packages); sticker-book body text now uses a print-handwriting built-in. TypeScript and ESLint pass.

**Reason**
User asked for the field-guide details (and the other remaining wireframe features) to be implemented with the closest available fonts, without adding new font dependencies.

---

## 2026-07-12 (late evening) +0400

### Added traits, Map placeholder tab, and Themes tab rename

**Files**
- `src/lib/types.ts` (Cat gains `traits: string[]`)
- `src/lib/storage.ts` (older saved cats default to empty traits)
- `src/constants/traits.ts` (new — preset trait choices)
- `src/components/TraitChip.tsx` (new — rounded colored trait pill)
- `src/components/CatForm.tsx` (trait picker: toggle presets, add custom)
- `src/components/CatCard.tsx` (up to two chips under the name)
- `src/app/cat/[id].tsx` (full chip row under the photo)
- `src/app/(tabs)/map.tsx` (new — "Not added yet" placeholder screen)
- `src/app/(tabs)/_layout.tsx` (tab bar is now Dex / Map / Themes)

**Summary**
Cats can now have personality trait chips (sleepy, chaotic, fancy, round, or custom ones typed in the form), stored with each cat and rendered as rounded pills colored from the active theme's chips palette — on the dex grid cards (max two) and the detail screen (all). The bottom tab bar now mirrors the wireframe: the Settings tab is renamed Themes with a color-palette icon, and a new Map tab opens a placeholder screen that plainly says the map isn't built yet.

**Reason**
User asked for the wireframe's tab bar (themes + map with a "not added yet" message) and the trait chips feature.

---

## 2026-07-12 (late evening) +0400

### Added blob photo frame, tilted titles, and peeled sticker corners

**Files**
- `src/theme/themes.ts` (new shape tokens: `titleTilt`, `peelCorner`, `photoFrame`)
- `src/components/HeaderTitle.tsx` (new — custom nav-bar title with theme tilt/italic)
- `src/app/_layout.tsx`, `src/app/(tabs)/_layout.tsx` (use HeaderTitle)
- `src/components/CatCard.tsx` (one flat "peeled" corner per card, cycling position)
- `src/components/CatForm.tsx` (empty photo frame is now a blob / circle / rect per theme)

**Summary**
Three wireframe details previously listed as "not implemented" are now in: the Sticker Book theme gets a wobbly blob "tap to add photo" frame (four uneven circular corners approximating the wireframe's elliptical ones), slightly rotated screen titles, and cards with one flat corner like a peeling sticker. The Cat Passport theme's photo frame became a dashed circle. As a side effect, the Field Guide's italic headers now work in the nav bar (the custom HeaderTitle component supports what the built-in title style couldn't).

**Reason**
User asked why these three were skipped and requested they be implemented with the closest possible approximations.

---

## 2026-07-12 (evening) +0400

### Replaced themes with the 5 snapshot wireframe themes

**Files**
- `src/theme/themes.ts` (rewritten: 5 new themes; new `fonts` + `shape` tokens; new colors `onBackground`, `onBackgroundMuted`, `accentOnBackground`, `chips`)
- `src/components/CatCard.tsx` (card tilt, hard offset pastel shadows, shape/font tokens)
- `src/components/CatForm.tsx` (shape tokens on inputs/buttons, dashed empty-photo frame, label colors)
- `src/app/_layout.tsx`, `src/app/(tabs)/_layout.tsx` (header/tab colors + fonts)
- `src/app/(tabs)/dex.tsx`, `src/app/(tabs)/settings.tsx`, `src/app/index.tsx`, `src/app/cat/[id].tsx`, `src/app/+not-found.tsx` (consume the new tokens)
- `snapshots/IMPLEMENTATION-NOTES.md` (new — what isn't pixel-faithful and how to finish it)

**Summary**
The old Midnight Nap / Strawberry Cocoa / Matcha Cream color themes are gone. The five design directions from `snapshots/` are now the switchable themes, using the wireframes' exact colors. The theme object gained `fonts` (handwriting/serif approximations via built-in platform fonts) and `shape` (border width, card/control radius, card tilt, hard/soft/no shadow) so themes differ in character, not just hue. Saved theme keys from the old system fall back to the new default (Sticker Book). TypeScript and ESLint pass.

**Reason**
User asked to replace the current themes with the wireframe designs from the snapshots folder, keeping them switchable, and to document anything that couldn't be reproduced exactly (done in snapshots/IMPLEMENTATION-NOTES.md).

---

## 2026-07-12 18:15 +0400

### Built the PawDex app on the Expo scaffold

**Files**
- `src/app/(tabs)/_layout.tsx`, `src/app/(tabs)/dex.tsx`, `src/app/(tabs)/settings.tsx`
- `src/app/index.tsx`, `src/app/+not-found.tsx`
- `src/app/cat/new.tsx`, `src/app/cat/[id].tsx`, `src/app/cat/edit/[id].tsx`
- `src/components/CatCard.tsx`, `src/components/CatForm.tsx`, `src/components/PressableScale.tsx`
- `src/lib/storage.ts`, `src/lib/types.ts`
- `src/theme/themes.ts`, `src/theme/ThemeContext.tsx`
- `app.json`, `eas.json`, `eslint.config.js`, `package.json`, `package-lock.json`
- Removed the unused default-template files (`src/app/explore.tsx`, `src/components/animated-icon*`, `src/components/app-tabs*`, `src/components/themed-text.tsx`, `src/components/themed-view.tsx`, `src/components/ui/collapsible.tsx`, `src/components/web-badge.tsx`, `src/components/external-link.tsx`, `src/components/hint-row.tsx`, `src/constants/theme.ts`, `src/global.css`, `src/hooks/use-color-scheme.ts`, `scripts/reset-project.js`)

**Summary**
Replaced the generic `create-expo-app` starter screens with the real PawDex app: a Pokédex-style catalog of cats. Added a tab layout with a "Dex" screen (list of logged cats via `CatCard`) and a "Settings" screen; screens for viewing (`cat/[id]`), adding (`cat/new`), and editing (`cat/edit/[id]`) a cat entry, all built on a shared `CatForm`. Added a storage layer (`src/lib/storage.ts`) that keeps the cat list in `AsyncStorage` as JSON and copies picked photos into permanent app storage via `expo-file-system`, plus the `Cat`/`CatDraft` types (`src/lib/types.ts`). Added a theme system (`src/theme/themes.ts` + `ThemeContext.tsx`) for light/dark styling, and configured `eas.json` for EAS builds.

**Reason**
This was the first real feature work on top of the default Expo template — establishing the app's core data model (a cat "entry" with photo, food, antics, about, optional location) and the primary add/view/edit/browse flow.

---

## 2026-06-25 21:47 +0400

### Initial commit (Expo scaffold)

**Files**
- Full default `create-expo-app` 4.0.0 template (tab layout, themed components, hooks, constants, assets, config files)

**Summary**
Project generated via `create-expo-app`, giving a working Expo Router + TypeScript starter with example tab screens, themed text/view components, and the standard Expo config (`app.json`, `tsconfig.json`, `.gitignore`, etc.).

**Reason**
Starting point for the PawDex app.
