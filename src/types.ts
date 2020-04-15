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
    grad: number;
};

export interface Error {
    message: string;
    statusCode?: number;
}
