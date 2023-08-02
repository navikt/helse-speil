import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
};

export enum Adressebeskyttelse {
    Fortrolig = 'Fortrolig',
    StrengtFortrolig = 'StrengtFortrolig',
    StrengtFortroligUtland = 'StrengtFortroligUtland',
    Ugradert = 'Ugradert',
    Ukjent = 'Ukjent',
}

export type Alder = {
    __typename?: 'Alder';
    alderSisteSykedag: Scalars['Int']['output'];
    oppfylt: Scalars['Boolean']['output'];
};

export type Annullering = {
    __typename?: 'Annullering';
    saksbehandler: Scalars['String']['output'];
    tidspunkt: Scalars['String']['output'];
};

export type Antall = {
    __typename?: 'Antall';
    automatisk: Scalars['Int']['output'];
    manuelt: Scalars['Int']['output'];
    tilgjengelig: Scalars['Int']['output'];
};

export type Arbeidsforhold = {
    __typename?: 'Arbeidsforhold';
    sluttdato?: Maybe<Scalars['String']['output']>;
    startdato: Scalars['String']['output'];
    stillingsprosent: Scalars['Int']['output'];
    stillingstittel: Scalars['String']['output'];
};

export type Arbeidsforholdoverstyring = Overstyring & {
    __typename?: 'Arbeidsforholdoverstyring';
    begrunnelse: Scalars['String']['output'];
    deaktivert: Scalars['Boolean']['output'];
    ferdigstilt: Scalars['Boolean']['output'];
    forklaring: Scalars['String']['output'];
    hendelseId: Scalars['String']['output'];
    saksbehandler: Saksbehandler;
    skjaeringstidspunkt: Scalars['String']['output'];
    timestamp: Scalars['String']['output'];
};

export type Arbeidsgiver = {
    __typename?: 'Arbeidsgiver';
    arbeidsforhold: Array<Arbeidsforhold>;
    bransjer: Array<Scalars['String']['output']>;
    generasjoner: Array<Generasjon>;
    ghostPerioder: Array<GhostPeriode>;
    navn: Scalars['String']['output'];
    organisasjonsnummer: Scalars['String']['output'];
    overstyringer: Array<Overstyring>;
};

export type Arbeidsgiverinntekt = {
    __typename?: 'Arbeidsgiverinntekt';
    arbeidsgiver: Scalars['String']['output'];
    deaktivert?: Maybe<Scalars['Boolean']['output']>;
    omregnetArsinntekt?: Maybe<OmregnetArsinntekt>;
    sammenligningsgrunnlag?: Maybe<Sammenligningsgrunnlag>;
    skjonnsmessigFastsatt?: Maybe<OmregnetArsinntekt>;
};

export type Arbeidsgiveroppdrag = Spennoppdrag & {
    __typename?: 'Arbeidsgiveroppdrag';
    fagsystemId: Scalars['String']['output'];
    linjer: Array<Utbetalingslinje>;
    organisasjonsnummer: Scalars['String']['output'];
};

export type Arbeidsgiverrefusjon = {
    __typename?: 'Arbeidsgiverrefusjon';
    arbeidsgiver: Scalars['String']['output'];
    refusjonsopplysninger: Array<Refusjonselement>;
};

export enum Begrunnelse {
    EgenmeldingUtenforArbeidsgiverperiode = 'EGENMELDING_UTENFOR_ARBEIDSGIVERPERIODE',
    EtterDodsdato = 'ETTER_DODSDATO',
    ManglerMedlemskap = 'MANGLER_MEDLEMSKAP',
    ManglerOpptjening = 'MANGLER_OPPTJENING',
    MinimumInntekt = 'MINIMUM_INNTEKT',
    MinimumInntektOver_67 = 'MINIMUM_INNTEKT_OVER_67',
    MinimumSykdomsgrad = 'MINIMUM_SYKDOMSGRAD',
    Over_70 = 'OVER_70',
    SykepengedagerOppbrukt = 'SYKEPENGEDAGER_OPPBRUKT',
    SykepengedagerOppbruktOver_67 = 'SYKEPENGEDAGER_OPPBRUKT_OVER_67',
    Ukjent = 'UKJENT',
}

export type Behandlingsstatistikk = {
    __typename?: 'Behandlingsstatistikk';
    antallAnnulleringer: Scalars['Int']['output'];
    beslutter: Antall;
    delvisRefusjon: Antall;
    enArbeidsgiver: Antall;
    faresignaler: Antall;
    flereArbeidsgivere: Antall;
    forlengelseIt: Antall;
    forlengelser: Antall;
    forstegangsbehandling: Antall;
    fortroligAdresse: Antall;
    revurdering: Antall;
    stikkprover: Antall;
    utbetalingTilArbeidsgiver: Antall;
    utbetalingTilSykmeldt: Antall;
};

export type BeregnetPeriode = Periode & {
    __typename?: 'BeregnetPeriode';
    beregningId: Scalars['String']['output'];
    erForkastet: Scalars['Boolean']['output'];
    fom: Scalars['String']['output'];
    forbrukteSykedager?: Maybe<Scalars['Int']['output']>;
    gjenstaendeSykedager?: Maybe<Scalars['Int']['output']>;
    handlinger: Array<Handling>;
    hendelser: Array<Hendelse>;
    id: Scalars['String']['output'];
    inntektFraAordningen: Array<InntektFraAOrdningen>;
    inntektstype: Inntektstype;
    maksdato: Scalars['String']['output'];
    notater: Array<Notat>;
    oppgave?: Maybe<OppgaveForPeriodevisning>;
    /** @deprecated Oppgavereferanse bør hentes fra periodens oppgave */
    oppgavereferanse?: Maybe<Scalars['String']['output']>;
    opprettet: Scalars['String']['output'];
    periodehistorikk: Array<PeriodeHistorikkElement>;
    periodetilstand: Periodetilstand;
    periodetype: Periodetype;
    periodevilkar: Periodevilkar;
    risikovurdering?: Maybe<Risikovurdering>;
    skjaeringstidspunkt: Scalars['String']['output'];
    tidslinje: Array<Dag>;
    tom: Scalars['String']['output'];
    totrinnsvurdering?: Maybe<Totrinnsvurdering>;
    utbetaling: Utbetaling;
    varsler: Array<VarselDto>;
    vedtaksperiodeId: Scalars['String']['output'];
    vilkarsgrunnlagId?: Maybe<Scalars['String']['output']>;
};

export type Boenhet = {
    __typename?: 'Boenhet';
    id: Scalars['String']['output'];
    navn: Scalars['String']['output'];
};

export type Dag = {
    __typename?: 'Dag';
    begrunnelser?: Maybe<Array<Begrunnelse>>;
    dato: Scalars['String']['output'];
    grad?: Maybe<Scalars['Float']['output']>;
    kilde: Kilde;
    sykdomsdagtype: Sykdomsdagtype;
    utbetalingsdagtype: Utbetalingsdagtype;
    utbetalingsinfo?: Maybe<Utbetalingsinfo>;
};

export type Dagoverstyring = Overstyring & {
    __typename?: 'Dagoverstyring';
    begrunnelse: Scalars['String']['output'];
    dager: Array<OverstyrtDag>;
    ferdigstilt: Scalars['Boolean']['output'];
    hendelseId: Scalars['String']['output'];
    saksbehandler: Saksbehandler;
    timestamp: Scalars['String']['output'];
};

export enum Dagtype {
    Arbeidsdag = 'Arbeidsdag',
    Avvistdag = 'Avvistdag',
    Egenmeldingsdag = 'Egenmeldingsdag',
    FerieUtenSykmeldingDag = 'FerieUtenSykmeldingDag',
    Feriedag = 'Feriedag',
    Permisjonsdag = 'Permisjonsdag',
    Sykedag = 'Sykedag',
    SykedagNav = 'SykedagNav',
}

export type Enhet = {
    __typename?: 'Enhet';
    id: Scalars['String']['output'];
    navn: Scalars['String']['output'];
};

export type Faresignal = {
    __typename?: 'Faresignal';
    beskrivelse: Scalars['String']['output'];
    kategori: Array<Scalars['String']['output']>;
};

export type FerdigstiltOppgave = {
    __typename?: 'FerdigstiltOppgave';
    aktorId: Scalars['String']['output'];
    bosted?: Maybe<Scalars['String']['output']>;
    ferdigstiltAv?: Maybe<Scalars['String']['output']>;
    ferdigstiltTidspunkt: Scalars['String']['output'];
    id: Scalars['String']['output'];
    inntektstype: Inntektstype;
    periodetype: Periodetype;
    personnavn: Personnavn;
    type: Oppgavetype;
};

export type Generasjon = {
    __typename?: 'Generasjon';
    id: Scalars['String']['output'];
    perioder: Array<Periode>;
};

export type GhostPeriode = {
    __typename?: 'GhostPeriode';
    deaktivert: Scalars['Boolean']['output'];
    fom: Scalars['String']['output'];
    id: Scalars['String']['output'];
    organisasjonsnummer: Scalars['String']['output'];
    skjaeringstidspunkt: Scalars['String']['output'];
    tom: Scalars['String']['output'];
    vilkarsgrunnlagId?: Maybe<Scalars['String']['output']>;
};

export type Handling = {
    __typename?: 'Handling';
    begrunnelse?: Maybe<Scalars['String']['output']>;
    tillatt: Scalars['Boolean']['output'];
    type: Periodehandling;
};

export type Hendelse = {
    id: Scalars['String']['output'];
    type: Hendelsetype;
};

export enum Hendelsetype {
    Inntektsmelding = 'INNTEKTSMELDING',
    NySoknad = 'NY_SOKNAD',
    SendtSoknadArbeidsgiver = 'SENDT_SOKNAD_ARBEIDSGIVER',
    SendtSoknadNav = 'SENDT_SOKNAD_NAV',
    Ukjent = 'UKJENT',
}

export type Infotrygdutbetaling = {
    __typename?: 'Infotrygdutbetaling';
    dagsats: Scalars['Float']['output'];
    fom: Scalars['String']['output'];
    grad: Scalars['String']['output'];
    organisasjonsnummer: Scalars['String']['output'];
    tom: Scalars['String']['output'];
    typetekst: Scalars['String']['output'];
};

export type InntektFraAOrdningen = {
    __typename?: 'InntektFraAOrdningen';
    maned: Scalars['String']['output'];
    sum: Scalars['Float']['output'];
};

export type Inntektoverstyring = Overstyring & {
    __typename?: 'Inntektoverstyring';
    ferdigstilt: Scalars['Boolean']['output'];
    hendelseId: Scalars['String']['output'];
    inntekt: OverstyrtInntekt;
    saksbehandler: Saksbehandler;
    timestamp: Scalars['String']['output'];
};

export enum Inntektskilde {
    Aordningen = 'AORDNINGEN',
    IkkeRapportert = 'IKKE_RAPPORTERT',
    Infotrygd = 'INFOTRYGD',
    Inntektsmelding = 'INNTEKTSMELDING',
    Saksbehandler = 'SAKSBEHANDLER',
    SkjonnsmessigFastsatt = 'SKJONNSMESSIG_FASTSATT',
}

export type Inntektsmelding = Hendelse & {
    __typename?: 'Inntektsmelding';
    beregnetInntekt: Scalars['Float']['output'];
    id: Scalars['String']['output'];
    mottattDato: Scalars['String']['output'];
    type: Hendelsetype;
};

