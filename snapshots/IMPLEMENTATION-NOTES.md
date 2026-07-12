# Wireframe themes — what was implemented vs. what needs your hand

The five wireframes are now the app's five switchable themes (Settings tab):
Sticker Book · Field Guide · Scrapbook Journal · Cozy Dexgadget · Cat Passport.

Each theme carries the wireframe's exact colors, plus new **font** and **shape**
tokens (border width, corner radius, card tilt, shadow style) that every screen
reads. What follows is the honest list of things that are NOT pixel-faithful to
the snapshots, and why.

---

## Applies to all themes

- **Fonts are approximations (by choice).** The wireframes use Google Fonts
  *Caveat* (handwriting) and *Patrick Hand*; the HTML also uses *Georgia*
  (serif). React Native can only use fonts that ship with the OS or are
  bundled with the app; the user chose not to add font packages, so the app
  uses the closest built-ins: `Noteworthy` (iOS) / `casual` (Android) for
  loose handwriting, `Marker Felt` (iOS) / `casual` (Android) for print
  handwriting, `Georgia` (iOS) / `serif`, i.e. Noto Serif (Android) for the
  field guide. Note Georgia is a licensed font and can never be *bundled* —
  iOS just happens to ship it. **To go exact later:** `npx expo install
  @expo-google-fonts/caveat @expo-google-fonts/patrick-hand expo-font`, load
  them in `src/app/_layout.tsx` with `useFonts`, then put the font names into
  each theme's `fonts` in `src/theme/themes.ts`.
- **Feature-level content in the wireframes doesn't exist in the app yet**, so
  no theme can show it: sighting tallies and dated sighting history, a real
  map / territory map (the Map tab is a "not added yet" placeholder),
  "not yet spotted" empty slots, fake-latin species names, roman-numeral
  counts. These are app features, not theme styling.
  ~~Trait chips~~ **Done** — cats now have trait chips (presets + custom),
  picked in the form and shown on cards and the detail screen
  (`src/components/TraitChip.tsx`, colors from each theme's `chips` palette).
- ~~Navigation header italic~~ **Done** — headers now use a custom
  `HeaderTitle` component (`src/components/HeaderTitle.tsx`), which supports
  italics (Field Guide) and a slight rotation (Sticker Book).

## 1a — Sticker Book

- Implemented: pink paper background, white cards with 2px ink borders, hard
  pastel offset shadows (cycled per card: pink/blue/yellow/green), alternating
  card tilt, pill-ish corners, handwritten headings, dashed pink "tap to add
  photo" frame, **rotated screen titles** (via `HeaderTitle`), **peeled
  sticker corners** (one flat corner per card, cycling position), and a
  **blob-shaped photo frame** on the New Cat screen.
- Remaining approximation: the blob uses four uneven *circular* corners; the
  wireframe's corners are *elliptical* (`border-radius: 50% 50% 46% 54%/...`),
  which RN can't do — a pixel-perfect blob needs `react-native-svg` and a
  clip path/mask.

## 1b — Field Guide

- Implemented: paper tint, ink lines, deep-green accent, serif type (italic in
  screen content), sharp 2px corners, thin 1px rules, letter-spaced small-caps
  labels on the form, **underline-only ledger form fields**, the
  **double-framed "specimen plate"** photo mount with a
  "PLATE III · No. 003" roman-numeral caption, and a **ledger-style dex
  list** (numbered rows, round portraits, italic names, dotted separators —
  `src/components/CatRow.tsx`).
- Remaining: fake-latin species names and roman-numeral *sighting* tallies
  (sightings aren't a feature yet).

## 1c — Scrapbook Journal

- Implemented: cream paper, amber accent, handwriting font everywhere, tilted
  polaroid-ish cards (white, photo on top, caption below) with soft shadows,
  the **ruled-paper background** on every screen
  (`src/components/RuledPaper.tsx`), and **washi-tape strips** on each card
  (translucent tinted rectangle, alternating tilt).
- Not implemented: the **diary-feed layout** (the wireframe's dex is a
  chronological journal with entries alternating left/right — the app keeps
  its grid; this depends on the sightings feature existing).

## 1d — Cozy Dexgadget

- Implemented: red device-shell background with the cream "screen" as the card
  color, ink borders, yellow/green/sky chips, dark ink buttons with yellow
  text (like REGISTER CAT), light status-bar text, and the full **device
  chrome** — a `DeviceFrame` wrapper (`src/components/DeviceFrame.tsx`) around
  every screen: the cream screen panel with the asymmetric big bottom-left
  corner, a header lens + slow-blinking light, and a hardware row with a d-pad,
  pill buttons and a speaker bar. The black d-pad is the working "add a new
  cat" button (the dex's floating + is hidden for this theme). The cat detail
  page shows the one-big-entry pager ("ENTRY 003 / 014" with working ◂ ▸
  arrows that step through the collection).
- Content-vs-shell colors are split into separate tokens (`onBackground*` for
  the cream screen, `onShell*` for the red header/tab bar) so text stays
  readable on both surfaces.
- Remaining: only the exact hardware art is approximate (simple shapes, not
  the wireframe's shaded lens/d-pad); everything structural is in.

## 1e — Cat Passport

- Implemented: navy passport-cover background, parchment page cards, gold
  active-tab/accent-on-navy, stamp-blue buttons, stamp-ring chip palette
  (blue/red/green/ochre), circular dashed add-photo frame, the **round stamp
  grid** dex (circular photos in rotated colored stamp rings on a parchment
  panel — `src/components/CatStamp.tsx`), and the faint rotated **"REGULAR"
  rubber stamp** watermark on the detail page.
- Not implemented: **dated entry stamps** per sighting and dashed "?" empty
  slots (both depend on the sightings feature existing).

---

If you build any of the missing pieces, the theme tokens they should read are
already in `src/theme/themes.ts` (`colors.chips`, `shape.cardTilt`, etc.).
