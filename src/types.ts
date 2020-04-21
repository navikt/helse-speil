export interface UnmappedPersoninfo {
    fdato: string;
    kjønn: string;
    fornavn: string;
    etternavn?: string;
}

export interface Personinfo {
    kjønn: string;
    fødselsdato: string;
    fnr?: string;
}

export interface PersonNavn {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
}

export interface PersonFraSpesialist {}

export interface Oppgave {
    spleisbehovId: string;
    opprettet: string;
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
