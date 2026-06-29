# Frontend Platter

A **starter platter (boilerplate)** for spinning up new frontend projects fast.
It's an opinionated, production-ready Next.js scaffold — clone it, rename a few
things, and start building features instead of wiring up infrastructure.

It ships with a feature-sliced architecture, i18n, theming, state management,
auth scaffolding, a component/design layer, testing, CI, and Docker-based
deployment to a self-hosted server — all pre-configured.

> Not a deployed product. This repo is the seed you copy into real projects.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, `output: standalone`) |
| UI | React 19, TypeScript 6 (strict) |
| Components | MUI 9 + [`@awaymess/ui`](https://www.npmjs.com/package/@awaymess/ui) (MUI re-themed) |
| State | Redux Toolkit + React Redux |
| i18n | next-intl (`th` default, `en`) |
| Forms | react-hook-form + zod |
| Charts | amCharts 5 |
| Data | axios, socket.io-client |
| Mocking | MSW |
| Docs | Storybook 10 |
| Tests | Vitest (unit) |

## Quick start

Requirements: **Node 24** (matches CI and the Docker image) and npm.

```bash
git clone <repo-url>
cd frontend-platter

cp .env.example .env        # then fill in values
npm install
npm run dev                 # http://localhost:3000  →  redirects to /th
```

The app is locale-prefixed, so the entry routes are `/th` and `/en`
(e.g. `/th/login`, `/th/dashboard`).

## Environment variables

Copy `.env.example` to `.env`. Never commit `.env` (it's gitignored).

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | REST API base URL (client). Inlined at build time. |
| `API_URL` | REST API base URL (server-side). |
| `NEXT_PUBLIC_SOCKET_URL` | socket.io endpoint. Inlined at build time. |
| `JWT_SECRET` | Secret for verifying auth tokens. **Change in every project.** |
| `NEXT_PUBLIC_PORTAL_LOGIN_URL` | External portal login redirect. |
| `NEXT_PUBLIC_APP_NAME` | App display name. |
| `NEXT_PUBLIC_APP_URL` | Public base URL of the app. |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default locale (`th`). |
| `DISABLE_AUTH_MIDDLEWARE` | `true` skips the auth middleware (handy for local dev). |

> `NEXT_PUBLIC_*` values are baked in at **build time**. For Docker builds, pass
> them as build args (see Deployment), not just runtime env.

## Scripts

```bash
npm run dev              # start dev server (Turbopack)
npm run build            # production build (standalone output)
npm run start            # serve the production build
npm run lint             # eslint (src + .storybook)
npm run typecheck        # tsc --noEmit
npm run test             # unit tests (alias of test:unit)
npm run test:unit        # vitest unit project
npm run storybook        # storybook dev server on :6006
npm run build-storybook  # static storybook build
```

## Project structure

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
├─ providers/                        # App-level React providers (theme, redux)
├─ store/                            # Redux store + slices
├─ i18n/                             # next-intl routing/request setup
├─ locales/                          # Translation JSON (th, en)
├─ config/                           # App configuration constants
├─ lib/                              # Shared service utilities (api/auth/format)
├─ styles/                           # Global styles and tokens
├─ types/                            # Shared type contracts
└─ utils/                            # Small utility helpers
```

### Layer rules

1. `app` can import from `features`, `widgets`, `hooks`, `providers`, `config`, `i18n`.
2. `features` can import from `widgets` (if needed), `hooks`, `store`, `lib`, `types`, `utils`.
3. `widgets` should not depend on route files.
4. Keep route files thin — prefer `export { default } from '@/features/...';`.
5. New domain work always starts in `src/features/<domain>`.

### Adding a feature

1. Create `src/features/<name>/ui`.
2. Add domain logic in `model` or `service` subfolders (inside the feature).
3. Mount it from an `app` route file.
4. Reuse shell pieces from `widgets`.

**Why this scaffold:** clear separation between route orchestration and business
UI, lower coupling, easier per-feature ownership, and safe growth without file
chaos.

## Storybook

Run `npm run storybook`. Stories ship for the core building blocks:

- `Table`: `src/widgets/table/ui/basic-table.stories.tsx`
- `amChart`: `src/lib/amcharts/ChartWrapper.stories.tsx`
- `API`: `src/lib/api.stories.tsx`
- `Format`: `src/lib/format.stories.tsx`
- `Utilities & Libraries`: `src/utils/utilities-libraries.stories.tsx`

## CI

`.github/workflows/ci.yml` runs on every pull request and on push to `main`:
`lint` → `typecheck` → unit tests → `build` (GitHub-hosted, a few minutes).

## Deployment

The deploy config ships with safe `localhost` defaults that build and run as-is.
It targets a self-hosted server that builds the repo with Docker behind Traefik,
triggered by a deploy webhook on push to `main`.

Files:
- `Dockerfile` — multi-stage build producing a Next standalone runtime image.
- `docker-compose.yml` — Traefik labels on the shared `proxy` network.
- `.github/workflows/deploy.yml` — POSTs to the platform deploy webhook
  (slug derived from the repo name), on a self-hosted runner.

### When you clone this into a real project

1. **`docker-compose.yml`** — rename the service, `container_name`, the two
   Traefik router/service names, and set the real `Host(...)` domain + the
   `NEXT_PUBLIC_*` build args.
2. **`Dockerfile`** — (optional) update the `ARG NEXT_PUBLIC_*` defaults.
3. **`deploy.yml`** — no edit needed: the webhook slug comes from
   `${{ github.event.repository.name }}`.
4. **Server side** — register a self-hosted runner for the repo (personal-account
   runners are per-repo), add the `WEBHOOK_SECRET` GitHub secret, and make sure
   the platform knows the `/webhooks/deploy/<repo>` route.
5. **Enable deploy** — set the repo variable `DEPLOY_ENABLED=true`
   (Settings → Secrets and variables → Actions → Variables). Until then the
   deploy job is skipped, so it never queues waiting for a runner.

> The platter repo itself does not deploy: `DEPLOY_ENABLED` is unset, so the
> `deploy.yml` job is skipped on every push to `main`.
