# Speil

[![Actions Status](https://github.com/navikt/helse-speil/workflows/main/badge.svg)](https://github.com/navikt/helse-speil/actions)

Saksbehandlerverktøy for sykepenger.

## Kodeformatering

Dette repoet bruker [prettier](https://prettier.io/)
med [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
for å sikre at all koden er på likt format. Hvordan utviklerne velger å overholde disse reglene er opp til den enkelte,
men
Prettier kan settes opp til å formatere kode automatisk on-save. Hvordan dette konfigureres avhenger av IDE / Editor.

## Gi tilgang til Speil i dev (aka preprod) via AD:

Vedkommende som ønsker tilgang må:

- Være medlem av minst en av gruppene som er spesifisert under `spec.azure.application.claims.groups`

## Forutsetninger

### Sett opp tilgang til Github Package Registry

For å kunne laste dependencies fra Github Package Registry
må du ha et Github Personal Access satt i miljøvariabelen `NPM_AUTH_TOKEN`.

Dette tokenet trenger scopet `read:packages`. Husk å trykke Configure SSO for navikt.

Legg til følgende i `~/.bashrc` eller `~/.zshrc`:

```shell
export NPM_AUTH_TOKEN=<token>
```

## Utvikle lokalt

1. Sørg for at du har riktig versjon av node (se package.json), f.eks. med [nvm](https://github.com/nvm-sh/nvm) eller [mise](https://mise.jdx.dev).
2. Installer prosjektet - `pnpm install`
3. Kjør Speil lokalt med next dev server - `pnpm run dev`

Default i lokal utvikling er at Apollo går mot spesialist-mock på /api/spesialist.

Kjør precommit hooks manuelt - `.husky/pre-commit`

### Utvikle lokalt mot lokalt kjørende backend

| Script                      | Spesialist     | Sporhund       |
| --------------------------- | -------------- | -------------- |
| `pnpm run dev`              | mocked (stub)  | mocked (stub)  |
| `pnpm run lokal-backend`    | localhost:8080 | localhost:8282 |
| `pnpm run lokal-spesialist` | localhost:8080 | mocked (stub)  |
| `pnpm run lokal-sporhund`   | mocked (stub)  | localhost:8282 |

### Legge til en testperson lokalt:

1. Kjør `pnpm run import-testperson` og følg instruksjonene

## Bygge for produksjon lokalt

Dersom du vil teste produksjonsbygget lokalt, må du først flytte over tilhørende miljøvariabler til `.env.production` i
root.

```shell
cp envs/.env.dev .env.production
```

eller

```shell
cp envs/.env.production .env.production
```

Deretter kan nextjs produksjonsbygg kjøres med:

```shell
pnpm run build
```

## Hente og oppdaterte GraphQL-typer

Schema hentes fra spesialist på lokal maskin. Før man kjører skriptet for å generere GraphQL-typer, må man starte
spesialist på lokal maskin (se etter fila LocalApp.kt). `generate-graphql` henter først et token fra spesialist og gjør
deretter et autentisert introspection-kall.

For å generere DocumentNodes som brukes i apollo queries og mutations må man først skrive en GraphQL spørring
i [GraphQL mappen](src/io/graphql).

**Kommando for å oppdatere GraphQL-typer:**

```shell
pnpm run generate-graphql
```

## Oppdatere REST-typer og genererte Tanstack Query-hooks

OpenAPI-spec kan hentes fra spesialist eller sporhund på lokal maskin (Eller begge). Først må man starte spesialist eller sporhund på lokal maskin (se etter fila LocalApp.kt).
OpenAPI-spec'en når man kjører lokalt krever ikke autentisering.

**Kjør så kommandoen:**

```shell
pnpm run generate-rest # krever at både spesialist og sporhund kjører lokalt
```

```shell
pnpm run generate-rest:spesialist # krever at spesialist kjører lokalt
```

```shell
pnpm run generate-rest:sporhund # krever at sporhund kjører lokalt
```

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

Interne henvendelser kan sendes via Slack i kanalen [#team-sas-værsågod](https://nav-it.slack.com/archives/C019637N90X).
