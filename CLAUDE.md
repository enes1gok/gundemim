# Gündemim — CLAUDE.md

## Project Purpose

Gündemim, Türk kullanıcılar için günlük anonim anket uygulamasıdır. Her gün bir soruya oy verilir,
demografik analizler görülür. Kişisel veri toplanmaz, her cihaz anonim bir ID ile takip edilir.

## Architecture

- **Routing**: Expo Router 5 (file-based). Groups: `(main)`, `(onboarding)`, `(admin)`
- **State**: Zustand (`stores/`) for user profile and admin auth. React Query for server data.
- **Backend**: Supabase (Postgres + Edge Functions). Client at `lib/supabase.ts`.
- **Theme**: Token-based system in `theme/`. No ThemeContext — each component reads
  `useColorScheme()` and selects `darkColors | lightColors` inline.

## Tech Stack

React Native 0.79 · Expo 53 · Expo Router 5 · TypeScript 5.8 · Zustand 5 ·
React Query 5 · Supabase JS 2 · Moti · Reanimated 3 · Expo Haptics · Plus Jakarta Sans

## Design Philosophy: Premium Black & White

Inspired by Uber's design language. Non-negotiable principles:

1. **Monochrome first** — no decorative color. Only `accent` (white/black), semantic colors
   (success/error/warning), and muted category dots.
2. **Negative space** — generous padding. `spacing.screen = 24`, never less.
3. **Typographic hierarchy** — display: 48px/extraBold, h1: 36px/extraBold, h2: 30px/bold.
   Tight letter spacing on headings (`letterSpacing.tight = -1`).
4. **Hairline borders** — always 1px `colors.border`. Never 2px+ for structural containers.
5. **No gradients, no shadows** — flat surfaces only.
6. **Precise micro-interactions** — Moti/Reanimated for meaningful state transitions only.
7. **Rectangular buttons** — `radius.md` (12px), never pill shape for primary actions.

## Using Theme Tokens

```typescript
import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { fonts, fontSizes, letterSpacing, lineHeights } from '@/theme/typography';

// Inside component:
const scheme = useColorScheme();
const colors = scheme === 'dark' ? darkColors : lightColors;
```

### Color Token Reference

| Token             | Dark    | Light   | Use case                        |
|-------------------|---------|---------|---------------------------------|
| `background`      | #09090B | #FFFFFF | Screen background               |
| `surface`         | #18181B | #FAFAFA | Cards, inputs                   |
| `surfaceAlt`      | #27272A | #F4F4F5 | Selected bg, secondary surfaces |
| `surfaceElevated` | #3F3F46 | #E4E4E7 | Tertiary elements               |
| `accent`          | #FFFFFF | #09090B | CTAs, active indicators, fills  |
| `text`            | #FAFAFA | #09090B | Primary text                    |
| `textMuted`       | #A1A1AA | #71717A | Secondary text, labels          |
| `textFaint`       | #71717A | #A1A1AA | Hints, placeholders, icons      |
| `border`          | #27272A | #E4E4E7 | Hairline borders                |
| `divider`         | #18181B | #F4F4F5 | Section separators              |

### DO NOT

- Use `colors.brand`, `colors.brandDim`, `colors.brandLight` — these tokens no longer exist.
- Hardcode hex colors except `#000000` and `#FFFFFF` for accent inversion.
- Use `borderWidth > 1` on structural containers.
- Add decorative gradients or drop shadows.
- Use `radius.full` (pill) for primary action buttons.

## Accent-Inverted Text Pattern

When rendering text on a filled accent background (primary buttons, selected cards):

```typescript
const accentTextColor = scheme === 'dark' ? '#000000' : '#FFFFFF';
```

## Selected State Pattern

```typescript
// Strong selection (primary action, full fill):
backgroundColor: isSelected ? colors.accent : colors.surface,
borderColor: isSelected ? colors.accent : colors.border,
// text:
color: isSelected ? accentTextColor : colors.text,

// Subtle selection (secondary, surfaceAlt fill):
backgroundColor: isSelected ? colors.surfaceAlt : colors.surface,
borderColor: isSelected ? colors.accent : colors.border,
```

## Section Label Pattern (uppercase field headers)

```typescript
<Typography
  variant="tiny"
  weight="semiBold"
  style={{ color: colors.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' }}
>
  FIELD LABEL
</Typography>
```

## Skeleton Loader Pattern

```typescript
<MotiView
  from={{ opacity: 0.3 }}
  animate={{ opacity: 0.7 }}
  transition={{ loop: true, type: 'timing', duration: 800, delay: index * 150 }}
  style={{ backgroundColor: colors.surfaceAlt, borderRadius: radius.md, height: 52 }}
/>
```

## Component Guidelines

1. Always accept `style?: StyleProp<ViewStyle>` for composition.
2. Read theme inline with `useColorScheme` — no context or prop drilling.
3. Use `MotiView` for animated state changes (bg/border color, scale).
4. Use `Reanimated` for performance-critical animations (progress bars, scroll-linked).
5. Haptics: `Light` for selections, `Medium` for primary actions, `Heavy` for destructive.
6. Always import from `@/theme` path alias, not relative `../../theme`.

## Coding Conventions

### TypeScript
- Strict mode enabled. Avoid `any` — justify with a comment if needed.
- Use `interface` for props, `type` for unions/utility types.

### Naming
- Components: PascalCase (`OptionButton.tsx`)
- Hooks: camelCase with `use` prefix (`useTodaySurvey.ts`)
- Stores: camelCase with `Store` suffix (`userStore.ts`)
- Constants: SCREAMING_SNAKE_CASE
- Types: PascalCase, no `I` prefix

### File Organization

```
components/
  ui/          — primitives: Button, Card, Typography, Tag, ProgressBar
  survey/      — survey flow: OptionButton, VoteCountBadge
  results/     — results: OptionResult, SimilarMinds, DemographicChart
  onboarding/  — onboarding: StepIndicator, InterestCard, OptionGrid, RegionPicker
app/
  (main)/      — authenticated main flow (tabs: Bugün, Arşiv)
  (onboarding)/ — first-run onboarding (welcome → demographics → interests)
  (admin)/     — hidden admin panel (5-tap logo secret trigger)
```

### Import Order

1. External: `react`, `react-native`, `expo-*`, third-party
2. Internal aliases: `@/theme`, `@/components`, `@/hooks`, `@/stores`
3. Relative: `../../`

## Git Workflow

- Branch naming: `feat/`, `fix/`, `chore/`, `design/`
- Commit format: `type(scope): description`
  - `design(theme): replace brand purple with monochrome accent tokens`
  - `feat(survey): add isSelected state to OptionButton`
- Keep commits atomic — one concern per commit
