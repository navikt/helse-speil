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
    '213926292': 'RELEVANT KRITISK APE',
    '215930602': 'SKÅNSOM VERD TIGER AS',
    '311301551': 'FILOSOFISK UPRESIS TIGER AS',
    '311331132': 'GNIEN UTÅLMODIG TIGER AS',
    '311535781': 'RIK MOTVILLIG FJELLREV',
    '311567470': 'ROLIG ULYDIG TIGER AS',
    '311602764': 'KOMFORTABEL TREG TIGER AS',
    '311836196': 'HENSYNSLØS FLYKTIG TIGER AS',
    '311895354': 'SLAKK LYDIG TIGER AS',
    '311927825': 'INTERESSANT FUNKSJONELL TIGER AS',
    '311973894': 'DYNAMISK KJÆRLIG TIGER AS',
    '314748379': 'DYKTIG MATT TIGER AS',
    '314808452': 'OMSORGSFULL NY TIGER AS',
    '314990714': 'GLAD OPPBLÅST KATT BYGNING',
    '315043271': 'KULTURELL UPRESIS TIGER AS',
    '315215137': 'OKSYDERT SIST TIGER AS',
    '315469279': 'SJENERT LYDIG KATT ESKE',
    '315587336': 'JORDISK KUNST KATT KRYDDERMÅL',
    '315602785': 'KUNST RAFFINERT TIGER AS',
    '315609267': 'UTØRST KONSENTRISK TIGER AS',
    '315636086': 'SIVILISERT ALTERNATIV TIGER AS',
    '315793378': 'LAV MOTIVERT TIGER AS',
    '315942691': 'SIKKER HELLIG FJELLREV',
    '805824352': 'VEGANSK SLAKTERI',
    '810007842': 'Papir- og pappvareproduksjon el.',
    '810007982': 'Transportmiddelproduksjon el.',
    '811290262': 'INGØY OG ENGER',
    '811307602': 'DAVIK OG ABELVÆR',
    '839942907': 'HÅRREISENDE FRISØR',
    '873080582': 'TRYG FORSIKRING, AVD OSLO',
    '896929119': 'SAUEFABRIKK',
    '907670201': 'KLONELABBEN',
    '910519336': 'AURLAND OG STONGFJORDEN',
    '947064649': 'SJOKKERENDE ELEKTRIKER',
    '951770744': 'OBSERVANT KYSTSTI',
    '963743254': 'BESK KAFFE',
    '967170232': 'SNILL TORPEDO',
    '972674818': 'PENGELØS SPAREBANK',
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
