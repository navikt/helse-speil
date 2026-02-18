# Copilot Instructions — helse-speil

Speil is a sickness benefit case processing tool ("saksbehandlerverktøy for sykepenger") for NAV, the Norwegian Labour and Welfare Administration. The UI is in Norwegian.

## Commands

```bash
pnpm install          # Install dependencies (requires NPM_AUTH_TOKEN for @navikt packages)
pnpm run dev          # Start dev server on port 1234 (uses Turbopack)
pnpm run build        # Production build (Next.js standalone)
pnpm run lint         # ESLint
pnpm run lint:fix     # ESLint with auto-fix
pnpm run tsc          # Type-check
pnpm run test         # Run all tests (Vitest)
pnpm run test -- src/utils/date.test.ts              # Run a single test file
pnpm run test -- --testNamePattern="rendrer"          # Run tests matching a name pattern
pnpm run test:watch                                   # Watch mode
pnpm run generate-graphql   # Regenerate GraphQL types (requires local spesialist running)
pnpm run generate-rest      # Regenerate REST types and React Query hooks via Orval
```

## Architecture

### Next.js App Router with separate route components

The app uses **Next.js 16 App Router**. Page layouts and routing live under `src/app/`, but the actual UI components for each route live under `src/routes/` (e.g., `src/routes/saksbilde/`, `src/routes/oversikt/`). App Router pages in `src/app/` are thin wrappers that render components from `src/routes/`.

The main routes are:
- `/` — Task overview (`src/routes/oversikt/`)
- `/person/[personPseudoId]/*` — Case view ("saksbilde") with sub-routes for daily overview, eligibility criteria, sickness benefit basis, assessment criteria, and additional income

### API layer: REST (React Query / Orval) — GraphQL is being phased out

The app communicates with the backend ("spesialist") via two mechanisms, but **GraphQL is being phased out in favor of REST**. New features should always use REST.

- **REST** via TanStack React Query (preferred) — generated hooks and types in `src/io/rest/generated/` from an OpenAPI spec using Orval
- **GraphQL** via Apollo Client (legacy, being removed) — queries/mutations in `src/io/graphql/*.graphql`, with generated types in `src/io/graphql/generated/graphql.ts`

Both `src/io/graphql/generated/` and `src/io/rest/generated/` are auto-generated. Never edit these files manually.

### Backend proxy pattern

REST API routes under `src/app/api/spesialist/` act as a proxy: in local dev they return mock data from `src/spesialist-mock/`, in deployed environments they forward requests to the real spesialist backend with OBO (On-Behalf-Of) token exchange. This is handled by `stubEllerVideresendTilSpesialist` in `src/app/api/spesialist/common.ts`.

### State management: Jotai

Client-side state is managed with **Jotai** atoms (not Redux or Zustand). Atoms live in `src/state/`. Helper functions `atomWithSessionStorage` and `atomWithLocalStorage` in `src/state/jotai.ts` provide persistent storage variants. The provider tree in `src/app/providers.tsx` wraps Apollo, React Query, Jotai, and theme providers.

### Environment configuration

Environment variables are validated with Zod schemas in `src/env.ts`. `erLokal` / `erDev` / `erProd` flags control environment-specific behavior. `browserEnv` is available client-side; `getServerEnv()` is server-only and lazily validated.

## Conventions

### Path aliases

Always use path aliases for imports (enforced by `eslint-plugin-import-alias`). Relative imports are only allowed within the same directory (depth 1). Key aliases:

- `@/` → `src/`
- `@components/`, `@hooks/`, `@io/`, `@state/`, `@utils/`, `@routes/`, `@typer/` → corresponding `src/` subdirectories
- `@saksbilde/` → `src/routes/saksbilde/`
- `@oversikt/` → `src/routes/oversikt/`
- `@test-utils`, `@test-wrappers`, `@test-data/` → test helpers in `src/test/`

### Testing

Tests use **Vitest** with **Testing Library** and **vitest-axe** for accessibility checks. Import `render`, `renderHook`, and `screen` from `@test-utils` (not directly from `@testing-library/react`) — this custom wrapper auto-provides Apollo MockedProvider, React Query client, Jotai provider, and BrukerContext. You can pass `mocks`, `initialQueries`, and `atomValues` as options to `render()`.

`next/navigation` is globally mocked via `next-router-mock` in `vitest.setup.tsx`.

### Form validation

Form schemas use **Zod v4** (imported as `zod/v4`) with **react-hook-form** and `@hookform/resolvers`. Schemas live in `src/form-schemas/`.

### Styling

Uses **Tailwind CSS v4** with NAV's design system (`@navikt/ds-react`, `@navikt/ds-css`, `@navikt/ds-tailwind`). Some components also use CSS Modules (`.module.css` / `.module.scss`). The `classnames` and `tailwind-merge` packages are available for composing class names.

### Code formatting

Prettier is configured with 4-space indentation, single quotes, 120 char print width, trailing commas, and automatic import sorting via `@trivago/prettier-plugin-sort-imports`. Import order: globals → third-party → `@navikt/*` → project aliases → relative imports → styles.

### React Compiler

The React Compiler is enabled (`reactCompiler: true` in `next.config.ts`). This means manual `useMemo`/`useCallback` is generally unnecessary.