export enum Inntektstype {
    Enarbeidsgiver = 'ENARBEIDSGIVER',
    Flerearbeidsgivere = 'FLEREARBEIDSGIVERE',
}

export type Kilde = {
    __typename?: 'Kilde';
    id: Scalars['String']['output'];
    type: Kildetype;
};

export enum Kildetype {
    Inntektsmelding = 'INNTEKTSMELDING',
    Saksbehandler = 'SAKSBEHANDLER',
    Soknad = 'SOKNAD',
    Sykmelding = 'SYKMELDING',
    Ukjent = 'UKJENT',
}

export enum Kjonn {
    Kvinne = 'Kvinne',
    Mann = 'Mann',
    Ukjent = 'Ukjent',
}

export type Kommentar = {
    __typename?: 'Kommentar';
    feilregistrert_tidspunkt?: Maybe<Scalars['String']['output']>;
    id: Scalars['Int']['output'];
    opprettet: Scalars['String']['output'];
    saksbehandlerident: Scalars['String']['output'];
    tekst: Scalars['String']['output'];
};

export enum Mottaker {
    Arbeidsgiver = 'ARBEIDSGIVER',
    Begge = 'BEGGE',
    Sykmeldt = 'SYKMELDT',
}

export type Mutation = {
    __typename?: 'Mutation';
    abonner: Scalars['Boolean']['output'];
    feilregistrerKommentar?: Maybe<Kommentar>;
    feilregistrerKommentarV2?: Maybe<Kommentar>;
    feilregistrerNotat?: Maybe<Notat>;
    fjernPaaVent?: Maybe<Tildeling>;
    fjernTildeling: Scalars['Boolean']['output'];
    leggPaaVent?: Maybe<Tildeling>;
    leggTilKommentar?: Maybe<Kommentar>;
    leggTilNotat?: Maybe<Notat>;
    opprettTildeling?: Maybe<Tildeling>;
    settVarselstatusAktiv?: Maybe<VarselDto>;
    settVarselstatusVurdert?: Maybe<VarselDto>;
};

export type MutationAbonnerArgs = {
    personidentifikator: Scalars['String']['input'];
};

export type MutationFeilregistrerKommentarArgs = {
    id: Scalars['Int']['input'];
};

export type MutationFeilregistrerKommentarV2Args = {
    id: Scalars['Int']['input'];
};

export type MutationFeilregistrerNotatArgs = {
    id: Scalars['Int']['input'];
};

export type MutationFjernPaaVentArgs = {
    oppgaveId: Scalars['String']['input'];
};

export type MutationFjernTildelingArgs = {
    oppgaveId: Scalars['String']['input'];
};

export type MutationLeggPaaVentArgs = {
    notatTekst: Scalars['String']['input'];
    notatType: NotatType;
    oppgaveId: Scalars['String']['input'];
};

export type MutationLeggTilKommentarArgs = {
    notatId: Scalars['Int']['input'];
    saksbehandlerident: Scalars['String']['input'];
    tekst: Scalars['String']['input'];
};

export type MutationLeggTilNotatArgs = {
    saksbehandlerOid: Scalars['String']['input'];
    tekst: Scalars['String']['input'];
    type: NotatType;
    vedtaksperiodeId: Scalars['String']['input'];
};

export type MutationOpprettTildelingArgs = {
    oppgaveId: Scalars['String']['input'];
};

export type MutationSettVarselstatusAktivArgs = {
    generasjonIdString: Scalars['String']['input'];
    ident: Scalars['String']['input'];
    varselkode: Scalars['String']['input'];
};

export type MutationSettVarselstatusVurdertArgs = {
    definisjonIdString: Scalars['String']['input'];
    generasjonIdString: Scalars['String']['input'];
    ident: Scalars['String']['input'];
    varselkode: Scalars['String']['input'];
};

export type Notat = {
    __typename?: 'Notat';
    feilregistrert: Scalars['Boolean']['output'];
    feilregistrert_tidspunkt?: Maybe<Scalars['String']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    opprettet: Scalars['String']['output'];
    saksbehandlerEpost: Scalars['String']['output'];
    saksbehandlerIdent: Scalars['String']['output'];
    saksbehandlerNavn: Scalars['String']['output'];
    saksbehandlerOid: Scalars['String']['output'];
    tekst: Scalars['String']['output'];
    type: NotatType;
    vedtaksperiodeId: Scalars['String']['output'];
};

export enum NotatType {
    Generelt = 'Generelt',
    PaaVent = 'PaaVent',
    Retur = 'Retur',
}

export type Notater = {
    __typename?: 'Notater';
    id: Scalars['String']['output'];
    notater: Array<Notat>;
};

export type OmregnetArsinntekt = {
    __typename?: 'OmregnetArsinntekt';
    belop: Scalars['Float']['output'];
    inntektFraAOrdningen?: Maybe<Array<InntektFraAOrdningen>>;
    kilde: Inntektskilde;
    manedsbelop: Scalars['Float']['output'];
};

export type Oppdrag = {
    __typename?: 'Oppdrag';
    annullering?: Maybe<Annullering>;
    arbeidsgiveroppdrag?: Maybe<Arbeidsgiveroppdrag>;
    personoppdrag?: Maybe<Personoppdrag>;
    status: Oppdragsstatus;
    totalbelop?: Maybe<Scalars['Int']['output']>;
    type: Scalars['String']['output'];
};

export enum Oppdragsstatus {
    Annullert = 'ANNULLERT',
    Forkastet = 'FORKASTET',
    Godkjent = 'GODKJENT',
    GodkjentUtenUtbetaling = 'GODKJENT_UTEN_UTBETALING',
    IkkeGodkjent = 'IKKE_GODKJENT',
    IkkeUtbetalt = 'IKKE_UTBETALT',
    Ny = 'NY',
    Overfort = 'OVERFORT',
    Sendt = 'SENDT',
    UtbetalingFeilet = 'UTBETALING_FEILET',
    Utbetalt = 'UTBETALT',
}

export type OppgaveForOversiktsvisning = {
    __typename?: 'OppgaveForOversiktsvisning';
    aktorId: Scalars['String']['output'];
    boenhet?: Maybe<Boenhet>;
    flereArbeidsgivere: Scalars['Boolean']['output'];
    fodselsnummer: Scalars['String']['output'];
    haster?: Maybe<Scalars['Boolean']['output']>;
    id: Scalars['String']['output'];
    mottaker?: Maybe<Mottaker>;
    navn: Personnavn;
    opprettet: Scalars['String']['output'];
    opprinneligSoknadsdato: Scalars['String']['output'];
    periodetype?: Maybe<Periodetype>;
    personinfo: Personinfo;
    sistSendt?: Maybe<Scalars['String']['output']>;
    tildeling?: Maybe<Tildeling>;
    totrinnsvurdering?: Maybe<Totrinnsvurdering>;
    type: Oppgavetype;
    vedtaksperiodeId: Scalars['String']['output'];
};

export type OppgaveForPeriodevisning = {
    __typename?: 'OppgaveForPeriodevisning';
    id: Scalars['String']['output'];
};

export enum Oppgavetype {
    DelvisRefusjon = 'DELVIS_REFUSJON',
    FortroligAdresse = 'FORTROLIG_ADRESSE',
    Revurdering = 'REVURDERING',
    RiskQa = 'RISK_QA',
    Soknad = 'SOKNAD',
    Stikkprove = 'STIKKPROVE',
    UtbetalingTilSykmeldt = 'UTBETALING_TIL_SYKMELDT',
}

export type Opptegnelse = {
    __typename?: 'Opptegnelse';
    aktorId: Scalars['String']['output'];
    payload: Scalars['String']['output'];
    sekvensnummer: Scalars['Int']['output'];
    type: Opptegnelsetype;
};

export enum Opptegnelsetype {
    FerdigbehandletGodkjenningsbehov = 'FERDIGBEHANDLET_GODKJENNINGSBEHOV',
    NySaksbehandleroppgave = 'NY_SAKSBEHANDLEROPPGAVE',
    PersondataOppdatert = 'PERSONDATA_OPPDATERT',
    RevurderingAvvist = 'REVURDERING_AVVIST',
    RevurderingFerdigbehandlet = 'REVURDERING_FERDIGBEHANDLET',
    UtbetalingAnnulleringFeilet = 'UTBETALING_ANNULLERING_FEILET',
    UtbetalingAnnulleringOk = 'UTBETALING_ANNULLERING_OK',
}

export type Overstyring = {
    ferdigstilt: Scalars['Boolean']['output'];
    hendelseId: Scalars['String']['output'];
    saksbehandler: Saksbehandler;
    timestamp: Scalars['String']['output'];
};

export type OverstyrtDag = {
    __typename?: 'OverstyrtDag';
    dato: Scalars['String']['output'];
    fraGrad?: Maybe<Scalars['Int']['output']>;
    fraType?: Maybe<Dagtype>;
    grad?: Maybe<Scalars['Int']['output']>;
    type: Dagtype;
};

export type OverstyrtInntekt = {
    __typename?: 'OverstyrtInntekt';
    begrunnelse: Scalars['String']['output'];
    forklaring: Scalars['String']['output'];
    fraManedligInntekt?: Maybe<Scalars['Float']['output']>;
    fraRefusjonsopplysninger?: Maybe<Array<Refusjonsopplysning>>;
    manedligInntekt: Scalars['Float']['output'];
    refusjonsopplysninger?: Maybe<Array<Refusjonsopplysning>>;
    skjaeringstidspunkt: Scalars['String']['output'];
};

export type Periode = {
    erForkastet: Scalars['Boolean']['output'];
    fom: Scalars['String']['output'];
    hendelser: Array<Hendelse>;
    inntektstype: Inntektstype;
    opprettet: Scalars['String']['output'];
    periodetilstand: Periodetilstand;
    periodetype: Periodetype;
    skjaeringstidspunkt: Scalars['String']['output'];
    tidslinje: Array<Dag>;
    tom: Scalars['String']['output'];
    varsler: Array<VarselDto>;
    vedtaksperiodeId: Scalars['String']['output'];
};

export type PeriodeHistorikkElement = {
    __typename?: 'PeriodeHistorikkElement';
    notat_id?: Maybe<Scalars['Int']['output']>;
    saksbehandler_ident?: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['String']['output'];
    type: PeriodehistorikkType;
};

export enum Periodehandling {
    Utbetale = 'UTBETALE',
}

export enum PeriodehistorikkType {
    TotrinnsvurderingAttestert = 'TOTRINNSVURDERING_ATTESTERT',
    TotrinnsvurderingRetur = 'TOTRINNSVURDERING_RETUR',
    TotrinnsvurderingTilGodkjenning = 'TOTRINNSVURDERING_TIL_GODKJENNING',
    VedtaksperiodeReberegnet = 'VEDTAKSPERIODE_REBEREGNET',
}

export enum Periodetilstand {
    AnnulleringFeilet = 'AnnulleringFeilet',
    Annullert = 'Annullert',
    ForberederGodkjenning = 'ForberederGodkjenning',
    IngenUtbetaling = 'IngenUtbetaling',
    ManglerInformasjon = 'ManglerInformasjon',
    RevurderingFeilet = 'RevurderingFeilet',
    TilAnnullering = 'TilAnnullering',
    TilGodkjenning = 'TilGodkjenning',
    TilInfotrygd = 'TilInfotrygd',
    TilUtbetaling = 'TilUtbetaling',
    Ukjent = 'Ukjent',
    UtbetalingFeilet = 'UtbetalingFeilet',
    Utbetalt = 'Utbetalt',
    UtbetaltVenterPaEnAnnenPeriode = 'UtbetaltVenterPaEnAnnenPeriode',
    VenterPaEnAnnenPeriode = 'VenterPaEnAnnenPeriode',
}

