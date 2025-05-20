export function stubnavnForOrganisasjonsnummer(organisasjonsnummer: string) {
    const statisk = statiske[organisasjonsnummer];
    if (statisk) return statisk;

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

const statiske: Record<string, string> = {
    '947064649': 'SJOKKERENDE ELEKTRIKER',
    '839942907': 'HÅRREISENDE FRISØR',
    '805824352': 'VEGANSK SLAKTERI',
    '873080582': '"TRYG FORSIKRING, AVD OSLO"',
    '967170232': 'SNILL TORPEDO',
    '896929119': 'SAUEFABRIKK',
    '907670201': 'KLONELABBEN',
    '811306312': 'AURLAND OG STONGFJORDEN',
    '811307602': 'Papir- og pappvareproduksjon el.',
    '910532251': 'OMSORGSFULL NY TIGER AS',
    '810007982': 'Transportmiddelproduksjon el.',
    '909297246': 'SIVILISERT ALTERNATIV TIGER AS',
    '910519336': 'SLAKK LYDIG TIGER AS',
    '963743254': 'BESK KAFFE',
};

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
