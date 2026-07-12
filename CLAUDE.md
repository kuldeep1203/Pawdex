# AGENTS.md

> Instructions for any AI coding agent (Claude, Cursor, Copilot, etc.) working in this repository.
> Read this file fully **before** writing or changing any code.

---

## 0. Most important rule: I am a complete beginner

**This is my first time using React Native. Treat me as an absolute beginner.**

Because of this, every agent working here MUST:

- **Explain before you build.** Before writing code, say in 1–3 plain sentences *what* you're about to do and *why*. No unexplained jumps.
- **Explain new words the first time they appear.** Terms like `component`, `props`, `state`, `hook`, `async`, `Promise`, `navigation`, `Expo`, etc. get a one-line plain-English definition the first time you use them.
- **Never assume I know a tool exists.** If a task needs a library, a terminal command, or a config file, tell me exactly what to run and what it does.
- **Give me the full command, not a hint.** Write `npx expo start`, not "start the dev server."
- **Prefer the simplest thing that works.** Do not introduce advanced patterns (Redux, custom native modules, complex generics) unless I ask or the task truly needs it. Clean and simple beats clever.
- **One concept at a time.** Don't dump five new ideas in one answer. Build understanding in small steps.
- **Show me where files go.** Whenever you create a file, state its full path and why it lives there.
- **Warn me about anything irreversible** (deleting files, changing config, installing global tools) and wait for confirmation.
- **If something can break my app, say so plainly** and tell me how to undo it.

When in doubt, over-explain. I would rather read one extra sentence than be confused.

---

## 1. Tech stack (do not change without asking)

This project uses the modern, standard React Native setup for 2026:

| Thing | Choice | Why |
|---|---|---|
| Framework | **React Native via Expo** | Easiest way to build, run, and ship a real app without touching native tooling. |
| Language | **TypeScript** (`.ts` / `.tsx`) | Catches mistakes before the app runs. Beginner-friendly safety net. |
| Navigation | **Expo Router** (file-based routing) | Screens are just files in the `app/` folder. Simple mental model. |
| Lists | **FlatList** / **FlashList** | Efficient scrolling for long lists. |
| Images | **expo-image** | Fast, cached images. |
| Styling | **StyleSheet.create** (built-in) | No extra setup, official approach. |

**Rule:** Do NOT add a new library, framework, or tool unless (a) the task genuinely needs it and (b) you explain what it does and why it beats the built-in option. Every new dependency is something I have to maintain and understand.

---

## 2. Golden rules of clean code

These apply to **every** line of code you write here.

1. **Readable over clever.** Code is read far more often than it's written. Write it for a tired human, not to show off.
2. **One job per thing.** A function does one thing. A component shows one thing. A file holds one main thing. (This is the *Single Responsibility Principle*.)
3. **Name things clearly.** A good name removes the need for a comment. `isLoading` is better than `flag`. `fetchUserProfile` is better than `getData`.
4. **No magic numbers or strings.** Instead of `if (status === 3)`, use a named constant like `if (status === OrderStatus.Shipped)`.
5. **Don't repeat yourself (DRY).** If you copy-paste code a second time, stop and make it a reusable function or component instead.
6. **But don't over-engineer (YAGNI — "You Aren't Gonna Need It").** Build what the task needs today, not what it *might* need someday.
7. **Keep functions small.** If a function is longer than ~30–40 lines or you need to scroll to read it, split it up.
8. **Fail loudly, not silently.** Handle errors and show the user something. Never swallow an error with an empty `catch`.
9. **Delete dead code.** Unused variables, commented-out blocks, and leftover experiments get removed, not left "just in case." Git remembers everything anyway.
10. **Leave it cleaner than you found it.** If you touch a messy file, tidy the part you touched.

---

## 3. Project / folder structure

Keep the project organized like this. `app/` is for screens (routes); `src/` is for everything else.

