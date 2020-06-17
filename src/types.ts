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

export interface Oppgave {
    spleisbehovId: string;
    opprettet: string;
    vedtaksperiodeId: string;
    navn: PersonNavn;
    fødselsnummer: string;
    aktørId: string;
    antallVarsler: number;
    type: string;
}

export interface Error {
    message: string;
    statusCode?: number;
    technical?: string;
}
