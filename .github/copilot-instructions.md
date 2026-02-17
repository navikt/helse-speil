# Speil - Copilot Instructions

Speil is a case management tool for Norwegian welfare benefits (sykepenger/sick leave). This is a Next.js 15 application with TypeScript, Apollo GraphQL, and Jotai state management.

## Build, Test, and Lint Commands

```bash
# Development
npm run dev                    # Start dev server on http://localhost:1234 with Turbopack

# Build
npm run build                  # Production build
npm start                      # Start production server

# Testing
npm test                       # Run all tests with Jest
npm test -- <filename>         # Run specific test file
npm test -- --watch            # Run tests in watch mode

# Linting and Type Checking
npm run lint                   # Run ESLint
npm run tsc                    # Run TypeScript compiler

# GraphQL
npm run generate-graphql       # Regenerate GraphQL types (requires spesialist running locally on :8080)
```

## Architecture Overview

### Application Structure

- **Next.js App Router** - Uses Next.js 15 with the app router pattern (`src/app/`)
- **Route Components** - Main UI screens in `src/routes/` (oversikt, saksbilde)
- **GraphQL Backend** - Apollo Client talks to a GraphQL backend called "spesialist"
- **Local Mock** - Development mode uses mock GraphQL server at `/api/spesialist` (see `src/spesialist-mock/`)

### State Management

- **Jotai atoms** - Global state management with Jotai (`src/state/`)
- **Session/Local Storage** - Custom helpers: `atomWithSessionStorage()` and `atomWithLocalStorage()` in `src/state/jotai.ts`
- **Apollo Cache** - GraphQL data cached with custom type policies in `src/app/apollo/apolloClient.ts`

### Data Layer

- **GraphQL Operations** - All `.graphql` files in `src/io/graphql/` generate typed DocumentNodes
- **Code Generation** - `graphql-codegen` generates types in `src/io/graphql/generated/graphql.ts`
- **Custom Scalars** - Backend uses UUID, LocalDate, LocalDateTime, YearMonth, BigDecimal (all typed as string)

### Path Aliases

The project uses extensive TypeScript path aliases defined in `tsconfig.json`:

- `@/*` - src root
- `@app/*`, `@components/*`, `@hooks/*`, `@io/*`, `@state/*`, `@routes/*` - module paths
- `@saksbilde/*`, `@oversikt/*` - route-specific paths
- `@test-utils`, `@test-wrappers`, `@test-data/*`, `@apollo-mocks` - testing utilities

## Key Conventions

### Component Patterns

- **CSS Modules** - All styling uses CSS modules (`.module.css` or `.module.scss`)
- **Naming** - Component files are PascalCase, matching component name (e.g., `Arbeidsgivernavn.tsx`)
- **Client Components** - Use `'use client'` directive when needed for interactivity
- **Anonymizable Components** - Special wrappers for PII data (see `@components/anonymizable/`)

### Testing

- **Test Files** - Colocated with source: `*.test.ts` or `*.test.tsx`
- **Test Utils** - Import from `@test-utils` which re-exports Testing Library with custom `render()` that includes:
    - Apollo MockedProvider with error logging
    - Jotai Provider with initial atom values
    - Custom screen with `openPlayground()` helper
- **Mocking** - Use `mocks` prop for GraphQL, `atomValues` for initial Jotai state, `initialQueries` for Apollo cache

### GraphQL

- **Schema Source** - Generated from local spesialist backend (requires `LocalApp.kt` running)
- **Query Files** - Write `.graphql` files in `src/io/graphql/` subdirectories
- **Usage** - Import generated typed document nodes from `@io/graphql` barrel export
- **Fragments** - Fragment spreading is configured with `exportFragmentSpreadSubTypes: true`

### Code Style

- **Prettier** - All code formatted with Prettier (runs on pre-commit via husky/lint-staged)
- **Import Sorting** - Uses `@trivago/prettier-plugin-sort-imports`
- **Unused Variables** - Variables prefixed with `_` are ignored by ESLint
- **TypeScript** - Strict mode enabled with `noUncheckedIndexedAccess: true`

### Norwegian Conventions

- **Language** - Code and comments mix Norwegian and English
- **Domain Terms** - Key terms are in Norwegian: oppgave (task), saksbehandler (case worker), arbeidsgiver (employer), periode (period)
- **Organization Numbers** - "identifikator" for Norwegian organization numbers (9 digits)

## Environment Setup

### Prerequisites

- Node.js 22
- NPM_AUTH_TOKEN environment variable for GitHub Package Registry access (needs `read:packages` scope)

### Local Development

- Default: GraphQL mocked at `/api/spesialist`
- For real backend: Run spesialist locally and update environment config
- Environment files: `.env.development` and `.env.test` in root, or use files from `envs/` directory
