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

felter="$(node -e '
const fil = JSON.parse(require("fs").readFileSync(process.argv[1], "utf-8"));
const person = fil?.data?.person;
if (!person?.aktorId || !person?.fodselsnummer) { console.error("Fant ikke data.person med aktorId og fodselsnummer i clipboard-innholdet"); process.exit(1); }
console.log(person.aktorId, person.fodselsnummer);
' "$tempFile")" || { rm -f $tempFile; giOpp "Clipboard-innholdet er ikke persondata kopiert med ALT+P."; }

aktorId="${felter% *}"
fodselsnummer="${felter#* }"

mv $tempFile src/spesialist-mock/data/personer/$aktorId.json

echo Jess, nå er det opprettet en testdata-fil for personen: src/spesialist-mock/data/personer/$aktorId.json
echo Start speil på nytt og søk opp personen med fødselsnummer $fodselsnummer eller aktør-ID $aktorId.
