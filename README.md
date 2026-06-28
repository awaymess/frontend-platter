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
npm run test
npm run test:unit
npm run storybook
npm run build-storybook
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

## CI

`.github/workflows/ci.yml` runs on every pull request and on push to `main`:
`lint` → `typecheck` → unit tests → `build` (GitHub-hosted, ~a few minutes).

## Deployment

This is a **starter platter** — the deploy config ships with safe `localhost`
defaults that build and run as-is. It targets a self-hosted server that builds
the repo with Docker behind Traefik, triggered by a deploy webhook.

Files: `Dockerfile` (Next standalone image), `docker-compose.yml` (Traefik
labels), `.github/workflows/deploy.yml` (POSTs to the platform deploy webhook
on push to `main`, on a self-hosted runner).

### When you clone this into a real project

1. **`docker-compose.yml`** — rename the service, `container_name`, the two
   Traefik router/service names, and set the real `Host(...)` domain + the
   `NEXT_PUBLIC_*` build args.
2. **`Dockerfile`** — (optional) update the `ARG NEXT_PUBLIC_*` defaults.
3. **`deploy.yml`** — no edit needed: the webhook slug is derived from the repo
   name via `${{ github.event.repository.name }}`.
4. **Server side** — register a self-hosted runner for the repo (personal-
   account runners are per-repo), add the `WEBHOOK_SECRET` GitHub secret, and
   make sure the platform knows the `/webhooks/deploy/<repo>` route.

> The platter repo itself does not deploy — `deploy.yml` only does something on
> a real project with a runner + webhook configured.

## Storybook Coverage

The scaffold includes Storybook docs/stories for:

- `Table`: `src/widgets/table/ui/basic-table.stories.tsx`
- `amChart`: `src/lib/amcharts/ChartWrapper.stories.tsx`
- `API`: `src/lib/api.stories.tsx`
- `Format`: `src/lib/format.stories.tsx`
- `Utilities & Libraries`: `src/utils/utilities-libraries.stories.tsx`
