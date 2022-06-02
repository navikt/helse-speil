declare type Dayjs = import('dayjs').Dayjs;

declare type Adressebeskyttelse = 'Ugradert' | 'Fortrolig' | 'StrengtFortrolig' | 'StrengtFortroligUtland' | 'Ukjent';

declare type Personinfo = {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    fødselsdato: Dayjs | null;
    kjønn: 'mann' | 'kvinne' | 'ukjent';
    fnr?: string;
    adressebeskyttelse: Adressebeskyttelse;
};

declare type Periodetype =
    | 'forlengelse'
    | 'førstegangsbehandling'
    | 'infotrygdforlengelse'
    | 'overgangFraIt'
    | 'stikkprøve'
    | 'riskQa'
    | 'revurdering'
    | 'fortroligAdresse'
    | 'utbetalingTilSykmeldt'
    | 'delvisRefusjon';

declare type Inntektskilde = 'EN_ARBEIDSGIVER' | 'FLERE_ARBEIDSGIVERE' | 'UKJENT';

declare type Boenhet = {
    id: string;
    navn: string;
};

declare type Saksbehandler = {
    oid: string;
    epost: string;
    navn: string;
};

declare type Tildeling = {
    saksbehandler: Saksbehandler;
    påVent: boolean;
};

declare type Oppgave = {
    oppgavereferanse: string;
    opprettet: string;
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    fødselsnummer: string;
    aktørId: string;
    antallVarsler: number;
    periodetype: Periodetype;
    inntektskilde: Inntektskilde;
    boenhet: Boenhet;
    tildeling?: Tildeling;
    erBeslutterOppgave: boolean;
    erReturOppgave: boolean;
    trengerTotrinnsvurdering: boolean;
    tidligereSaksbehandlerOid: string;
};

declare type Behandlingsstatistikk = {
    antallOppgaverTilGodkjenning: {
        totalt: number;
        perPeriodetype: {
            periodetype: Periodetype;
            antall: number;
        }[];
    };
    antallTildelteOppgaver: {
        totalt: number;
        perPeriodetype: {
            periodetype: Periodetype;
            antall: number;
        }[];
    };
    fullførteBehandlinger: {
        totalt: number;
        manuelt: {
            totalt: number;
            perPeriodetype: {
                periodetype: Periodetype;
                antall: number;
            }[];
        };
        automatisk: number;
        annulleringer: number;
    };
};

declare type NotatType = 'PaaVent' | 'Retur' | 'Generelt';

declare type Notat = {
    id: string;
    tekst: string;
    saksbehandler: Saksbehandler;
    opprettet: Dayjs;
    vedtaksperiodeId: string;
    feilregistrert: boolean;
    type: NotatType;
};

declare type SpeilError = {
    message: string;
    statusCode?: number;
    technical?: string;
};

declare type OpptegnelseType =
    | 'UTBETALING_ANNULLERING_FEILET'
    | 'UTBETALING_ANNULLERING_OK'
    | 'NY_SAKSBEHANDLEROPPGAVE'
    | 'REVURDERING_AVVIST'
    | 'REVURDERING_FERDIGBEHANDLET';

declare type Opptegnelse = {
    aktørId: number;
    sekvensnummer: number;
    type: OpptegnelseType;
    payload: string;
};
