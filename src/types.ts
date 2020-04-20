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

export interface PersonNavn {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
}

export interface Oppgave {
    spleisbehovId: string;
    oppdatert: string;
    fødselsnummer: string;
    vedtaksperiodeId: string;
    navn: PersonNavn;
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
