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
