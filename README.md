# Frontend Platter

Production-ready frontend scaffold on Next.js App Router, optimized for team scaling.

## Tech

- Next.js 16
- React 19
- TypeScript (strict)
- MUI + Awaymess UI
- Redux Toolkit
- next-intl

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run storybook
npm run build-storybook
npm run storybook:test
```

## Senior FE Structure

```txt
src/
├─ app/                              # Routing and route composition only
│  ├─ [locale]/
│  │  ├─ (auth)/                     # Auth route group
│  │  └─ (dashboard)/                # Dashboard route group
│  ├─ layout.tsx                     # Global providers + metadata
│  └─ not-found.tsx
├─ features/                         # Business/domain slices
│  ├─ auth/ui/
│  ├─ dashboard/ui/
│  └─ settings/ui/
├─ widgets/                          # Cross-feature composed UI blocks
│  ├─ dashboard-shell/ui/            # Navbar/Sidebar shell
│  └─ feedback/                      # Error boundary and app-level feedback
├─ hooks/                            # Reusable app hooks
├─ store/                            # Redux store + slices
├─ i18n/                             # next-intl routing/request setup
├─ locales/                          # Translation JSON
├─ config/                           # App configuration constants
├─ lib/                              # Shared service utilities (api/auth/format)
├─ styles/                           # Global styles and tokens
├─ types/                            # Shared type contracts
└─ utils/                            # Small utility helpers
```

## Layer Rules

1. `app` can import from `features`, `widgets`, `hooks`, `providers`, `config`, `i18n`.
2. `features` can import from `widgets` (if needed), `hooks`, `store`, `lib`, `types`, `utils`.
3. `widgets` should not depend on route files.
4. Keep route files thin:
   - prefer `export { default } from '@/features/...';`
5. New domain work always starts in `src/features/<domain>`.

## Feature Workflow

For a new feature:

1. Create `src/features/<name>/ui`.
2. Add domain logic in `model` or `service` subfolders (inside the feature).
3. Mount it from an `app` route file.
4. Reuse shell pieces from `widgets`.

## Why this scaffold

- Clear separation between route orchestration and business UI.
- Lower coupling and easier ownership per feature team.
- Safe growth path without file chaos.

## Storybook Coverage

The scaffold includes Storybook docs/stories for:

- `Table`: `src/widgets/table/ui/basic-table.stories.tsx`
- `amChart`: `src/lib/amcharts/ChartWrapper.stories.tsx`
- `API`: `src/lib/api.stories.tsx`
- `Format`: `src/lib/format.stories.tsx`
- `Utilities & Libraries`: `src/utils/utilities-libraries.stories.tsx`
