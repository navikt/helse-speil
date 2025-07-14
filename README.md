# Speil

[![Actions Status](https://github.com/navikt/helse-speil/workflows/master/badge.svg)](https://github.com/navikt/helse-speil/actions)

Saksbehandlerverktøy for sykepenger.

## Kodeformatering

Dette repoet bruker [prettier](https://prettier.io/)
med [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
for å sikre at all koden er på likt format. Hvordan utviklerne velger å overholde disse reglene er opp til den enkelte,
men
Prettier kan settes opp til å formatere kode automatisk on-save. Hvordan dette konfigureres avhenger av IDE / Editor.

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

Lokal utvikling bruker nextjs dev server, denne kan spinnes opp med følgende kommando:

```shell
npm run dev
```

Appen vil være tilgjengelig på http://localhost:1234.

Default i lokal utvikling er at Apollo går mot spesialist-mock på /api/spesialist.

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
npm run build
```

## Hente og oppdaterte GraphQL-typer

Schema hentes fra spesialist på lokal maskin. Før man kjører skriptet for å generere GraphQL-typer, må man starte
spesialist på lokal maskin (se etter fila LocalApp.kt). `generate-graphql` henter først et token fra spesialist og gjør
deretter et autentisert introspection-kall.

For å generere DocumentNodes som brukes i apollo queries og mutations må man først skrive en GraphQL spørring
i [GraphQL mappen](src/io/graphql).

**Kommando for å oppdatere GraphQL-typer:**

```shell
npm run generate-graphql
```

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

Interne henvendelser kan sendes via Slack i kanalen [#team-bømlo-værsågod](https://nav-it.slack.com/archives/C019637N90X).
