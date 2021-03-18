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
    RiskQa = 'RISK_QA',
}

export enum Inntektskilde {
    EnArbeidsgiver = 'EN_ARBEIDSGIVER',
    FlereArbeidsgivere = 'FLERE_ARBEIDSGIVERE',
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
    type: Periodetype;
    oppgavetype: Oppgavetype;
    boenhet: SpesialistBoenhet;
    inntektskilde?: Inntektskilde;
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
