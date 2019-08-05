## Speil

[![CircleCI](https://circleci.com/gh/navikt/helse-speil.svg?style=svg)](https://circleci.com/gh/navikt/helse-speil)
[![Known Vulnerabilities](https://snyk.io/test/github/navikt/helse-speil/badge.svg)](https://snyk.io/test/github/navikt/helse-speil)

Verktøy for innsyn i behandling av sykepenger. Utvikler seg kanskje til et nytt "ordentlig" saksbehandlerverktøy.

### Kodeformatering

Dette repo-et bruker [prettier](https://prettier.io/) med [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
for å sikre at all koden er på likt format. Hvordan utviklerne velger å overholde disse reglene er opp til den enkelte, men
Prettier kan settes opp til å formatere kode automatisk on-save. Hvordan dette konfigureres avhenger av IDE / Editor.

-   [File Watchers i IntelliJ / WebStorm](https://prettier.io/docs/en/webstorm.html)
-   [Plugin for VSCode](https://github.com/prettier/prettier-vscode)

## Kjøre lokalt

### Kun frontend servert av Parcel

```
npm start
```

Dersom du er på mac OS og ønsker appen startet i Chrome:

```
npm run start-mac
```

### Backend som server både API og frontend som statiske filer

Lag en .env-fil med følgende innhold i rotkatalogen:

```
TENANT_ID=<Azure tenant id>
REDIRECT_URL=http://localhost:3000/callback
SESSION_SECRET=whatever
```

Hvis du vil benytte funksjonaliteten for lagring og henting av feedback for en sak må du tilby et S3-kompatibelt endepunkt, her kan feks [LocalStack](https://hub.docker.com/r/localstack/localstack) benyttes. Følgende må da inn i .env-fila i tillegg til det som er nevnt ovenfor:

```
S3_URL=http://localhost:4572
S3_ACCESS_KEY=<key>
S3_SECRET_KEY=<secret>
```

Kjør LocalStack:

```
npm run mock-s3
```

Bygg/pakk frontend:

```
npm run build
```

Start:

```
npm run dev-express
```

Appen er nå tilgjengelig på http://localhost:3000

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

Interne henvendelser kan sendes via Slack i kanalen #område-helse.
