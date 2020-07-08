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

export interface SpesialistPersoninfo {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    kjønn: string | null;
    fødselsdato: string | null;
}

export interface PersonNavn {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
}

export enum OppgaveType {
    Forlengelse = 'FORLENGELSE',
    Førstegangsbehandling = 'FØRSTEGANGSBEHANDLING',
    Infotrygdforlengelse = 'INFOTRYGDFORLENGELSE',
    OvergangFraInfotrygd = 'OVERGANG_FRA_IT',
}

export interface Oppgave {
    oppgavereferanse: string;
    opprettet: string;
    vedtaksperiodeId: string;
    navn: PersonNavn;
    fødselsnummer: string;
    aktørId: string;
    boenhet: Boenhet;
    antallVarsler: number;
    type: OppgaveType;
}

interface Boenhet {
    id: string;
    navn: string;
}

export interface Error {
    message: string;
    statusCode?: number;
    technical?: string;
}