export enum Periodetype {
    Forlengelse = 'FORLENGELSE',
    Forstegangsbehandling = 'FORSTEGANGSBEHANDLING',
    Infotrygdforlengelse = 'INFOTRYGDFORLENGELSE',
    OvergangFraIt = 'OVERGANG_FRA_IT',
}

export type Periodevilkar = {
    __typename?: 'Periodevilkar';
    alder: Alder;
    soknadsfrist?: Maybe<Soknadsfrist>;
    sykepengedager: Sykepengedager;
};

export type Person = {
    __typename?: 'Person';
    aktorId: Scalars['String']['output'];
    arbeidsgivere: Array<Arbeidsgiver>;
    dodsdato?: Maybe<Scalars['String']['output']>;
    enhet: Enhet;
    fodselsnummer: Scalars['String']['output'];
    infotrygdutbetalinger?: Maybe<Array<Infotrygdutbetaling>>;
    personinfo: Personinfo;
    tildeling?: Maybe<Tildeling>;
    versjon: Scalars['Int']['output'];
    vilkarsgrunnlag: Array<Vilkarsgrunnlag>;
};

export type Personinfo = {
    __typename?: 'Personinfo';
    adressebeskyttelse: Adressebeskyttelse;
    etternavn: Scalars['String']['output'];
    fodselsdato?: Maybe<Scalars['String']['output']>;
    fornavn: Scalars['String']['output'];
    kjonn: Kjonn;
    mellomnavn?: Maybe<Scalars['String']['output']>;
    reservasjon?: Maybe<Reservasjon>;
};

export type Personnavn = {
    __typename?: 'Personnavn';
    etternavn: Scalars['String']['output'];
    fornavn: Scalars['String']['output'];
    mellomnavn?: Maybe<Scalars['String']['output']>;
};

export type Personoppdrag = Spennoppdrag & {
    __typename?: 'Personoppdrag';
    fagsystemId: Scalars['String']['output'];
    fodselsnummer: Scalars['String']['output'];
    linjer: Array<Utbetalingslinje>;
};

export type Query = {
    __typename?: 'Query';
    alleOppgaver: Array<OppgaveForOversiktsvisning>;
    behandledeOppgaver: Array<FerdigstiltOppgave>;
    behandlingsstatistikk: Behandlingsstatistikk;
    hentOpptegnelser: Array<Opptegnelse>;
    notater: Array<Notater>;
    oppdrag: Array<Oppdrag>;
    person?: Maybe<Person>;
};

export type QueryBehandledeOppgaverArgs = {
    behandletAvIdent?: InputMaybe<Scalars['String']['input']>;
    behandletAvOid: Scalars['String']['input'];
    fom?: InputMaybe<Scalars['String']['input']>;
};

