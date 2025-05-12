export function stubnavnForOrganisasjonsnummer(organisasjonsnummer: string) {
    const startIndex = parseInt(
        organisasjonsnummer.charAt(0) + organisasjonsnummer.charAt(8) + organisasjonsnummer.charAt(2),
    );
    const valgtStart = start[startIndex % start.length]!;

    const midtIndex = parseInt(
        organisasjonsnummer.charAt(6) + organisasjonsnummer.charAt(3) + organisasjonsnummer.charAt(7),
    );
    const valgtMidt = midt[midtIndex % midt.length]!;

    const sluttIndex = parseInt(
        organisasjonsnummer.charAt(4) + organisasjonsnummer.charAt(5) + organisasjonsnummer.charAt(1),
    );
    const valgtSlutt = slutt[sluttIndex % slutt.length]!;

    return valgtStart + valgtMidt + valgtSlutt;
}

const start: string[] = [
    'Fe',
    'Enhjørning',
    'Drage',
    'Varulv',
    'Struts',
    'Gris',
    'Høne',
    'Hund',
    'Katt',
    'Sau',
    'Ku',
    'Jerv',
    'Ulv',
    'Oter',
    'Elg',
    'Fisk',
    'Laks',
    'Abbor',
    'Reke',
    'Ape',
    'Villsvin',
    'Frosk',
    'Hjort',
    'Mus',
    'Rotte',
    'Elg',
];

const midt: string[] = [
    'passer',
    'hage',
    'synsere',
    'basseng',
    'fantasi',
    'skylling',
    'sport',
    'observasjon',
    'landskap',
    'elskere',
    'utstyr',
    'trading',
    'support',
    'bygg',
    'data',
    'vask',
    'handler',
    'massasje',
    'terapi',
    'inspirasjon',
    'venner',
    'riddere',
    'ryddere',
    'spanere',
    'proffen',
];

const slutt: string[] = [
    ' AS',
    ' Org.',
    ' Inc.',
    ' Services',
    ' Hotell',
    ' Kafé',
    ' Skole',
    ' Barnehage',
    ' Dagligvare',
    ' Butikk',
    ' Reisebyrå',
    ' Selskap',
    '-Gruppen',
    'initiativet',
    'prosjektet',
    'alliansen',
    'stiftelsen',
    ' Orden',
    ' Laboratorium',
    ' Treningssenter',
    ' Norge',
    ' Nordic',
    ' Oslo',
    ' Rogaland',
    ' Innlandet',
    ' Finnskogen',
    ' Drift',
    ' Klubb',
];
