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

For at pnpm skulle kunne laste dependencies fra Github Package Registry
må du ha et Github Personal Access satt i miljøvariabelen `NPM_AUTH_TOKEN`.

Dette tokenet trenger scopet `read:packages`. Husk å trykke Configure SSO for navikt.

Legg til følgende i `~/.bashrc` eller `~/.zshrc`:

```shell
export NPM_AUTH_TOKEN=<token>
```

I tillegg må du sette opp en `.npmrc` på brukernivå. pnpm ekspanderer ikke
miljøvariabler i prosjektets `.npmrc` (siden den filen er sjekket inn i repoet
og kunne lekket hemmeligheten), så credential-linjen må ligge i `~/.npmrc`:

```shell
echo '//npm.pkg.github.com/:_authToken=${NPM_AUTH_TOKEN}' >> ~/.npmrc
```

## Utvikle lokalt

1. Sørg for at du har riktig versjon av node (se package.json), f.eks. med [nvm](https://github.com/nvm-sh/nvm) eller [mise](https://mise.jdx.dev).
2. Installer prosjektet - `pnpm install`
3. Installer pre-commit hook - `pnpm run install-precommit-hooks`
4. Kjør Speil lokalt med next dev server - `pnpm run dev`

Default i lokal utvikling er at kall mot /api/spesialist blir besvart av stubber basert på spesialist-mock.

### Utvikle lokalt mot lokalt kjørende backend

- `pnpm run dev`: alle backender er stubbet.
- `pnpm run lokal-<navn>`, for eksempel `pnpm run lokal-sporhund`: den backenden kjører lokalt, alle andre er stubbet.
- `pnpm run lokal-backend`: spesialist, sporhund og vilkårsprøving kjører lokalt.

Start backenden lokalt først (se etter `LocalApp.kt`). Speil henter token fra backendens `/local-token`. Portene står
i `src/app/api/backends.ts`.

Scriptene setter `NEXT_PUBLIC_RUNTIME_ENV=lokal` og lister backendene som kjører lokalt i `LOKALE_BACKENDS`. Alle
andre backender blir stubbet. Du kan kombinere fritt, for eksempel
`NEXT_PUBLIC_RUNTIME_ENV=lokal LOKALE_BACKENDS=spesialist,sporhund pnpm exec next dev --turbopack`.

### Legge til en ny backend

1. Legg til backenden i `src/app/api/backends.ts` med miljøvariabler for scope og base-URL, og `lokalPort` hvis den
   skal kunne kjøres lokalt.
2. Lag `src/app/api/<navn>/common.ts` med `lagStubEllerVideresend({ backend: '<navn>' })`, og legg route- og stubfiler
   ved siden av.
3. Legg til et `lokal-<navn>`-script i `package.json`.
4. Legg til `accessPolicy` og miljøvariabler i `deploy/dev.yml` og `deploy/prod.yml`.
5. Hvis backenden har OpenAPI-spec: legg til et prosjekt i `orval.config.ts`.

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

## Oppdatere REST-typer og genererte Tanstack Query-hooks

OpenAPI-spec kan hentes fra spesialist eller sporhund på lokal maskin (Eller begge). Først må man starte spesialist eller sporhund på lokal maskin (se etter fila LocalApp.kt).
OpenAPI-spec'en når man kjører lokalt krever ikke autentisering.

**Kjør så kommandoen:**

```shell
# krever at både spesialist og sporhund kjører lokalt
pnpm run generate-rest
```

```shell
# krever at spesialist kjører lokalt
pnpm run generate-rest:spesialist
```

```shell
# krever at sporhund kjører lokalt
pnpm run generate-rest:sporhund
```

### Oppdatere Sanity-typer

```shell
pnpm run generate-sanity
```

Speil genererer typer fra sanity schema definisjonene i [helse-spalten](https://github.com/navikt/helse-spalten) og GROQ-spørringene i
`src/app/api/sanity/`. Skriptet forventer at spalten lever i samme directory som speil. Ligger repoet et annet sted, sett `SPALTEN_DIR` når du kjører skriptet.

Skriptet kjører `sanity schema extract --enforce-required-fields` med spaltens Sanity CLI og legger et
skjema i `src/io/sanity/schema.json`. Dette er en lokal, git-ignorert mellomfil; den skal ikke redigeres eller sjekkes inn. `--enforce-required-fields` gjør felter markert som påkrevd i spalten, til påkrevde felter i de genererte typene. Kjør skriptet på nytt når skjemaet i spalten eller GROQ-spørringene i speil endres.

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

Interne henvendelser kan sendes via Slack i kanalen [#team-sas-værsågod](https://nav-it.slack.com/archives/C019637N90X).
