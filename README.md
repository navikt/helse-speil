# Speil

[![Actions Status](https://github.com/navikt/helse-speil/workflows/master/badge.svg)](https://github.com/navikt/helse-speil/actions)

Saksbehandlerverktøy for sykepenger.

## Kodeformatering

Dette repoet bruker [prettier](https://prettier.io/) med [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
for å sikre at all koden er på likt format. Hvordan utviklerne velger å overholde disse reglene er opp til den enkelte, men
Prettier kan settes opp til å formatere kode automatisk on-save. Hvordan dette konfigureres avhenger av IDE / Editor.

-   [File Watchers i IntelliJ / WebStorm](https://prettier.io/docs/en/webstorm.html)
-   [Plugin for VSCode](https://github.com/prettier/prettier-vscode)

## Kjøre lokalt

Lokalt serveres frontend (det som kjører i browser) og backend (det som står for autentisering, sesjon og kommunikasjon med baksystem) hver for seg.

### Opprett fil med miljøvariabler

```shell
echo "SPESIALIST_BASE_URL=http://127.0.0.1:9001" > packages/backend/.env
```

### Både frontend og backend med én kommando

```
npm run dev
```

### Kjør spesialistbackenden slik:

```
npm run mock
```

### Kun frontend servert av Vite

Fra `packages/frontend`:

```
npm run dev
```

### Backend som server både API og frontend som statiske filer

Lag eller utvid en `.env`-fil med følgende innhold i `packages/backend`:

```
TENANT_ID=<Azure tenant id>
REDIRECT_URL=http://localhost:3000/callback
SESSION_SECRET=whatever
SPESIALIST_BASE_URL=http://localhost:9001
```

Fra `packages/backend`:

```
npm run dev
```

Appen er nå tilgjengelig på http://localhost:3000.

### Bygge bundles

```
npm run build
```

### Hente oppdaterte graphql-typer fra Spesialist

```
npm run generate-graphql
```

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

Interne henvendelser kan sendes via Slack i kanalen #team-bømlo-værsågod.