```
my-app/
├── app/                    # SCREENS ONLY (Expo Router turns each file into a screen)
│   ├── _layout.tsx         # Root layout (wraps the whole app)
│   ├── index.tsx           # The first/home screen
│   └── (tabs)/             # A group of tab screens
│       ├── _layout.tsx     # Tab bar setup
│       ├── home.tsx
│       └── profile.tsx
│
├── src/
│   ├── components/         # Reusable UI pieces used across many screens
│   │   └── ui/             # Tiny building blocks: Button, Card, Input...
│   ├── features/           # Self-contained features (only if the app grows)
│   │   └── auth/           # e.g. everything about login lives together here
│   ├── hooks/              # Reusable custom hooks (useSomething)
│   ├── services/           # Talking to APIs / the outside world
│   ├── lib/                # Setup for libraries (api client, etc.)
│   ├── constants/          # App-wide fixed values (colors keys, strings)
│   ├── theme/              # Colors, spacing, font sizes (the design system)
│   ├── types/              # Shared TypeScript type definitions
│   └── utils/              # Small helper functions (formatDate, etc.)
│
├── assets/                 # Images, fonts, icons
├── AGENTS.md               # This file
├── app.json                # Expo config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies + scripts
```

**Rules:**
- **`app/` = screens only.** A file in `app/` should be thin: it lays out the screen and pulls the real logic from `src/`.
- **Put a file where its job lives.** A reusable button → `src/components/ui/`. A date formatter → `src/utils/`.
- **Start simple.** For a small app you may only need `components/`, `hooks/`, and `utils/`. Don't create empty folders "for later." Add `features/` only when the app gets big.
- **Co-locate.** Keep a file's test and styles next to it (e.g. `format-date.ts` and `format-date.test.ts` together).

---

## 4. Naming conventions

Consistency matters more than personal taste. Follow these exactly:

| What | Style | Example |
|---|---|---|
| Component files | PascalCase | `ProfileCard.tsx` |
| Components | PascalCase | `function ProfileCard() {}` |
| Screen/route files | lowercase | `profile.tsx`, `index.tsx` |
| Non-component files | kebab-case | `format-date.ts`, `use-auth.ts` |
| Folders | kebab-case | `user-profile/`, `chat-screen/` |
| Variables & functions | camelCase | `userName`, `handlePress()` |
| Booleans | `is` / `has` / `can` prefix | `isLoading`, `hasError`, `canSubmit` |
| Event handlers | `handle` prefix | `handleSubmit`, `handlePressLogin` |
| Custom hooks | `use` prefix | `useAuth`, `useCart` |
| Constants (true fixed values) | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| Types & interfaces | PascalCase | `type User`, `interface CartItem` |

---

## 5. Components: how to write them

- **Always use function components + hooks.** No class components.
- **One component per file** (a small helper only used inside can stay in the same file).
- **Keep components focused.** If a component is doing layout *and* data fetching *and* business logic, split it. Move logic into a custom hook or a `src/services` function.
- **Type your props** with a TypeScript `type` or `interface`. Never leave props untyped.
- **Small is good.** If a screen file is getting long, break it into smaller components.

Example of the shape to aim for:

```tsx
// src/components/ui/PrimaryButton.tsx
import { Text, Pressable, StyleSheet } from 'react-native';

// Props = the inputs a component receives, like function arguments.
type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean; // the "?" means optional
};

export function PrimaryButton({ title, onPress, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 12, borderRadius: 8, backgroundColor: '#2563eb' },
  text: { color: 'white', textAlign: 'center', fontWeight: '600' },
});
```

