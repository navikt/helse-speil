# Speil

[![Known Vulnerabilities](https://snyk.io/test/github/navikt/helse-speil/badge.svg)](https://snyk.io/test/github/navikt/helse-speil)
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

### Kun frontend servert av Parcel

```
npm start
```

Dersom du er på macOS og ønsker appen startet i Chrome:

```
npm run start-mac
```

### Backend som server både API og frontend som statiske filer

Lag en `.env`-fil med følgende innhold i rotkatalogen:

```
TENANT_ID=<Azure tenant id>
REDIRECT_URL=http://localhost:3000/callback
SESSION_SECRET=whatever
SPESIALIST_BASE_URL=http://localhost:9001
```

Starte backend:

```
npm run dev-express
```

### Bygge bundles

For å bygge/pakke frontend:

```
npm run build
```

For å bygge/pakke backend:

```
npm run build-server
```

Appen er nå tilgjengelig på http://localhost:3000.

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

Interne henvendelser kan sendes via Slack i kanalen #team-bømlo-værsågod.
