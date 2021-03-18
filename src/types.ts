import {SpesialistInntektskilde} from "external-types";

//TODO: OBS: Målet med denne fila er å bli kvitt den og fordele typene på internal / external

export interface SpesialistPersoninfo {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    kjønn: string | null;
    fødselsdato: string | null;
}

export enum SpesialistPeriodetype {
    Forlengelse = 'FORLENGELSE',
    Førstegangsbehandling = 'FØRSTEGANGSBEHANDLING',
    Infotrygdforlengelse = 'INFOTRYGDFORLENGELSE',
    OvergangFraInfotrygd = 'OVERGANG_FRA_IT',
    Stikkprøve = 'STIKKPRØVE',
    RiskQa = 'RISK_QA'
}

export enum Oppgavetype {
    Søknad = 'SØKNAD',
    Stikkprøve = 'STIKKPRØVE',
    RiskQa = 'RISK_QA',
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
    type: SpesialistPeriodetype;
    oppgavetype: Oppgavetype;
    boenhet: SpesialistBoenhet;
    inntektskilde?: SpesialistInntektskilde;
    erPåVent?: boolean;
    tildeling?: SpesialistTildeling
}

interface SpesialistBoenhet {
    id: string;
    navn: string;
}

export interface SpesialistTildeling {
    epost: string,
    oid: string,
    påVent: boolean
}

export interface Error {
    message: string;
    statusCode?: number;
    technical?: string;
}