**Rules the agent should follow when generating components:**
- Explain each new prop and any new hook the first time it shows up.
- Prefer `Pressable` for tappable things (it's the current recommended one).
- Don't nest deeply. If you're 5+ `<View>`s deep, extract a component.

---

## 6. Styling

- Use **`StyleSheet.create`** at the bottom of the file. Don't scatter inline styles everywhere (a one-off dynamic style is fine).
- **No hard-coded colors or spacing repeated everywhere.** Pull shared values from `src/theme/` (e.g. `colors.primary`, `spacing.md`) so the whole app stays consistent and easy to re-theme.
- Keep style names descriptive: `container`, `title`, `cardImage` — not `view1`, `text2`.
- **No emojis in UI text** (buttons, titles, labels, alerts). Use vector icons (`@expo/vector-icons` Ionicons) instead.
- Use Flexbox for layout (that's how React Native positions things). Explain flex properties (`flex`, `justifyContent`, `alignItems`) the first time.

---

## 7. State & data

- **Local state:** use `useState` for simple values that belong to one screen/component.
- **Shared app state:** start with React **Context**. Only reach for a bigger library (like Zustand) if Context gets painful — and explain why first.
- **Server data (from an API):** keep fetching logic in `src/services/`. Handle the three states every time: **loading**, **error**, and **success**. Never show a blank screen while data loads.
- **Never put secrets (API keys, passwords) in the code.** Use environment variables via Expo (`.env` / `app.config`), and explain how. Secrets never get committed to Git.

Every data fetch must handle all three cases:

```tsx
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message="Couldn't load your profile." />;
return <ProfileView user={user} />;
```

---

## 8. Error handling

- **Wrap risky operations** (network calls, JSON parsing, storage) in `try / catch`.
- **Never leave an empty `catch`.** At minimum, log it and show the user a friendly message.
- **Show human messages**, not raw errors. The user sees "Something went wrong, please try again," not `TypeError: undefined`.
- **Validate inputs** before using them (e.g. check a text field isn't empty before submitting).

---

## 9. Performance (keep the app smooth)

- **Long lists → `FlatList` / `FlashList`**, never `.map()` inside a `ScrollView` for big lists. Always give a `keyExtractor`.
- **Images:** use `expo-image`, and size/compress assets. Prefer WebP where possible.
- **Don't do heavy work on every render.** Keep expensive calculations out of the render path; reach for `useMemo` / `useCallback` only when there's a real, measured slowdown (don't sprinkle them everywhere "just in case").
- **Keep `keys` stable and unique** in lists — never use the array index if items can reorder.

Explain any optimization you add; don't optimize prematurely.

---

## 10. TypeScript rules

- **No `any`.** If you're tempted to use `any`, define a proper type instead. If a type is truly unknown, use `unknown` and narrow it — and explain the difference.
- **Type function inputs and outputs.**
- **Put shared types in `src/types/`;** keep a type next to its component if only that component uses it.
- Let TypeScript help you: if it shows a red squiggle, that's a real problem to fix, not to silence with `// @ts-ignore`.

---

## 11. Comments & documentation

- **Comment the *why*, not the *what*.** Good code already shows what it does; comments explain the reasoning that isn't obvious.
- Bad: `// set loading to true` — Good: `// keep the button disabled so the user can't double-submit`
- Remove commented-out code before finishing.
- If a function is non-obvious, add a short note above it describing what it does and what it returns.

---

## 12. Git & commits

- **Commit small and often**, one logical change per commit.
- Write clear messages in the form `type: short description`, e.g.:
  - `feat: add login screen`
  - `fix: stop crash when profile image is missing`
  - `refactor: split ProfileScreen into smaller components`
  - `docs: update AGENTS.md`
- **Never commit secrets, `.env` files, or `node_modules`.** Make sure `.gitignore` covers them.
- Explain any git command you tell me to run.

---

## 13. Security & privacy basics

- No secrets in code or Git (see §7 and §12).
- Don't log sensitive data (passwords, tokens) to the console.
- Only install well-known, maintained libraries. If you suggest a package, mention roughly how popular/maintained it is and what it's for.
- Ask before adding anything that requests device permissions (camera, location, contacts) and explain why it's needed.

---

## 14. Accessibility (a11y)

- Give tappable elements an `accessibilityRole` and a label (`accessibilityLabel`) so screen readers work.
- Ensure text has readable contrast against its background.
- Don't rely on color alone to signal meaning (e.g. errors get an icon or text, not just red).

---

## 15. Testing (lightweight, since I'm learning)

- Not everything needs a test yet. Focus tests on **pure logic** in `utils/` and important behavior.
- Keep test files next to the code they test: `format-date.test.ts` beside `format-date.ts`.
- When you add a test, explain what it checks and how to run it (e.g. `npm test`).

---

## 16. How the agent should respond to me (workflow)

For any non-trivial task, follow this order:

1. **Restate** what I asked in one sentence, so I know we agree.
2. **Plan:** list the steps you'll take (short bullets).
3. **Flag risks** or decisions (e.g. "this needs a new library — ok?"). Pause if it's irreversible or ambiguous.
4. **Do the work,** creating/editing files with full paths shown.
5. **Explain what changed** in plain English and **how to run/test it** (exact commands).
6. **Tell me what to check** to confirm it works, and how to undo it if needed.

Keep answers focused. Don't overwhelm me with ten new topics at once.

---

## 17. Things to NEVER do

- ❌ Don't use class components.
- ❌ Don't use `any` in TypeScript.
- ❌ Don't leave empty `catch` blocks or swallow errors.
- ❌ Don't hard-code secrets or API keys.
- ❌ Don't add a big dependency without asking and explaining.
- ❌ Don't put business logic directly in `app/` screen files.
- ❌ Don't use array index as a list `key` when items can change order.
- ❌ Don't leave commented-out code or unused imports/variables.
- ❌ Don't make big, unexplained changes across many files at once.
- ❌ Don't assume I understand jargon — explain it.

---

## 18. Quick command reference

> The agent should confirm these match my setup, since they can change per project.

```bash
npx expo start          # Start the app in development (opens a QR code)
npx expo start --clear  # Start fresh if things act weird (clears cache)
npm install <package>   # Add a library (agent must explain what it's for)
npx tsc --noEmit        # Check for TypeScript errors without building
npm test                # Run tests (if set up)
```

---
---

## 19. Change Timeline (MANDATORY)

Every AI coding agent working in this repository must maintain a project change log in a file named:

```
TIMELINE.md
```

This file is the project's running history and should always reflect the latest state of development.

### When to update it

After completing **any task that changes the project**, the agent MUST update `TIMELINE.md` before finishing its response.

This includes:

- Creating files
- Deleting files
- Renaming files
- Refactoring
- Adding features
- Bug fixes
- Dependency changes
- Configuration changes
- Documentation updates

Pure discussion that produces no code does **not** require an update.

### Required format

Every entry should include:

- Date and time
- Short title
- Files changed
- Summary of what changed
- Why the change was made

Example:

```md
# Project Timeline

## 2026-07-12 14:35 UTC

### Added Login Screen

**Files**
- app/login.tsx
- src/components/ui/PrimaryButton.tsx

**Summary**
Implemented the first login screen with email and password fields.

**Reason**
Provides the authentication entry point requested by the user.
```

---

### Current Project State

At the very top of `TIMELINE.md`, maintain a short summary of the latest state of the project.

Example:

```md
# Current State

Latest Change:
Added Login Screen

Current Focus:
Building authentication flow.

Last Modified:
2026-07-12 14:35 UTC

Next Expected Step:
Connect login screen to backend API.
```

This section must always describe the project's current state after the latest completed task.

---

### Agent Requirements

Before making changes, the agent should:

1. Read `TIMELINE.md`.
2. Understand the latest project state.
3. Continue from the most recent recorded work instead of rediscovering context.

After making changes, the agent must:

1. Update the "Current State" section.
2. Append a new timeline entry.
3. Ensure the newest entry is at the top (reverse chronological order).

---

### Important Rule

`TIMELINE.md` is considered part of the project documentation.

Agents must never overwrite previous history.

Only append new entries and update the "Current State" summary.

The timeline should always allow someone to answer:

- What was the last change?
- Why was it made?
- Which files changed?
- What should happen next?

without reading the entire codebase.

*Golden rule again: I'm a beginner. Explain, keep it simple, and go one step at a time.*
