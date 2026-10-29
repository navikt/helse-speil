#!/usr/bin/env sh

# Skriptet er laget for å kunne vise en person fra prod eller dev lokalt.
# Det leser persondata kopiert med ALT+P fra utklippstavla og oppretter en
# json-fil under src/spesialist-mock/data/personer.

set -ueo pipefail

function giOpp {
  echo $1 && exit 1
}

test "$(uname -s)" == "Darwin" || giOpp "Du bruker ikke Mac, det er bare sorry det."
utklippstavleinnholdlenge="$(pbpaste | wc -c | xargs)"

tempFile=$(mktemp)
pbpaste > $tempFile

# Nøklene må holdes like Testpersonfil i src/spesialist-mock/storage/person.ts
felter="$(node -e '
const nøkler = ["saksbilde", "person", "aktivOppgave", "totrinnsvurdering", "tildeling", "påVent", "risikovurderinger", "annulleringer", "arbeidsforhold", "inntekterFraAordningen", "overstyringer"];
const fil = JSON.parse(require("fs").readFileSync(process.argv[1], "utf-8"));
const saksbilde = fil?.saksbilde;
if (!saksbilde?.aktorId || !saksbilde?.fodselsnummer || !fil?.person) { console.error("Fant ikke saksbilde med aktorId og fodselsnummer, og person, i clipboard-innholdet"); process.exit(1); }
const mangler = nøkler.filter((nøkkel) => !(nøkkel in fil));
if (mangler.length > 0) { console.error(`Persondata mangler ${mangler.join(", ")}. Kopier på nytt med ALT+P i en oppdatert speil.`); process.exit(1); }
console.log(saksbilde.aktorId, saksbilde.fodselsnummer);
' "$tempFile")" || { rm -f $tempFile; giOpp "Clipboard-innholdet er ikke persondata kopiert med ALT+P."; }

aktorId="${felter% *}"
fodselsnummer="${felter#* }"

mv $tempFile src/spesialist-mock/data/personer/$aktorId.json

echo Jess, nå er det opprettet en testdata-fil for personen: src/spesialist-mock/data/personer/$aktorId.json
echo Start speil på nytt og søk opp personen med fødselsnummer $fodselsnummer eller aktør-ID $aktorId.
