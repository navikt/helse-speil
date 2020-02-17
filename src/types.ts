import { Optional } from './client/context/types';

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
    personinfo: Optional<Personinfo>;
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
    utbetalingslinjer?: Utbetalingslinje[];
}

export interface Utbetalingsvedtak {
    aktørId: string;
    maksdato: string;
    vedtaksperiodeId: string;
    organisasjonsnummer: string;
    saksbehandler?: string;
    utbetalingslinjer?: Utbetalingslinje[];
}

export enum VedtaksperiodeTilstand {
    START = 'START',
    MOTTATT_NY_SØKNAD = 'MOTTATT_NY_SØKNAD',
    AVVENTER_SENDT_SØKNAD = 'AVVENTER_SENDT_SØKNAD',
    AVVENTER_TIDLIGERE_PERIODE_ELLER_INNTEKTSMELDING = 'AVVENTER_TIDLIGERE_PERIODE_ELLER_INNTEKTSMELDING',
    AVVENTER_TIDLIGERE_PERIODE = 'AVVENTER_TIDLIGERE_PERIODE',
    UNDERSØKER_HISTORIKK = 'UNDERSØKER_HISTORIKK',
    AVVENTER_INNTEKTSMELDING = 'AVVENTER_INNTEKTSMELDING',
    AVVENTER_VILKÅRSPRØVING = 'AVVENTER_VILKÅRSPRØVING',
    AVVENTER_HISTORIKK = 'AVVENTER_HISTORIKK',
    AVVENTER_GODKJENNING = 'AVVENTER_GODKJENNING',
    TIL_UTBETALING = 'TIL_UTBETALING',
    TIL_INFOTRYGD = 'TIL_INFOTRYGD',
    ANNULLERT = 'ANNULLERT' // Finnes foreløpig kun i speil
}
