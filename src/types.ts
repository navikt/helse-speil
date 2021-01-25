export interface SpesialistPersoninfo {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    kjønn: string | null;
    fødselsdato: string | null;
}

export enum Periodetype {
    Forlengelse = 'FORLENGELSE',
    Førstegangsbehandling = 'FØRSTEGANGSBEHANDLING',
    Infotrygdforlengelse = 'INFOTRYGDFORLENGELSE',
    OvergangFraInfotrygd = 'OVERGANG_FRA_IT',
    Stikkprøve = 'STIKKPRØVE',
}

export enum Oppgavetype {
    Søknad = 'SØKNAD',
    Stikkprøve = 'STIKKPRØVE',
}

export interface SpesialistOppgave {
    oppgavereferanse: string;
    saksbehandlerepost: string | null;
    opprettet: string;
    vedtaksperiodeId: string;
    periodeFom: string;
    periodeTom: string;
    personinfo: SpesialistPersoninfo;
    fødselsnummer: string;
    aktørId: string;
    antallVarsler: number;
    type: Periodetype;
    oppgavetype: Oppgavetype;
    boenhet: Boenhet;
}

export interface Oppgave {
    oppgavereferanse: string;
    tildeltTil?: string;
    opprettet: string;
    vedtaksperiodeId: string;
    personinfo: SpesialistPersoninfo;
    fødselsnummer: string;
    aktørId: string;
    antallVarsler: number;
    periodetype: Periodetype;
    boenhet: Boenhet;
}

export interface TildeltOppgave extends Oppgave {
    tildeltTil: string;
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
