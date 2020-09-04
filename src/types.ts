export interface UnmappedPersoninfo {
    fdato: string;
    kjønn: string;
    fornavn: string;
    etternavn?: string;
}

export interface PersoninfoFraSparkel {
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

export enum OppgaveType {
    Forlengelse = 'FORLENGELSE',
    Førstegangsbehandling = 'FØRSTEGANGSBEHANDLING',
    Infotrygdforlengelse = 'INFOTRYGDFORLENGELSE',
    OvergangFraInfotrygd = 'OVERGANG_FRA_IT',
}

export interface SpesialistOppgave {
    oppgavereferanse: string;
    saksbehandlerOid: string | null;
    opprettet: string;
    vedtaksperiodeId: string;
    periodeFom: string;
    periodeTom: string;
    personinfo: SpesialistPersoninfo;
    fødselsnummer: string;
    aktørId: string;
    antallVarsler: number;
    type: OppgaveType;
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
    type: OppgaveType;
    boenhet: Boenhet;
}

export interface TildeltOppgave extends Oppgave {
    tildeltTil: string;
}

export interface Speiltildeling {
    oppgavereferanse: string;
    userId: string;
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
