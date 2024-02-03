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
cat > packages/backend/.env << EOF
SESSION_SECRET=whatever
SPESIALIST_BASE_URL=http://127.0.0.1:9001
FLEXJAR_BASE_URL=http://127.0.0.1:9001
MODIA_BASE_URL=http://127.0.0.1:9001
SPESIALIST_WS_URL=ws://127.0.0.1:9001
EOF
```

### Både frontend og backend med én kommando

```shell
npm run dev
```

### Kjør spesialistbackenden slik:

```shell
npm run mock
```

### Kun frontend servert av Vite

Fra `packages/frontend`:

```shell
npm run dev
```

### Backend som server både API og frontend som statiske filer

Sørg for at du har en .env-fil, se [her](#Opprett-fil-med-miljøvariabler).

Fra `packages/backend`:

```shell
npm run dev
```

Appen er nå tilgjengelig på http://localhost:3000.

### Bygge bundles

```shell
npm run build
```

### Hente og oppdaterte GraphQL-typer

Speil henter schema fra spesialist i dev. For å kunne hente snakke med spesialist må man først koble til naisdevice.

For å generere DocumentNodes som brukes i apollo queries og mutations må man først skrive en GraphQL spørring i [GraphQL mappen](packages/frontend/io/graphql).

**Kommando for å oppdatere GraphQL-typer:**

```shell
npm run generate-graphql
```

### Kjøre speil frontend mot LocalGraphQLApi i Spesialist

Finn filen `LocalGraphQLApi.kt` i Spesialist og kjør main-funksjonen.

Endre `baseUrl` fra `localhost:3000` til `0.0.0.0:4321` i `graphQLClient.ts` her i Speil.

Start speil med `npm run dev`

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

Interne henvendelser kan sendes via Slack i kanalen #team-bømlo-værsågod.
