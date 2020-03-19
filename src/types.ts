export interface UnmappedPersoninfo {
    fdato: string;
    kjønn: string;
    fornavn: string;
    etternavn?: string;
}

export interface Personinfo {
    navn: string;
    kjønn: string;
    fødselsdato: string;
    fnr?: string;
}

export interface Behov {
    '@behov': string;
    '@id': string;
    '@opprettet': string;
    aktørId: string;
    organisasjonsnummer: string;
    vedtaksperiodeId: string;
    personinfo?: Personinfo | null;
}

export type Utbetalingslinje = {
    fom: string;
    tom: string;
    dagsats: number;
    grad?: number;
};

export interface UnmappedUtbetalingsvedtak {
    id: string;
    aktørId: string;
    organisasjonsnummer: string;
    maksdato: string;
    utbetalingsreferanse: string;
    utbetalingslinjer?: Utbetalingslinje[];
}

export interface Utbetalingsvedtak {
    aktørId: string;
    maksdato: string;
    vedtaksperiodeId: string;
    utbetalingsreferanse: string;
    organisasjonsnummer: string;
    fødselsnummer: string;
    saksbehandler?: string;
    utbetalingslinjer?: Utbetalingslinje[];
    erUtvidelse: boolean;
    [key: string]: any;
}

export enum SpleisVedtaksperiodetilstand {
    AVVENTER_HISTORIKK = 'AVVENTER_HISTORIKK',
    AVVENTER_GODKJENNING = 'AVVENTER_GODKJENNING',
    TIL_UTBETALING = 'TIL_UTBETALING',
    TIL_INFOTRYGD = 'TIL_INFOTRYGD',
    AVSLUTTET = 'AVSLUTTET',
    UTBETALING_FEILET = 'UTBETALING_FEILET',
    START = 'START',
    MOTTATT_SYKMELDING_FERDIG_FORLENGELSE = 'MOTTATT_SYKMELDING_FERDIG_FORLENGELSE',
    MOTTATT_SYKMELDING_UFERDIG_FORLENGELSE = 'MOTTATT_SYKMELDING_UFERDIG_FORLENGELSE',
    MOTTATT_SYKMELDING_FERDIG_GAP = 'MOTTATT_SYKMELDING_FERDIG_GAP',
    MOTTATT_SYKMELDING_UFERDIG_GAP = 'MOTTATT_SYKMELDING_UFERDIG_GAP',
    AVVENTER_SØKNAD_FERDIG_GAP = 'AVVENTER_SØKNAD_FERDIG_GAP',
    AVVENTER_SØKNAD_UFERDIG_GAP = 'AVVENTER_SØKNAD_UFERDIG_GAP',
    AVVENTER_VILKÅRSPRØVING_GAP = 'AVVENTER_VILKÅRSPRØVING_GAP',
    AVVENTER_GAP = 'AVVENTER_GAP',
    AVVENTER_INNTEKTSMELDING_FERDIG_GAP = 'AVVENTER_INNTEKTSMELDING_FERDIG_GAP',
    AVVENTER_INNTEKTSMELDING_UFERDIG_GAP = 'AVVENTER_INNTEKTSMELDING_UFERDIG_GAP',
    AVVENTER_UFERDIG_GAP = 'AVVENTER_UFERDIG_GAP',
    AVVENTER_INNTEKTSMELDING_UFERDIG_FORLENGELSE = 'AVVENTER_INNTEKTSMELDING_UFERDIG_FORLENGELSE',
    AVVENTER_SØKNAD_UFERDIG_FORLENGELSE = 'AVVENTER_SØKNAD_UFERDIG_FORLENGELSE',
    AVVENTER_UFERDIG_FORLENGELSE = 'AVVENTER_UFERDIG_FORLENGELSE',
    ANNULLERT = 'ANNULLERT'
}

export interface Error {
    message: string;
    statusCode?: number;
}
