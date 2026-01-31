#!/usr/bin/env sh

# Skriptet er laget for å kunne vise en person fra prod eller dev lokalt.
# Det leser fra utklippstavla, oppretter en json-fil, og lager data som må
# settes inn i lista over personidentifikatorer og legger dem på utklippstavla

# Forbedringsmulighet: legge inn dataene i lista automatisk

set -ueo pipefail

function giOpp {
  echo $1 && exit
}

test "$(uname -s)" == "Darwin" || giOpp "Du bruker ikke Mac, det er bare sorry det."
utklippstavleinnholdlenge="$(pbpaste | wc -c | xargs)"
test $utklippstavleinnholdlenge -lt 40000 && giOpp "Innholdet i utklippstavla di er bare $utklippstavleinnholdlenge bytes, det er for lite, ass."

tempFile=$(mktemp)
pbpaste > $tempFile

aktorId="$(grep aktorId $tempFile | tr -dc '0-9')" || giOpp "Fant ikke aktorId-feltet i clipboard-innholdet"
fodselsnummer="$(grep fodselsnummer $tempFile | tr -dc '0-9')" || giOpp "Fant ikke fodselsnummer-feltet i clipboard-innholdet"

mv $tempFile src/spesialist-mock/data/personer/$aktorId.json

element=$(cat <<EOF
{
    aktørId: '$aktorId',
    fødselsnummer: '$fodselsnummer',
    personPseudoId: '$(uuidgen | tr '[:upper:]' '[:lower:]')',
},
EOF
)

echo "$element" | pbcopy
echo Jess, nå er det opprettet en testdata-fil for personen.
echo Du har fått dette i utklippstavla di:
echo "$element"
filename=src/spesialist-mock/storage/person.ts
filelink="$(realpath $filename)"
echo Legg det inn i $filelink og så kan du søke opp personen!

