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
    ident?: string;
    isLoggedIn?: boolean;
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
    sistSendt?: string | null;
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
    kommentarer: Array<Kommentar>;
};

declare type OpptegnelseType =
    | 'UTBETALING_ANNULLERING_FEILET'
    | 'UTBETALING_ANNULLERING_OK'
    | 'NY_SAKSBEHANDLEROPPGAVE'
    | 'REVURDERING_AVVIST'
    | 'REVURDERING_FERDIGBEHANDLET'
    | 'PERSONDATA_OPPDATERT';

declare type Opptegnelse = {
    aktørId: number;
    sekvensnummer: number;
    type: OpptegnelseType;
    payload: string;
};