export type QueryHentOpptegnelserArgs = {
    sekvensId?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryNotaterArgs = {
    forPerioder: Array<Scalars['String']['input']>;
};

export type QueryOppdragArgs = {
    fnr: Scalars['String']['input'];
};

export type QueryPersonArgs = {
    aktorId?: InputMaybe<Scalars['String']['input']>;
    fnr?: InputMaybe<Scalars['String']['input']>;
};

export type Refusjonselement = {
    __typename?: 'Refusjonselement';
    belop: Scalars['Float']['output'];
    fom: Scalars['String']['output'];
    meldingsreferanseId: Scalars['String']['output'];
    tom?: Maybe<Scalars['String']['output']>;
};

export type Refusjonsopplysning = {
    __typename?: 'Refusjonsopplysning';
    belop: Scalars['Float']['output'];
    fom: Scalars['String']['output'];
    tom?: Maybe<Scalars['String']['output']>;
};

export type Reservasjon = {
    __typename?: 'Reservasjon';
    kanVarsles: Scalars['Boolean']['output'];
    reservert: Scalars['Boolean']['output'];
};

export type Risikovurdering = {
    __typename?: 'Risikovurdering';
    funn?: Maybe<Array<Faresignal>>;
    kontrollertOk: Array<Faresignal>;
};

export type Saksbehandler = {
    __typename?: 'Saksbehandler';
    ident?: Maybe<Scalars['String']['output']>;
    navn: Scalars['String']['output'];
};

export type Sammenligningsgrunnlag = {
    __typename?: 'Sammenligningsgrunnlag';
    belop: Scalars['Float']['output'];
    inntektFraAOrdningen: Array<InntektFraAOrdningen>;
};

export type Simulering = {
    __typename?: 'Simulering';
    fagsystemId: Scalars['String']['output'];
    perioder?: Maybe<Array<Simuleringsperiode>>;
    tidsstempel: Scalars['String']['output'];
    totalbelop?: Maybe<Scalars['Int']['output']>;
    utbetalingslinjer: Array<Simuleringslinje>;
};

export type Simuleringsdetaljer = {
    __typename?: 'Simuleringsdetaljer';
    antallSats: Scalars['Int']['output'];
    belop: Scalars['Int']['output'];
    fom: Scalars['String']['output'];
    klassekode: Scalars['String']['output'];
    klassekodebeskrivelse: Scalars['String']['output'];
    konto: Scalars['String']['output'];
    refunderesOrgNr: Scalars['String']['output'];
    sats: Scalars['Float']['output'];
    tilbakeforing: Scalars['Boolean']['output'];
    tom: Scalars['String']['output'];
    typeSats: Scalars['String']['output'];
    uforegrad: Scalars['Int']['output'];
    utbetalingstype: Scalars['String']['output'];
};

export type Simuleringslinje = {
    __typename?: 'Simuleringslinje';
    dagsats: Scalars['Int']['output'];
    fom: Scalars['String']['output'];
    grad: Scalars['Int']['output'];
    tom: Scalars['String']['output'];
};

export type Simuleringsperiode = {
    __typename?: 'Simuleringsperiode';
    fom: Scalars['String']['output'];
    tom: Scalars['String']['output'];
    utbetalinger: Array<Simuleringsutbetaling>;
};

export type Simuleringsutbetaling = {
    __typename?: 'Simuleringsutbetaling';
    detaljer: Array<Simuleringsdetaljer>;
    feilkonto: Scalars['Boolean']['output'];
    forfall: Scalars['String']['output'];
    mottakerId: Scalars['String']['output'];
    mottakerNavn: Scalars['String']['output'];
};

export type SkjonnsfastsattSykepengegrunnlag = {
    __typename?: 'SkjonnsfastsattSykepengegrunnlag';
    arlig: Scalars['Float']['output'];
    arsak: Scalars['String']['output'];
    begrunnelse: Scalars['String']['output'];
    fraArlig?: Maybe<Scalars['Float']['output']>;
    skjaeringstidspunkt: Scalars['String']['output'];
};

export type SoknadArbeidsgiver = Hendelse & {
    __typename?: 'SoknadArbeidsgiver';
    fom: Scalars['String']['output'];
    id: Scalars['String']['output'];
    rapportertDato: Scalars['String']['output'];
    sendtArbeidsgiver: Scalars['String']['output'];
    tom: Scalars['String']['output'];
    type: Hendelsetype;
};

export type SoknadNav = Hendelse & {
    __typename?: 'SoknadNav';
    fom: Scalars['String']['output'];
    id: Scalars['String']['output'];
    rapportertDato: Scalars['String']['output'];
    sendtNav: Scalars['String']['output'];
    tom: Scalars['String']['output'];
    type: Hendelsetype;
};

export type Soknadsfrist = {
    __typename?: 'Soknadsfrist';
    oppfylt: Scalars['Boolean']['output'];
    sendtNav: Scalars['String']['output'];
    soknadFom: Scalars['String']['output'];
    soknadTom: Scalars['String']['output'];
};

export type Spennoppdrag = {
    fagsystemId: Scalars['String']['output'];
    linjer: Array<Utbetalingslinje>;
};

export enum Sykdomsdagtype {
    Arbeidsdag = 'ARBEIDSDAG',
    Arbeidsgiverdag = 'ARBEIDSGIVERDAG',
    Avslatt = 'AVSLATT',
    Feriedag = 'FERIEDAG',
    Ferieutensykmeldingdag = 'FERIEUTENSYKMELDINGDAG',
    ForeldetSykedag = 'FORELDET_SYKEDAG',
    FriskHelgedag = 'FRISK_HELGEDAG',
    Permisjonsdag = 'PERMISJONSDAG',
    Sykedag = 'SYKEDAG',
    SykHelgedag = 'SYK_HELGEDAG',
    Ubestemtdag = 'UBESTEMTDAG',
}

export type Sykepengedager = {
    __typename?: 'Sykepengedager';
    forbrukteSykedager?: Maybe<Scalars['Int']['output']>;
    gjenstaendeSykedager?: Maybe<Scalars['Int']['output']>;
    maksdato: Scalars['String']['output'];
    oppfylt: Scalars['Boolean']['output'];
    skjaeringstidspunkt: Scalars['String']['output'];
};

export type Sykepengegrunnlagsgrense = {
    __typename?: 'Sykepengegrunnlagsgrense';
    grense: Scalars['Int']['output'];
    grunnbelop: Scalars['Int']['output'];
    virkningstidspunkt: Scalars['String']['output'];
};

export type Sykepengegrunnlagskjonnsfastsetting = Overstyring & {
    __typename?: 'Sykepengegrunnlagskjonnsfastsetting';
    ferdigstilt: Scalars['Boolean']['output'];
    hendelseId: Scalars['String']['output'];
    saksbehandler: Saksbehandler;
    skjonnsfastsatt: SkjonnsfastsattSykepengegrunnlag;
    timestamp: Scalars['String']['output'];
};

export type Sykmelding = Hendelse & {
    __typename?: 'Sykmelding';
    fom: Scalars['String']['output'];
    id: Scalars['String']['output'];
    rapportertDato: Scalars['String']['output'];
    tom: Scalars['String']['output'];
    type: Hendelsetype;
};

export type Tildeling = {
    __typename?: 'Tildeling';
    epost: Scalars['String']['output'];
    navn: Scalars['String']['output'];
    oid: Scalars['String']['output'];
    paaVent: Scalars['Boolean']['output'];
    /** @deprecated Skal fjernes til fordel for paaVent */
    reservert?: Maybe<Scalars['Boolean']['output']>;
};

export type Totrinnsvurdering = {
    __typename?: 'Totrinnsvurdering';
    beslutter?: Maybe<Scalars['String']['output']>;
    erBeslutteroppgave: Scalars['Boolean']['output'];
    erRetur: Scalars['Boolean']['output'];
    saksbehandler?: Maybe<Scalars['String']['output']>;
};

export type UberegnetPeriode = Periode & {
    __typename?: 'UberegnetPeriode';
    erForkastet: Scalars['Boolean']['output'];
    fom: Scalars['String']['output'];
    hendelser: Array<Hendelse>;
    id: Scalars['String']['output'];
    inntektstype: Inntektstype;
    notater: Array<Notat>;
    opprettet: Scalars['String']['output'];
    periodetilstand: Periodetilstand;
    periodetype: Periodetype;
    skjaeringstidspunkt: Scalars['String']['output'];
    tidslinje: Array<Dag>;
    tom: Scalars['String']['output'];
    varsler: Array<VarselDto>;
    vedtaksperiodeId: Scalars['String']['output'];
};

export type Utbetaling = {
    __typename?: 'Utbetaling';
    arbeidsgiverFagsystemId: Scalars['String']['output'];
    arbeidsgiverNettoBelop: Scalars['Int']['output'];
    arbeidsgiversimulering?: Maybe<Simulering>;
    id: Scalars['String']['output'];
    personFagsystemId: Scalars['String']['output'];
    personNettoBelop: Scalars['Int']['output'];
    personsimulering?: Maybe<Simulering>;
    status: Utbetalingstatus;
    type: Utbetalingtype;
    vurdering?: Maybe<Vurdering>;
};

export enum Utbetalingsdagtype {
    Arbeidsdag = 'ARBEIDSDAG',
    Arbeidsgiverperiodedag = 'ARBEIDSGIVERPERIODEDAG',
    AvvistDag = 'AVVIST_DAG',
    Feriedag = 'FERIEDAG',
    ForeldetDag = 'FORELDET_DAG',
    Helgedag = 'HELGEDAG',
    Navdag = 'NAVDAG',
    Navhelgdag = 'NAVHELGDAG',
    UkjentDag = 'UKJENT_DAG',
}

export type Utbetalingsinfo = {
    __typename?: 'Utbetalingsinfo';
    arbeidsgiverbelop?: Maybe<Scalars['Int']['output']>;
    inntekt?: Maybe<Scalars['Int']['output']>;
    personbelop?: Maybe<Scalars['Int']['output']>;
    refusjonsbelop?: Maybe<Scalars['Int']['output']>;
    totalGrad?: Maybe<Scalars['Float']['output']>;
    utbetaling?: Maybe<Scalars['Int']['output']>;
};

export type Utbetalingslinje = {
    __typename?: 'Utbetalingslinje';
    fom: Scalars['String']['output'];
    tom: Scalars['String']['output'];
    totalbelop: Scalars['Int']['output'];
};

export enum Utbetalingstatus {
    Annullert = 'ANNULLERT',
    Forkastet = 'FORKASTET',
    Godkjent = 'GODKJENT',
    Godkjentutenutbetaling = 'GODKJENTUTENUTBETALING',
    Ikkegodkjent = 'IKKEGODKJENT',
    Overfort = 'OVERFORT',
    Sendt = 'SENDT',
    Ubetalt = 'UBETALT',
    Ukjent = 'UKJENT',
    Utbetalingfeilet = 'UTBETALINGFEILET',
    Utbetalt = 'UTBETALT',
}

export enum Utbetalingtype {
    Annullering = 'ANNULLERING',
    Etterutbetaling = 'ETTERUTBETALING',
    Feriepenger = 'FERIEPENGER',
    Revurdering = 'REVURDERING',
    Ukjent = 'UKJENT',
    Utbetaling = 'UTBETALING',
}

export type VarselDto = {
    __typename?: 'VarselDTO';
    definisjonId: Scalars['String']['output'];
    forklaring?: Maybe<Scalars['String']['output']>;
    generasjonId: Scalars['String']['output'];
    handling?: Maybe<Scalars['String']['output']>;
    kode: Scalars['String']['output'];
    tittel: Scalars['String']['output'];
    vurdering?: Maybe<VarselvurderingDto>;
};

export enum Varselstatus {
    Aktiv = 'AKTIV',
    Avvist = 'AVVIST',
    Godkjent = 'GODKJENT',
    Vurdert = 'VURDERT',
}

export type VarselvurderingDto = {
    __typename?: 'VarselvurderingDTO';
    ident: Scalars['String']['output'];
    status: Varselstatus;
    tidsstempel: Scalars['String']['output'];
};

export type Vilkarsgrunnlag = {
    arbeidsgiverrefusjoner: Array<Arbeidsgiverrefusjon>;
    id: Scalars['String']['output'];
    inntekter: Array<Arbeidsgiverinntekt>;
    omregnetArsinntekt: Scalars['Float']['output'];
    sammenligningsgrunnlag?: Maybe<Scalars['Float']['output']>;
    skjaeringstidspunkt: Scalars['String']['output'];
    sykepengegrunnlag: Scalars['Float']['output'];
    vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
};

export type VilkarsgrunnlagInfotrygd = Vilkarsgrunnlag & {
    __typename?: 'VilkarsgrunnlagInfotrygd';
    arbeidsgiverrefusjoner: Array<Arbeidsgiverrefusjon>;
    id: Scalars['String']['output'];
    inntekter: Array<Arbeidsgiverinntekt>;
    omregnetArsinntekt: Scalars['Float']['output'];
    sammenligningsgrunnlag?: Maybe<Scalars['Float']['output']>;
    skjaeringstidspunkt: Scalars['String']['output'];
    sykepengegrunnlag: Scalars['Float']['output'];
    vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
};

export type VilkarsgrunnlagSpleis = Vilkarsgrunnlag & {
    __typename?: 'VilkarsgrunnlagSpleis';
    antallOpptjeningsdagerErMinst: Scalars['Int']['output'];
    arbeidsgiverrefusjoner: Array<Arbeidsgiverrefusjon>;
    avviksprosent?: Maybe<Scalars['Float']['output']>;
    grunnbelop: Scalars['Int']['output'];
    id: Scalars['String']['output'];
    inntekter: Array<Arbeidsgiverinntekt>;
    omregnetArsinntekt: Scalars['Float']['output'];
    oppfyllerKravOmMedlemskap?: Maybe<Scalars['Boolean']['output']>;
    oppfyllerKravOmMinstelonn: Scalars['Boolean']['output'];
    oppfyllerKravOmOpptjening: Scalars['Boolean']['output'];
    opptjeningFra: Scalars['String']['output'];
    sammenligningsgrunnlag?: Maybe<Scalars['Float']['output']>;
    skjaeringstidspunkt: Scalars['String']['output'];
    skjonnsmessigFastsattAarlig?: Maybe<Scalars['Float']['output']>;
    sykepengegrunnlag: Scalars['Float']['output'];
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
};

export enum Vilkarsgrunnlagtype {
    Infotrygd = 'INFOTRYGD',
    Spleis = 'SPLEIS',
    Ukjent = 'UKJENT',
}

export type Vurdering = {
    __typename?: 'Vurdering';
    automatisk: Scalars['Boolean']['output'];
    godkjent: Scalars['Boolean']['output'];
    ident: Scalars['String']['output'];
    tidsstempel: Scalars['String']['output'];
};

export type FetchBehandledeOppgaverQueryVariables = Exact<{
    oid: Scalars['String']['input'];
    fom: Scalars['String']['input'];
}>;

export type FetchBehandledeOppgaverQuery = {
    __typename?: 'Query';
    behandledeOppgaver: Array<{
        __typename?: 'FerdigstiltOppgave';
        aktorId: string;
        bosted?: string | null;
        ferdigstiltAv?: string | null;
        ferdigstiltTidspunkt: string;
        id: string;
        inntektstype: Inntektstype;
        periodetype: Periodetype;
        type: Oppgavetype;
        personnavn: { __typename?: 'Personnavn'; fornavn: string; mellomnavn?: string | null; etternavn: string };
    }>;
};

export type AntallFragment = { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };

export type HentBehandlingsstatistikkQueryVariables = Exact<{ [key: string]: never }>;

export type HentBehandlingsstatistikkQuery = {
    __typename?: 'Query';
    behandlingsstatistikk: {
        __typename?: 'Behandlingsstatistikk';
        antallAnnulleringer: number;
        enArbeidsgiver: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        flereArbeidsgivere: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        beslutter: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        delvisRefusjon: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        faresignaler: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        forlengelser: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        forlengelseIt: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        forstegangsbehandling: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        fortroligAdresse: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        revurdering: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        stikkprover: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        utbetalingTilArbeidsgiver: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        utbetalingTilSykmeldt: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
    };
};

export type FetchOppdragQueryVariables = Exact<{
    fnr: Scalars['String']['input'];
}>;

export type FetchOppdragQuery = {
    __typename?: 'Query';
    oppdrag: Array<{
        __typename?: 'Oppdrag';
        type: string;
        status: Oppdragsstatus;
        arbeidsgiveroppdrag?: {
            __typename?: 'Arbeidsgiveroppdrag';
            organisasjonsnummer: string;
            fagsystemId: string;
            linjer: Array<{ __typename?: 'Utbetalingslinje'; fom: string; tom: string; totalbelop: number }>;
        } | null;
        personoppdrag?: {
            __typename?: 'Personoppdrag';
            fodselsnummer: string;
            fagsystemId: string;
            linjer: Array<{ __typename?: 'Utbetalingslinje'; fom: string; tom: string; totalbelop: number }>;
        } | null;
        annullering?: { __typename?: 'Annullering'; saksbehandler: string; tidspunkt: string } | null;
    }>;
};

export type FetchOppgaverQueryVariables = Exact<{ [key: string]: never }>;

export type FetchOppgaverQuery = {
    __typename?: 'Query';
    alleOppgaver: Array<{
        __typename?: 'OppgaveForOversiktsvisning';
        id: string;
        aktorId: string;
        opprettet: string;
        opprinneligSoknadsdato: string;
        vedtaksperiodeId: string;
        type: Oppgavetype;
        periodetype?: Periodetype | null;
        flereArbeidsgivere: boolean;
        sistSendt?: string | null;
        mottaker?: Mottaker | null;
        haster?: boolean | null;
        navn: { __typename?: 'Personnavn'; fornavn: string; mellomnavn?: string | null; etternavn: string };
        tildeling?: {
            __typename?: 'Tildeling';
            reservert?: boolean | null;
            navn: string;
            epost: string;
            oid: string;
            paaVent: boolean;
        } | null;
        totrinnsvurdering?: {
            __typename?: 'Totrinnsvurdering';
            saksbehandler?: string | null;
            erRetur: boolean;
            erBeslutteroppgave: boolean;
        } | null;
    }>;
};

export type SimuleringFragment = {
    __typename?: 'Simulering';
    fagsystemId: string;
    totalbelop?: number | null;
    tidsstempel: string;
    utbetalingslinjer: Array<{
        __typename?: 'Simuleringslinje';
        fom: string;
        tom: string;
        dagsats: number;
        grad: number;
    }>;
    perioder?: Array<{
        __typename?: 'Simuleringsperiode';
        fom: string;
        tom: string;
        utbetalinger: Array<{
            __typename?: 'Simuleringsutbetaling';
            mottakerId: string;
            mottakerNavn: string;
            forfall: string;
            feilkonto: boolean;
            detaljer: Array<{
                __typename?: 'Simuleringsdetaljer';
                fom: string;
                tom: string;
                utbetalingstype: string;
                uforegrad: number;
                typeSats: string;
                tilbakeforing: boolean;
                sats: number;
                refunderesOrgNr: string;
                konto: string;
                klassekode: string;
                antallSats: number;
                belop: number;
                klassekodebeskrivelse: string;
            }>;
        }>;
    }> | null;
};

type Vilkarsgrunnlag_VilkarsgrunnlagInfotrygd_Fragment = {
    __typename?: 'VilkarsgrunnlagInfotrygd';
    id: string;
    sykepengegrunnlag: number;
    skjaeringstidspunkt: string;
    omregnetArsinntekt: number;
    sammenligningsgrunnlag?: number | null;
    vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
    inntekter: Array<{
        __typename?: 'Arbeidsgiverinntekt';
        arbeidsgiver: string;
        deaktivert?: boolean | null;
        sammenligningsgrunnlag?: {
            __typename?: 'Sammenligningsgrunnlag';
            belop: number;
            inntektFraAOrdningen: Array<{ __typename?: 'InntektFraAOrdningen'; maned: string; sum: number }>;
        } | null;
        omregnetArsinntekt?: {
            __typename?: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Inntektskilde;
            inntektFraAOrdningen?: Array<{ __typename?: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
        skjonnsmessigFastsatt?: {
            __typename?: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Inntektskilde;
            inntektFraAOrdningen?: Array<{ __typename?: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
    }>;
    arbeidsgiverrefusjoner: Array<{
        __typename?: 'Arbeidsgiverrefusjon';
        arbeidsgiver: string;
        refusjonsopplysninger: Array<{
            __typename?: 'Refusjonselement';
            fom: string;
            tom?: string | null;
            belop: number;
            meldingsreferanseId: string;
        }>;
    }>;
};

type Vilkarsgrunnlag_VilkarsgrunnlagSpleis_Fragment = {
    __typename?: 'VilkarsgrunnlagSpleis';
    skjonnsmessigFastsattAarlig?: number | null;
    oppfyllerKravOmMinstelonn: boolean;
    oppfyllerKravOmMedlemskap?: boolean | null;
    oppfyllerKravOmOpptjening: boolean;
    antallOpptjeningsdagerErMinst: number;
    grunnbelop: number;
    avviksprosent?: number | null;
    opptjeningFra: string;
    id: string;
    sykepengegrunnlag: number;
    skjaeringstidspunkt: string;
    omregnetArsinntekt: number;
    sammenligningsgrunnlag?: number | null;
    vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
    sykepengegrunnlagsgrense: {
        __typename?: 'Sykepengegrunnlagsgrense';
        grunnbelop: number;
        grense: number;
        virkningstidspunkt: string;
    };
    inntekter: Array<{
        __typename?: 'Arbeidsgiverinntekt';
        arbeidsgiver: string;
        deaktivert?: boolean | null;
        sammenligningsgrunnlag?: {
            __typename?: 'Sammenligningsgrunnlag';
            belop: number;
            inntektFraAOrdningen: Array<{ __typename?: 'InntektFraAOrdningen'; maned: string; sum: number }>;
        } | null;
        omregnetArsinntekt?: {
            __typename?: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Inntektskilde;
            inntektFraAOrdningen?: Array<{ __typename?: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
        skjonnsmessigFastsatt?: {
            __typename?: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Inntektskilde;
            inntektFraAOrdningen?: Array<{ __typename?: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
    }>;
    arbeidsgiverrefusjoner: Array<{
        __typename?: 'Arbeidsgiverrefusjon';
        arbeidsgiver: string;
        refusjonsopplysninger: Array<{
            __typename?: 'Refusjonselement';
            fom: string;
            tom?: string | null;
            belop: number;
            meldingsreferanseId: string;
        }>;
    }>;
};

export type VilkarsgrunnlagFragment =
    | Vilkarsgrunnlag_VilkarsgrunnlagInfotrygd_Fragment
    | Vilkarsgrunnlag_VilkarsgrunnlagSpleis_Fragment;

export type NotatFragment = {
    __typename?: 'Notat';
    id: number;
    tekst: string;
    opprettet: string;
    saksbehandlerOid: string;
    saksbehandlerNavn: string;
    saksbehandlerEpost: string;
    saksbehandlerIdent: string;
    vedtaksperiodeId: string;
    feilregistrert: boolean;
    feilregistrert_tidspunkt?: string | null;
    type: NotatType;
    kommentarer: Array<{
        __typename?: 'Kommentar';
        id: number;
        tekst: string;
        opprettet: string;
        saksbehandlerident: string;
        feilregistrert_tidspunkt?: string | null;
    }>;
};

export type FetchPersonQueryVariables = Exact<{
    fnr?: InputMaybe<Scalars['String']['input']>;
    aktorId?: InputMaybe<Scalars['String']['input']>;
}>;

export type FetchPersonQuery = {
    __typename?: 'Query';
    person?: {
        __typename?: 'Person';
        fodselsnummer: string;
        dodsdato?: string | null;
        versjon: number;
        aktorId: string;
        enhet: { __typename?: 'Enhet'; id: string; navn: string };
        infotrygdutbetalinger?: Array<{
            __typename?: 'Infotrygdutbetaling';
            organisasjonsnummer: string;
            dagsats: number;
            fom: string;
            tom: string;
            grad: string;
            typetekst: string;
        }> | null;
        personinfo: {
            __typename?: 'Personinfo';
            fornavn: string;
            mellomnavn?: string | null;
            etternavn: string;
            adressebeskyttelse: Adressebeskyttelse;
            fodselsdato?: string | null;
            kjonn: Kjonn;
            reservasjon?: { __typename?: 'Reservasjon'; kanVarsles: boolean; reservert: boolean } | null;
        };
        tildeling?: {
            __typename?: 'Tildeling';
            navn: string;
            epost: string;
            oid: string;
            reservert?: boolean | null;
            paaVent: boolean;
        } | null;
        vilkarsgrunnlag: Array<
            | {
                  __typename?: 'VilkarsgrunnlagInfotrygd';
                  id: string;
                  sykepengegrunnlag: number;
                  skjaeringstidspunkt: string;
                  omregnetArsinntekt: number;
                  sammenligningsgrunnlag?: number | null;
                  vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
                  inntekter: Array<{
                      __typename?: 'Arbeidsgiverinntekt';
                      arbeidsgiver: string;
                      deaktivert?: boolean | null;
                      sammenligningsgrunnlag?: {
                          __typename?: 'Sammenligningsgrunnlag';
                          belop: number;
                          inntektFraAOrdningen: Array<{
                              __typename?: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }>;
                      } | null;
                      omregnetArsinntekt?: {
                          __typename?: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Inntektskilde;
                          inntektFraAOrdningen?: Array<{
                              __typename?: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                      skjonnsmessigFastsatt?: {
                          __typename?: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Inntektskilde;
                          inntektFraAOrdningen?: Array<{
                              __typename?: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                  }>;
                  arbeidsgiverrefusjoner: Array<{
                      __typename?: 'Arbeidsgiverrefusjon';
                      arbeidsgiver: string;
                      refusjonsopplysninger: Array<{
                          __typename?: 'Refusjonselement';
                          fom: string;
                          tom?: string | null;
                          belop: number;
                          meldingsreferanseId: string;
                      }>;
                  }>;
              }
            | {
                  __typename?: 'VilkarsgrunnlagSpleis';
                  skjonnsmessigFastsattAarlig?: number | null;
                  oppfyllerKravOmMinstelonn: boolean;
                  oppfyllerKravOmMedlemskap?: boolean | null;
                  oppfyllerKravOmOpptjening: boolean;
                  antallOpptjeningsdagerErMinst: number;
                  grunnbelop: number;
                  avviksprosent?: number | null;
                  opptjeningFra: string;
                  id: string;
                  sykepengegrunnlag: number;
                  skjaeringstidspunkt: string;
                  omregnetArsinntekt: number;
                  sammenligningsgrunnlag?: number | null;
                  vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
                  sykepengegrunnlagsgrense: {
                      __typename?: 'Sykepengegrunnlagsgrense';
                      grunnbelop: number;
                      grense: number;
                      virkningstidspunkt: string;
                  };
                  inntekter: Array<{
                      __typename?: 'Arbeidsgiverinntekt';
                      arbeidsgiver: string;
                      deaktivert?: boolean | null;
                      sammenligningsgrunnlag?: {
                          __typename?: 'Sammenligningsgrunnlag';
                          belop: number;
                          inntektFraAOrdningen: Array<{
                              __typename?: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }>;
                      } | null;
                      omregnetArsinntekt?: {
                          __typename?: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Inntektskilde;
                          inntektFraAOrdningen?: Array<{
                              __typename?: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                      skjonnsmessigFastsatt?: {
                          __typename?: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Inntektskilde;
                          inntektFraAOrdningen?: Array<{
                              __typename?: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                  }>;
                  arbeidsgiverrefusjoner: Array<{
                      __typename?: 'Arbeidsgiverrefusjon';
                      arbeidsgiver: string;
                      refusjonsopplysninger: Array<{
                          __typename?: 'Refusjonselement';
                          fom: string;
                          tom?: string | null;
                          belop: number;
                          meldingsreferanseId: string;
                      }>;
                  }>;
              }
        >;
        arbeidsgivere: Array<{
            __typename?: 'Arbeidsgiver';
            bransjer: Array<string>;
            navn: string;
            organisasjonsnummer: string;
            arbeidsforhold: Array<{
                __typename?: 'Arbeidsforhold';
                sluttdato?: string | null;
                startdato: string;
                stillingsprosent: number;
                stillingstittel: string;
            }>;
            ghostPerioder: Array<{
                __typename?: 'GhostPeriode';
                id: string;
                deaktivert: boolean;
                vilkarsgrunnlagId?: string | null;
                skjaeringstidspunkt: string;
                fom: string;
                tom: string;
                organisasjonsnummer: string;
            }>;
            generasjoner: Array<{
                __typename?: 'Generasjon';
                id: string;
                perioder: Array<
                    | {
                          __typename?: 'BeregnetPeriode';
                          id: string;
                          beregningId: string;
                          forbrukteSykedager?: number | null;
                          gjenstaendeSykedager?: number | null;
                          maksdato: string;
                          vilkarsgrunnlagId?: string | null;
                          fom: string;
                          tom: string;
                          erForkastet: boolean;
                          inntektstype: Inntektstype;
                          opprettet: string;
                          periodetype: Periodetype;
                          vedtaksperiodeId: string;
                          periodetilstand: Periodetilstand;
                          skjaeringstidspunkt: string;
                          inntektFraAordningen: Array<{
                              __typename?: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }>;
                          handlinger: Array<{
                              __typename?: 'Handling';
                              type: Periodehandling;
                              tillatt: boolean;
                              begrunnelse?: string | null;
                          }>;
                          notater: Array<{
                              __typename?: 'Notat';
                              id: number;
                              tekst: string;
                              opprettet: string;
                              saksbehandlerOid: string;
                              saksbehandlerNavn: string;
                              saksbehandlerEpost: string;
                              saksbehandlerIdent: string;
                              vedtaksperiodeId: string;
                              feilregistrert: boolean;
                              feilregistrert_tidspunkt?: string | null;
                              type: NotatType;
                              kommentarer: Array<{
                                  __typename?: 'Kommentar';
                                  id: number;
                                  tekst: string;
                                  opprettet: string;
                                  saksbehandlerident: string;
                                  feilregistrert_tidspunkt?: string | null;
                              }>;
                          }>;
                          periodehistorikk: Array<{
                              __typename?: 'PeriodeHistorikkElement';
                              type: PeriodehistorikkType;
                              timestamp: string;
                              saksbehandler_ident?: string | null;
                              notat_id?: number | null;
                          }>;
                          periodevilkar: {
                              __typename?: 'Periodevilkar';
                              alder: { __typename?: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
                              soknadsfrist?: {
                                  __typename?: 'Soknadsfrist';
                                  oppfylt: boolean;
                                  sendtNav: string;
                                  soknadFom: string;
                                  soknadTom: string;
                              } | null;
                              sykepengedager: {
                                  __typename?: 'Sykepengedager';
                                  forbrukteSykedager?: number | null;
                                  gjenstaendeSykedager?: number | null;
                                  maksdato: string;
                                  oppfylt: boolean;
                                  skjaeringstidspunkt: string;
                              };
                          };
                          risikovurdering?: {
                              __typename?: 'Risikovurdering';
                              funn?: Array<{
                                  __typename?: 'Faresignal';
                                  beskrivelse: string;
                                  kategori: Array<string>;
                              }> | null;
                              kontrollertOk: Array<{
                                  __typename?: 'Faresignal';
                                  beskrivelse: string;
                                  kategori: Array<string>;
                              }>;
                          } | null;
                          utbetaling: {
                              __typename?: 'Utbetaling';
                              id: string;
                              arbeidsgiverFagsystemId: string;
                              arbeidsgiverNettoBelop: number;
                              personFagsystemId: string;
                              personNettoBelop: number;
                              status: Utbetalingstatus;
                              type: Utbetalingtype;
                              vurdering?: {
                                  __typename?: 'Vurdering';
                                  automatisk: boolean;
                                  godkjent: boolean;
                                  ident: string;
                                  tidsstempel: string;
                              } | null;
                              arbeidsgiversimulering?: {
                                  __typename?: 'Simulering';
                                  fagsystemId: string;
                                  totalbelop?: number | null;
                                  tidsstempel: string;
                                  utbetalingslinjer: Array<{
                                      __typename?: 'Simuleringslinje';
                                      fom: string;
                                      tom: string;
                                      dagsats: number;
                                      grad: number;
                                  }>;
                                  perioder?: Array<{
                                      __typename?: 'Simuleringsperiode';
                                      fom: string;
                                      tom: string;
                                      utbetalinger: Array<{
                                          __typename?: 'Simuleringsutbetaling';
                                          mottakerId: string;
                                          mottakerNavn: string;
                                          forfall: string;
                                          feilkonto: boolean;
                                          detaljer: Array<{
                                              __typename?: 'Simuleringsdetaljer';
                                              fom: string;
                                              tom: string;
                                              utbetalingstype: string;
                                              uforegrad: number;
                                              typeSats: string;
                                              tilbakeforing: boolean;
                                              sats: number;
                                              refunderesOrgNr: string;
                                              konto: string;
                                              klassekode: string;
                                              antallSats: number;
                                              belop: number;
                                              klassekodebeskrivelse: string;
                                          }>;
                                      }>;
                                  }> | null;
                              } | null;
                              personsimulering?: {
                                  __typename?: 'Simulering';
                                  fagsystemId: string;
                                  totalbelop?: number | null;
                                  tidsstempel: string;
                                  utbetalingslinjer: Array<{
                                      __typename?: 'Simuleringslinje';
                                      fom: string;
                                      tom: string;
                                      dagsats: number;
                                      grad: number;
                                  }>;
                                  perioder?: Array<{
                                      __typename?: 'Simuleringsperiode';
                                      fom: string;
                                      tom: string;
                                      utbetalinger: Array<{
                                          __typename?: 'Simuleringsutbetaling';
                                          mottakerId: string;
                                          mottakerNavn: string;
                                          forfall: string;
                                          feilkonto: boolean;
                                          detaljer: Array<{
                                              __typename?: 'Simuleringsdetaljer';
                                              fom: string;
                                              tom: string;
                                              utbetalingstype: string;
                                              uforegrad: number;
                                              typeSats: string;
                                              tilbakeforing: boolean;
                                              sats: number;
                                              refunderesOrgNr: string;
                                              konto: string;
                                              klassekode: string;
                                              antallSats: number;
                                              belop: number;
                                              klassekodebeskrivelse: string;
                                          }>;
                                      }>;
                                  }> | null;
                              } | null;
                          };
                          oppgave?: { __typename?: 'OppgaveForPeriodevisning'; id: string } | null;
                          totrinnsvurdering?: {
                              __typename?: 'Totrinnsvurdering';
                              erBeslutteroppgave: boolean;
                              erRetur: boolean;
                              saksbehandler?: string | null;
                              beslutter?: string | null;
                          } | null;
                          tidslinje: Array<{
                              __typename?: 'Dag';
                              dato: string;
                              grad?: number | null;
                              sykdomsdagtype: Sykdomsdagtype;
                              utbetalingsdagtype: Utbetalingsdagtype;
                              begrunnelser?: Array<Begrunnelse> | null;
                              kilde: { __typename?: 'Kilde'; id: string; type: Kildetype };
                              utbetalingsinfo?: {
                                  __typename?: 'Utbetalingsinfo';
                                  arbeidsgiverbelop?: number | null;
                                  inntekt?: number | null;
                                  personbelop?: number | null;
                                  refusjonsbelop?: number | null;
                                  totalGrad?: number | null;
                                  utbetaling?: number | null;
                              } | null;
                          }>;
                          varsler: Array<{
                              __typename?: 'VarselDTO';
                              generasjonId: string;
                              definisjonId: string;
                              kode: string;
                              tittel: string;
                              forklaring?: string | null;
                              handling?: string | null;
                              vurdering?: {
                                  __typename?: 'VarselvurderingDTO';
                                  ident: string;
                                  status: Varselstatus;
                                  tidsstempel: string;
                              } | null;
                          }>;
                          hendelser: Array<
                              | {
                                    __typename?: 'Inntektsmelding';
                                    beregnetInntekt: number;
                                    mottattDato: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename?: 'SoknadArbeidsgiver';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtArbeidsgiver: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename?: 'SoknadNav';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename?: 'Sykmelding';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                          >;
                      }
                    | {
                          __typename?: 'UberegnetPeriode';
                          id: string;
                          fom: string;
                          tom: string;
                          erForkastet: boolean;
                          inntektstype: Inntektstype;
                          opprettet: string;
                          periodetype: Periodetype;
                          vedtaksperiodeId: string;
                          periodetilstand: Periodetilstand;
                          skjaeringstidspunkt: string;
                          notater: Array<{
                              __typename?: 'Notat';
                              id: number;
                              tekst: string;
                              opprettet: string;
                              saksbehandlerOid: string;
                              saksbehandlerNavn: string;
                              saksbehandlerEpost: string;
                              saksbehandlerIdent: string;
                              vedtaksperiodeId: string;
                              feilregistrert: boolean;
                              feilregistrert_tidspunkt?: string | null;
                              type: NotatType;
                              kommentarer: Array<{
                                  __typename?: 'Kommentar';
                                  id: number;
                                  tekst: string;
                                  opprettet: string;
                                  saksbehandlerident: string;
                                  feilregistrert_tidspunkt?: string | null;
                              }>;
                          }>;
                          tidslinje: Array<{
                              __typename?: 'Dag';
                              dato: string;
                              grad?: number | null;
                              sykdomsdagtype: Sykdomsdagtype;
                              utbetalingsdagtype: Utbetalingsdagtype;
                              begrunnelser?: Array<Begrunnelse> | null;
                              kilde: { __typename?: 'Kilde'; id: string; type: Kildetype };
                              utbetalingsinfo?: {
                                  __typename?: 'Utbetalingsinfo';
                                  arbeidsgiverbelop?: number | null;
                                  inntekt?: number | null;
                                  personbelop?: number | null;
                                  refusjonsbelop?: number | null;
                                  totalGrad?: number | null;
                                  utbetaling?: number | null;
                              } | null;
                          }>;
                          varsler: Array<{
                              __typename?: 'VarselDTO';
                              generasjonId: string;
                              definisjonId: string;
                              kode: string;
                              tittel: string;
                              forklaring?: string | null;
                              handling?: string | null;
                              vurdering?: {
                                  __typename?: 'VarselvurderingDTO';
                                  ident: string;
                                  status: Varselstatus;
                                  tidsstempel: string;
                              } | null;
                          }>;
                          hendelser: Array<
                              | {
                                    __typename?: 'Inntektsmelding';
                                    beregnetInntekt: number;
                                    mottattDato: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename?: 'SoknadArbeidsgiver';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtArbeidsgiver: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename?: 'SoknadNav';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename?: 'Sykmelding';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                          >;
                      }
                >;
            }>;
            overstyringer: Array<
                | {
                      __typename: 'Arbeidsforholdoverstyring';
                      begrunnelse: string;
                      deaktivert: boolean;
                      skjaeringstidspunkt: string;
                      forklaring: string;
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      saksbehandler: { __typename?: 'Saksbehandler'; ident?: string | null; navn: string };
                  }
                | {
                      __typename: 'Dagoverstyring';
                      begrunnelse: string;
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      dager: Array<{
                          __typename?: 'OverstyrtDag';
                          grad?: number | null;
                          fraGrad?: number | null;
                          dato: string;
                          type: Dagtype;
                          fraType?: Dagtype | null;
                      }>;
                      saksbehandler: { __typename?: 'Saksbehandler'; ident?: string | null; navn: string };
                  }
                | {
                      __typename: 'Inntektoverstyring';
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      inntekt: {
                          __typename?: 'OverstyrtInntekt';
                          skjaeringstidspunkt: string;
                          forklaring: string;
                          begrunnelse: string;
                          manedligInntekt: number;
                          fraManedligInntekt?: number | null;
                          refusjonsopplysninger?: Array<{
                              __typename?: 'Refusjonsopplysning';
                              fom: string;
                              tom?: string | null;
                              belop: number;
                          }> | null;
                          fraRefusjonsopplysninger?: Array<{
                              __typename?: 'Refusjonsopplysning';
                              fom: string;
                              tom?: string | null;
                              belop: number;
                          }> | null;
                      };
                      saksbehandler: { __typename?: 'Saksbehandler'; ident?: string | null; navn: string };
                  }
                | {
                      __typename: 'Sykepengegrunnlagskjonnsfastsetting';
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      skjonnsfastsatt: {
                          __typename?: 'SkjonnsfastsattSykepengegrunnlag';
                          arsak: string;
                          begrunnelse: string;
                          arlig: number;
                          fraArlig?: number | null;
                          skjaeringstidspunkt: string;
                      };
                      saksbehandler: { __typename?: 'Saksbehandler'; ident?: string | null; navn: string };
                  }
            >;
        }>;
    } | null;
};

export type FeilregistrerKommentarMutationMutationVariables = Exact<{
    id: Scalars['Int']['input'];
}>;

export type FeilregistrerKommentarMutationMutation = {
    __typename?: 'Mutation';
    feilregistrerKommentar?: {
        __typename?: 'Kommentar';
        id: number;
        opprettet: string;
        feilregistrert_tidspunkt?: string | null;
        saksbehandlerident: string;
        tekst: string;
    } | null;
};

export type LeggTilKommentarMutationVariables = Exact<{
    tekst: Scalars['String']['input'];
    notatId: Scalars['Int']['input'];
    saksbehandlerident: Scalars['String']['input'];
}>;

export type LeggTilKommentarMutation = {
    __typename?: 'Mutation';
    leggTilKommentar?: {
        __typename?: 'Kommentar';
        id: number;
        tekst: string;
        opprettet: string;
        saksbehandlerident: string;
        feilregistrert_tidspunkt?: string | null;
    } | null;
};

export type FeilregistrerNotatMutationMutationVariables = Exact<{
    id: Scalars['Int']['input'];
}>;

export type FeilregistrerNotatMutationMutation = {
    __typename?: 'Mutation';
    feilregistrerNotat?: {
        __typename?: 'Notat';
        id: number;
        tekst: string;
        opprettet: string;
        saksbehandlerOid: string;
        saksbehandlerNavn: string;
        saksbehandlerEpost: string;
        saksbehandlerIdent: string;
        vedtaksperiodeId: string;
        feilregistrert: boolean;
        feilregistrert_tidspunkt?: string | null;
        type: NotatType;
        kommentarer: Array<{
            __typename?: 'Kommentar';
            id: number;
            tekst: string;
            opprettet: string;
            saksbehandlerident: string;
            feilregistrert_tidspunkt?: string | null;
        }>;
    } | null;
};

export type LeggTilNotatMutationVariables = Exact<{
    type: NotatType;
    oid: Scalars['String']['input'];
    vedtaksperiodeId: Scalars['String']['input'];
    tekst: Scalars['String']['input'];
}>;

export type LeggTilNotatMutation = {
    __typename?: 'Mutation';
    leggTilNotat?: {
        __typename?: 'Notat';
        id: number;
        tekst: string;
        opprettet: string;
        saksbehandlerOid: string;
        saksbehandlerNavn: string;
        saksbehandlerEpost: string;
        saksbehandlerIdent: string;
        vedtaksperiodeId: string;
        feilregistrert: boolean;
        feilregistrert_tidspunkt?: string | null;
        type: NotatType;
        kommentarer: Array<{
            __typename?: 'Kommentar';
            id: number;
            tekst: string;
            opprettet: string;
            saksbehandlerident: string;
            feilregistrert_tidspunkt?: string | null;
        }>;
    } | null;
};

export type FetchNotaterQueryVariables = Exact<{
    forPerioder: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;

export type FetchNotaterQuery = {
    __typename?: 'Query';
    notater: Array<{
        __typename?: 'Notater';
        id: string;
        notater: Array<{
            __typename?: 'Notat';
            id: number;
            tekst: string;
            opprettet: string;
            saksbehandlerOid: string;
            saksbehandlerNavn: string;
            saksbehandlerEpost: string;
            saksbehandlerIdent: string;
            vedtaksperiodeId: string;
            feilregistrert: boolean;
            type: NotatType;
            kommentarer: Array<{
                __typename?: 'Kommentar';
                id: number;
                tekst: string;
                opprettet: string;
                saksbehandlerident: string;
                feilregistrert_tidspunkt?: string | null;
            }>;
        }>;
    }>;
};

export type SettVarselstatusAktivMutationVariables = Exact<{
    generasjonIdString: Scalars['String']['input'];
    varselkode: Scalars['String']['input'];
    ident: Scalars['String']['input'];
}>;

export type SettVarselstatusAktivMutation = {
    __typename?: 'Mutation';
    settVarselstatusAktiv?: {
        __typename?: 'VarselDTO';
        generasjonId: string;
        definisjonId: string;
        kode: string;
        tittel: string;
        forklaring?: string | null;
        handling?: string | null;
        vurdering?: {
            __typename?: 'VarselvurderingDTO';
            ident: string;
            status: Varselstatus;
            tidsstempel: string;
        } | null;
    } | null;
};

export type SettVarselstatusVurdertMutationVariables = Exact<{
    generasjonIdString: Scalars['String']['input'];
    definisjonIdString: Scalars['String']['input'];
    varselkode: Scalars['String']['input'];
    ident: Scalars['String']['input'];
}>;

export type SettVarselstatusVurdertMutation = {
    __typename?: 'Mutation';
    settVarselstatusVurdert?: {
        __typename?: 'VarselDTO';
        generasjonId: string;
        definisjonId: string;
        kode: string;
        tittel: string;
        forklaring?: string | null;
        handling?: string | null;
        vurdering?: {
            __typename?: 'VarselvurderingDTO';
            ident: string;
            status: Varselstatus;
            tidsstempel: string;
        } | null;
    } | null;
};

export type FjernPaaVentMutationVariables = Exact<{
    oppgaveId: Scalars['String']['input'];
}>;

export type FjernPaaVentMutation = {
    __typename?: 'Mutation';
    fjernPaaVent?: {
        __typename?: 'Tildeling';
        navn: string;
        oid: string;
        epost: string;
        reservert?: boolean | null;
        paaVent: boolean;
    } | null;
};

export type FjernTildelingMutationVariables = Exact<{
    oppgaveId: Scalars['String']['input'];
}>;

export type FjernTildelingMutation = { __typename?: 'Mutation'; fjernTildeling: boolean };

export type LeggPaaVentMutationVariables = Exact<{
    oppgaveId: Scalars['String']['input'];
    notatType: NotatType;
    notatTekst: Scalars['String']['input'];
}>;

export type LeggPaaVentMutation = {
    __typename?: 'Mutation';
    leggPaaVent?: {
        __typename?: 'Tildeling';
        navn: string;
        oid: string;
        epost: string;
        reservert?: boolean | null;
        paaVent: boolean;
    } | null;
};

export type OpprettTildelingMutationVariables = Exact<{
    oppgaveId: Scalars['String']['input'];
}>;

export type OpprettTildelingMutation = {
    __typename?: 'Mutation';
    opprettTildeling?: {
        __typename?: 'Tildeling';
        navn: string;
        oid: string;
        epost: string;
        reservert?: boolean | null;
        paaVent: boolean;
    } | null;
};

export const AntallFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'antall' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Antall' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'automatisk' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'manuelt' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'tilgjengelig' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AntallFragment, unknown>;
export const SimuleringFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'simulering' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Simulering' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fagsystemId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalbelop' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tom' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'grad' },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tom' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'mottakerId' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'mottakerNavn' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'feilkonto' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'fom' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tom' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'uforegrad' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'typeSats' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'sats' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'konto' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'klassekode' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'antallSats' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'belop' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'klassekodebeskrivelse' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SimuleringFragment, unknown>;
export const VilkarsgrunnlagFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'vilkarsgrunnlag' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Vilkarsgrunnlag' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sykepengegrunnlag' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'omregnetArsinntekt' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'sammenligningsgrunnlag' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sammenligningsgrunnlag' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'belop' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'maned' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'omregnetArsinntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'maned' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'manedsbelop' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsmessigFastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'maned' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'manedsbelop' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'deaktivert' },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgiverrefusjoner' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiver' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fom' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'belop' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'meldingsreferanseId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagtype' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagSpleis' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsmessigFastsattAarlig' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oppfyllerKravOmMinstelonn' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oppfyllerKravOmMedlemskap' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oppfyllerKravOmOpptjening' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'antallOpptjeningsdagerErMinst' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avviksprosent' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningFra' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengegrunnlagsgrense' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'grunnbelop' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'grense' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'virkningstidspunkt' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<VilkarsgrunnlagFragment, unknown>;
export const NotatFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'notat' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Notat' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tekst' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandlerOid' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandlerEpost' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vedtaksperiodeId' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'feilregistrert_tidspunkt' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'kommentarer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tekst' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saksbehandlerident' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<NotatFragment, unknown>;
export const FetchBehandledeOppgaverDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'FetchBehandledeOppgaver' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oid' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fom' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'behandledeOppgaver' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'behandletAvOid' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oid' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fom' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fom' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'aktorId' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'bosted' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'ferdigstiltAv' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'ferdigstiltTidspunkt' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntektstype' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'personnavn' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fornavn' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'mellomnavn' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'etternavn' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FetchBehandledeOppgaverQuery, FetchBehandledeOppgaverQueryVariables>;
export const HentBehandlingsstatistikkDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'HentBehandlingsstatistikk' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'behandlingsstatistikk' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'enArbeidsgiver' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'flereArbeidsgivere' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'beslutter' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'delvisRefusjon' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'faresignaler' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'forlengelser' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'forlengelseIt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'forstegangsbehandling' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fortroligAdresse' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'revurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'stikkprover' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingTilArbeidsgiver' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingTilSykmeldt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'antall' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'antallAnnulleringer' } },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'antall' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Antall' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'automatisk' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'manuelt' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'tilgjengelig' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<HentBehandlingsstatistikkQuery, HentBehandlingsstatistikkQueryVariables>;
export const FetchOppdragDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'FetchOppdrag' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fnr' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppdrag' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fnr' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fnr' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiveroppdrag' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'organisasjonsnummer' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fagsystemId' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'linjer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'fom' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tom' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'personoppdrag' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fodselsnummer' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fagsystemId' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'linjer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'fom' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tom' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'annullering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'saksbehandler' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FetchOppdragQuery, FetchOppdragQueryVariables>;
export const FetchOppgaverDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'FetchOppgaver' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'alleOppgaver' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'aktorId' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'opprinneligSoknadsdato' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'type' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'flereArbeidsgivere' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'navn' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fornavn' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'mellomnavn' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'etternavn' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sistSendt' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tildeling' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'reservert' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'epost' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'paaVent' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'totrinnsvurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'saksbehandler' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'erRetur' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'erBeslutteroppgave' },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'mottaker' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'haster' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FetchOppgaverQuery, FetchOppgaverQueryVariables>;
export const FetchPersonDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'FetchPerson' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fnr' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'aktorId' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'person' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fnr' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fnr' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'aktorId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'aktorId' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fodselsnummer' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'dodsdato' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'enhet' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'infotrygdutbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'organisasjonsnummer' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fom' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'grad' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'typetekst' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'personinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fornavn' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'mellomnavn' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'etternavn' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'adressebeskyttelse' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fodselsdato' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kjonn' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'reservasjon' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'kanVarsles' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'reservert' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tildeling' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'navn' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'oid' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'reservert' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'paaVent' },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'versjon' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vilkarsgrunnlag' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'FragmentSpread',
                                                name: { kind: 'Name', value: 'vilkarsgrunnlag' },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'aktorId' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgivere' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'bransjer' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'organisasjonsnummer' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'arbeidsforhold' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'sluttdato' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'startdato' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'stillingsprosent' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'stillingstittel' },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'ghostPerioder' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'deaktivert' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'vilkarsgrunnlagId' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'skjaeringstidspunkt' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'fom' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tom' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'organisasjonsnummer' },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'generasjoner' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'perioder' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'fom' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'tom' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'erForkastet' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'inntektstype' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'opprettet' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'periodetype' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'tidslinje' },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'dato',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'grad',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'kilde',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'id',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'type',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'sykdomsdagtype',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'utbetalingsdagtype',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'utbetalingsinfo',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'arbeidsgiverbelop',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'inntekt',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'personbelop',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'refusjonsbelop',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'totalGrad',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'utbetaling',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'begrunnelser',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'vedtaksperiodeId',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'periodetilstand',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'skjaeringstidspunkt',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'varsler' },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'generasjonId',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'definisjonId',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'kode',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'tittel',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'forklaring',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'handling',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'vurdering',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'ident',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'status',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'tidsstempel',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'hendelser' },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: { kind: 'Name', value: 'id' },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'type',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'InlineFragment',
                                                                                    typeCondition: {
                                                                                        kind: 'NamedType',
                                                                                        name: {
                                                                                            kind: 'Name',
                                                                                            value: 'Inntektsmelding',
                                                                                        },
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'beregnetInntekt',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'mottattDato',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'InlineFragment',
                                                                                    typeCondition: {
                                                                                        kind: 'NamedType',
                                                                                        name: {
                                                                                            kind: 'Name',
                                                                                            value: 'Sykmelding',
                                                                                        },
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fom',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'tom',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'rapportertDato',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'InlineFragment',
                                                                                    typeCondition: {
                                                                                        kind: 'NamedType',
                                                                                        name: {
                                                                                            kind: 'Name',
                                                                                            value: 'SoknadNav',
                                                                                        },
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fom',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'tom',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'rapportertDato',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'sendtNav',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'InlineFragment',
                                                                                    typeCondition: {
                                                                                        kind: 'NamedType',
                                                                                        name: {
                                                                                            kind: 'Name',
                                                                                            value: 'SoknadArbeidsgiver',
                                                                                        },
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fom',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'tom',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'rapportertDato',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'sendtArbeidsgiver',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'InlineFragment',
                                                                        typeCondition: {
                                                                            kind: 'NamedType',
                                                                            name: {
                                                                                kind: 'Name',
                                                                                value: 'UberegnetPeriode',
                                                                            },
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: { kind: 'Name', value: 'id' },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'notater',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'FragmentSpread',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'notat',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'InlineFragment',
                                                                        typeCondition: {
                                                                            kind: 'NamedType',
                                                                            name: {
                                                                                kind: 'Name',
                                                                                value: 'BeregnetPeriode',
                                                                            },
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: { kind: 'Name', value: 'id' },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'inntektFraAordningen',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'maned',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'sum',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'beregningId',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'forbrukteSykedager',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'gjenstaendeSykedager',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'handlinger',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'type',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'tillatt',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'begrunnelse',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'notater',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'id',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'tekst',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'opprettet',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'saksbehandlerOid',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'saksbehandlerNavn',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'saksbehandlerEpost',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'saksbehandlerIdent',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'vedtaksperiodeId',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'feilregistrert',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'feilregistrert_tidspunkt',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'type',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'kommentarer',
                                                                                                },
                                                                                                selectionSet: {
                                                                                                    kind: 'SelectionSet',
                                                                                                    selections: [
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'id',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'tekst',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'opprettet',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'saksbehandlerident',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'feilregistrert_tidspunkt',
                                                                                                            },
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'periodehistorikk',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'type',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'timestamp',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'saksbehandler_ident',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'notat_id',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'maksdato',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'periodevilkar',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'alder',
                                                                                                },
                                                                                                selectionSet: {
                                                                                                    kind: 'SelectionSet',
                                                                                                    selections: [
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'alderSisteSykedag',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'oppfylt',
                                                                                                            },
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'soknadsfrist',
                                                                                                },
                                                                                                selectionSet: {
                                                                                                    kind: 'SelectionSet',
                                                                                                    selections: [
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'oppfylt',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'sendtNav',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'soknadFom',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'soknadTom',
                                                                                                            },
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'sykepengedager',
                                                                                                },
                                                                                                selectionSet: {
                                                                                                    kind: 'SelectionSet',
                                                                                                    selections: [
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'forbrukteSykedager',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'gjenstaendeSykedager',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'maksdato',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'oppfylt',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'skjaeringstidspunkt',
                                                                                                            },
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'risikovurdering',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'funn',
                                                                                                },
                                                                                                selectionSet: {
                                                                                                    kind: 'SelectionSet',
                                                                                                    selections: [
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'beskrivelse',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'kategori',
                                                                                                            },
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'kontrollertOk',
                                                                                                },
                                                                                                selectionSet: {
                                                                                                    kind: 'SelectionSet',
                                                                                                    selections: [
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'beskrivelse',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'kategori',
                                                                                                            },
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'utbetaling',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'id',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'arbeidsgiverFagsystemId',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'arbeidsgiverNettoBelop',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'personFagsystemId',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'personNettoBelop',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'status',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'type',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'vurdering',
                                                                                                },
                                                                                                selectionSet: {
                                                                                                    kind: 'SelectionSet',
                                                                                                    selections: [
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'automatisk',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'godkjent',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'ident',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'tidsstempel',
                                                                                                            },
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'arbeidsgiversimulering',
                                                                                                },
                                                                                                selectionSet: {
                                                                                                    kind: 'SelectionSet',
                                                                                                    selections: [
                                                                                                        {
                                                                                                            kind: 'FragmentSpread',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'simulering',
                                                                                                            },
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'personsimulering',
                                                                                                },
                                                                                                selectionSet: {
                                                                                                    kind: 'SelectionSet',
                                                                                                    selections: [
                                                                                                        {
                                                                                                            kind: 'FragmentSpread',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'simulering',
                                                                                                            },
                                                                                                        },
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'vilkarsgrunnlagId',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'oppgave',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'id',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'totrinnsvurdering',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'erBeslutteroppgave',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'erRetur',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'saksbehandler',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'beslutter',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'overstyringer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'hendelseId' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'saksbehandler' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'ident' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'navn' },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'timestamp' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'ferdigstilt' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: '__typename' },
                                                        },
                                                        {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                                kind: 'NamedType',
                                                                name: { kind: 'Name', value: 'Dagoverstyring' },
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'begrunnelse' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'dager' },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'grad',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'fraGrad',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'dato',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'type',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'fraType',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                                kind: 'NamedType',
                                                                name: { kind: 'Name', value: 'Inntektoverstyring' },
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'inntekt' },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'skjaeringstidspunkt',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'forklaring',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'begrunnelse',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'manedligInntekt',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'fraManedligInntekt',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'refusjonsopplysninger',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fom',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'tom',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'belop',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'fraRefusjonsopplysninger',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fom',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'tom',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'belop',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                                kind: 'NamedType',
                                                                name: {
                                                                    kind: 'Name',
                                                                    value: 'Arbeidsforholdoverstyring',
                                                                },
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'begrunnelse' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'deaktivert' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'skjaeringstidspunkt',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'forklaring' },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'InlineFragment',
                                                            typeCondition: {
                                                                kind: 'NamedType',
                                                                name: {
                                                                    kind: 'Name',
                                                                    value: 'Sykepengegrunnlagskjonnsfastsetting',
                                                                },
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'skjonnsfastsatt',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'arsak',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'begrunnelse',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'arlig',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'fraArlig',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'skjaeringstidspunkt',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'vilkarsgrunnlag' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Vilkarsgrunnlag' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sykepengegrunnlag' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'omregnetArsinntekt' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'sammenligningsgrunnlag' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sammenligningsgrunnlag' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'belop' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'maned' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'omregnetArsinntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'maned' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'manedsbelop' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsmessigFastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'maned' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'manedsbelop' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'deaktivert' },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgiverrefusjoner' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiver' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fom' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'belop' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'meldingsreferanseId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagtype' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagSpleis' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsmessigFastsattAarlig' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oppfyllerKravOmMinstelonn' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oppfyllerKravOmMedlemskap' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oppfyllerKravOmOpptjening' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'antallOpptjeningsdagerErMinst' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avviksprosent' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningFra' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengegrunnlagsgrense' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'grunnbelop' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'grense' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'virkningstidspunkt' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'notat' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Notat' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tekst' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandlerOid' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandlerEpost' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vedtaksperiodeId' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'feilregistrert_tidspunkt' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'kommentarer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tekst' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saksbehandlerident' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'simulering' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Simulering' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fagsystemId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalbelop' },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tom' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'grad' },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tom' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'mottakerId' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'mottakerNavn' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'feilkonto' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'fom' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tom' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'uforegrad' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'typeSats' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'sats' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'konto' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'klassekode' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'antallSats' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'belop' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'klassekodebeskrivelse' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FetchPersonQuery, FetchPersonQueryVariables>;
export const FeilregistrerKommentarMutationDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'FeilregistrerKommentarMutation' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'feilregistrerKommentar' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'opprettet' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'feilregistrert_tidspunkt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saksbehandlerident' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FeilregistrerKommentarMutationMutation, FeilregistrerKommentarMutationMutationVariables>;
export const LeggTilKommentarDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'LeggTilKommentar' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tekst' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'notatId' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'leggTilKommentar' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'tekst' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'tekst' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'notatId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'notatId' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'saksbehandlerident' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'saksbehandlerident' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tekst' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saksbehandlerident' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LeggTilKommentarMutation, LeggTilKommentarMutationVariables>;
export const FeilregistrerNotatMutationDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'FeilregistrerNotatMutation' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'feilregistrerNotat' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tekst' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saksbehandlerOid' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saksbehandlerEpost' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saksbehandlerIdent' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'feilregistrert' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'feilregistrert_tidspunkt' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kommentarer' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'opprettet' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'saksbehandlerident' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'feilregistrert_tidspunkt' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FeilregistrerNotatMutationMutation, FeilregistrerNotatMutationMutationVariables>;
export const LeggTilNotatDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'LeggTilNotat' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'type' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'NotatType' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oid' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tekst' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'leggTilNotat' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'type' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'type' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'saksbehandlerOid' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oid' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'vedtaksperiodeId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'tekst' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'tekst' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tekst' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saksbehandlerOid' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saksbehandlerEpost' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saksbehandlerIdent' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'feilregistrert' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'feilregistrert_tidspunkt' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kommentarer' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'opprettet' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'saksbehandlerident' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'feilregistrert_tidspunkt' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LeggTilNotatMutation, LeggTilNotatMutationVariables>;
export const FetchNotaterDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'FetchNotater' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'forPerioder' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'notater' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'forPerioder' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'forPerioder' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'notater' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'opprettet' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'saksbehandlerOid' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'saksbehandlerNavn' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'saksbehandlerEpost' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'saksbehandlerIdent' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'vedtaksperiodeId' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'feilregistrert' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tekst' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'opprettet' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'saksbehandlerident' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'feilregistrert_tidspunkt' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FetchNotaterQuery, FetchNotaterQueryVariables>;
export const SettVarselstatusAktivDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'SettVarselstatusAktiv' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'generasjonIdString' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'varselkode' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'ident' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'settVarselstatusAktiv' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'generasjonIdString' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'generasjonIdString' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'varselkode' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'varselkode' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'ident' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'ident' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'generasjonId' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kode' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'forklaring' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'ident' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'tidsstempel' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SettVarselstatusAktivMutation, SettVarselstatusAktivMutationVariables>;
export const SettVarselstatusVurdertDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'SettVarselstatusVurdert' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'generasjonIdString' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'definisjonIdString' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'varselkode' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'ident' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'settVarselstatusVurdert' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'generasjonIdString' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'generasjonIdString' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'definisjonIdString' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'definisjonIdString' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'varselkode' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'varselkode' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'ident' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'ident' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'generasjonId' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kode' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'forklaring' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'ident' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'tidsstempel' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SettVarselstatusVurdertMutation, SettVarselstatusVurdertMutationVariables>;
export const FjernPaaVentDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'FjernPaaVent' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fjernPaaVent' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'oppgaveId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oid' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'reservert' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'paaVent' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FjernPaaVentMutation, FjernPaaVentMutationVariables>;
export const FjernTildelingDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'FjernTildeling' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fjernTildeling' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'oppgaveId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FjernTildelingMutation, FjernTildelingMutationVariables>;
export const LeggPaaVentDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'LeggPaaVent' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'notatType' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'NotatType' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'notatTekst' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'leggPaaVent' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'oppgaveId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'notatType' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'notatType' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'notatTekst' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'notatTekst' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oid' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'reservert' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'paaVent' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LeggPaaVentMutation, LeggPaaVentMutationVariables>;
export const OpprettTildelingDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'OpprettTildeling' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'opprettTildeling' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'oppgaveId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oid' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'reservert' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'paaVent' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OpprettTildelingMutation, OpprettTildelingMutationVariables>;
