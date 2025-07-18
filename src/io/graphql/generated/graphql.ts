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
    /** class java.math.BigDecimal */
    BigDecimal: { input: string; output: string };
    /** class java.time.LocalDate */
    LocalDate: { input: string; output: string };
    /** class java.time.LocalDateTime */
    LocalDateTime: { input: string; output: string };
    /** class java.util.UUID */
    UUID: { input: string; output: string };
    /** class java.time.YearMonth */
    YearMonth: { input: string; output: string };
};

export enum Adressebeskyttelse {
    Fortrolig = 'Fortrolig',
    StrengtFortrolig = 'StrengtFortrolig',
    StrengtFortroligUtland = 'StrengtFortroligUtland',
    Ugradert = 'Ugradert',
    Ukjent = 'Ukjent',
}

export type Alder = {
    __typename: 'Alder';
    alderSisteSykedag: Scalars['Int']['output'];
    oppfylt: Scalars['Boolean']['output'];
};

export type Annullering = {
    __typename: 'Annullering';
    arbeidsgiverFagsystemId: Maybe<Scalars['String']['output']>;
    arsaker: Array<Scalars['String']['output']>;
    begrunnelse: Maybe<Scalars['String']['output']>;
    personFagsystemId: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent: Scalars['String']['output'];
    tidspunkt: Scalars['LocalDateTime']['output'];
};

export type AnnulleringArsakInput = {
    _key: Scalars['String']['input'];
    arsak: Scalars['String']['input'];
};

export type AnnulleringDataInput = {
    aktorId: Scalars['String']['input'];
    arbeidsgiverFagsystemId: Scalars['String']['input'];
    arsaker: Array<AnnulleringArsakInput>;
    fodselsnummer: Scalars['String']['input'];
    kommentar?: InputMaybe<Scalars['String']['input']>;
    organisasjonsnummer: Scalars['String']['input'];
    personFagsystemId: Scalars['String']['input'];
    utbetalingId: Scalars['UUID']['input'];
    vedtaksperiodeId: Scalars['UUID']['input'];
};

export type Annulleringskandidat = {
    __typename: 'Annulleringskandidat';
    fom: Scalars['LocalDate']['output'];
    organisasjonsnummer: Scalars['String']['output'];
    tom: Scalars['LocalDate']['output'];
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export type Antall = {
    __typename: 'Antall';
    automatisk: Scalars['Int']['output'];
    manuelt: Scalars['Int']['output'];
    tilgjengelig: Scalars['Int']['output'];
};

export enum AntallArbeidsforhold {
    EtArbeidsforhold = 'ET_ARBEIDSFORHOLD',
    FlereArbeidsforhold = 'FLERE_ARBEIDSFORHOLD',
}

export type AntallOppgaver = {
    __typename: 'AntallOppgaver';
    antallMineSaker: Scalars['Int']['output'];
    antallMineSakerPaVent: Scalars['Int']['output'];
};

export type Arbeidsforhold = {
    __typename: 'Arbeidsforhold';
    sluttdato: Maybe<Scalars['LocalDate']['output']>;
    startdato: Scalars['LocalDate']['output'];
    stillingsprosent: Scalars['Int']['output'];
    stillingstittel: Scalars['String']['output'];
};

export type ArbeidsforholdOverstyringHandlingInput = {
    aktorId: Scalars['String']['input'];
    fodselsnummer: Scalars['String']['input'];
    overstyrteArbeidsforhold: Array<OverstyringArbeidsforholdInput>;
    skjaringstidspunkt: Scalars['LocalDate']['input'];
    vedtaksperiodeId: Scalars['UUID']['input'];
};

export type Arbeidsforholdoverstyring = Overstyring & {
    __typename: 'Arbeidsforholdoverstyring';
    begrunnelse: Scalars['String']['output'];
    deaktivert: Scalars['Boolean']['output'];
    ferdigstilt: Scalars['Boolean']['output'];
    forklaring: Scalars['String']['output'];
    hendelseId: Scalars['UUID']['output'];
    saksbehandler: Saksbehandler;
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    timestamp: Scalars['LocalDateTime']['output'];
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export type Arbeidsgiver = {
    __typename: 'Arbeidsgiver';
    arbeidsforhold: Array<Arbeidsforhold>;
    generasjoner: Array<Generasjon>;
    ghostPerioder: Array<GhostPeriode>;
    inntekterFraAordningen: Array<ArbeidsgiverInntekterFraAOrdningen>;
    navn: Scalars['String']['output'];
    organisasjonsnummer: Scalars['String']['output'];
    overstyringer: Array<Overstyring>;
};

export type ArbeidsgiverInntekterFraAOrdningen = {
    __typename: 'ArbeidsgiverInntekterFraAOrdningen';
    inntekter: Array<InntektFraAOrdningen>;
    skjaeringstidspunkt: Scalars['String']['output'];
};

export type ArbeidsgiverInput = {
    berortVedtaksperiodeId: Scalars['UUID']['input'];
    organisasjonsnummer: Scalars['String']['input'];
};

export type Arbeidsgiverinntekt = {
    __typename: 'Arbeidsgiverinntekt';
    arbeidsgiver: Scalars['String']['output'];
    deaktivert: Maybe<Scalars['Boolean']['output']>;
    fom: Maybe<Scalars['LocalDate']['output']>;
    omregnetArsinntekt: Maybe<OmregnetArsinntekt>;
    sammenligningsgrunnlag: Maybe<Sammenligningsgrunnlag>;
    skjonnsmessigFastsatt: Maybe<OmregnetArsinntekt>;
    tom: Maybe<Scalars['LocalDate']['output']>;
};

export type Arbeidsgiverrefusjon = {
    __typename: 'Arbeidsgiverrefusjon';
    arbeidsgiver: Scalars['String']['output'];
    refusjonsopplysninger: Array<Refusjonselement>;
};

export type AvsenderSystem = {
    __typename: 'AvsenderSystem';
    navn: Maybe<Scalars['String']['output']>;
    versjon: Maybe<Scalars['String']['output']>;
};

export type Avslag = {
    __typename: 'Avslag';
    begrunnelse: Scalars['String']['output'];
    invalidert: Scalars['Boolean']['output'];
    opprettet: Scalars['LocalDateTime']['output'];
    saksbehandlerIdent: Scalars['String']['output'];
    type: Avslagstype;
};

export enum Avslagstype {
    Avslag = 'AVSLAG',
    DelvisAvslag = 'DELVIS_AVSLAG',
}

export enum Begrunnelse {
    Andreytelser = 'ANDREYTELSER',
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

export type BehandledeOppgaver = {
    __typename: 'BehandledeOppgaver';
    oppgaver: Array<BehandletOppgave>;
    totaltAntallOppgaver: Scalars['Int']['output'];
};

export type BehandletOppgave = {
    __typename: 'BehandletOppgave';
    aktorId: Scalars['String']['output'];
    antallArbeidsforhold: AntallArbeidsforhold;
    beslutter: Maybe<Scalars['String']['output']>;
    ferdigstiltAv: Maybe<Scalars['String']['output']>;
    ferdigstiltTidspunkt: Scalars['LocalDateTime']['output'];
    id: Scalars['String']['output'];
    oppgavetype: Oppgavetype;
    periodetype: Periodetype;
    personnavn: Personnavn;
    saksbehandler: Maybe<Scalars['String']['output']>;
};

export type Behandlingsstatistikk = {
    __typename: 'Behandlingsstatistikk';
    antallAnnulleringer: Scalars['Int']['output'];
    antallAvvisninger: Scalars['Int']['output'];
    beslutter: Antall;
    delvisRefusjon: Antall;
    egenAnsatt: Antall;
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
    __typename: 'BeregnetPeriode';
    annullering: Maybe<Annullering>;
    annulleringskandidater: Array<Annulleringskandidat>;
    avslag: Array<Avslag>;
    behandlingId: Scalars['UUID']['output'];
    beregningId: Scalars['UUID']['output'];
    egenskaper: Array<Oppgaveegenskap>;
    erForkastet: Scalars['Boolean']['output'];
    fom: Scalars['LocalDate']['output'];
    forbrukteSykedager: Maybe<Scalars['Int']['output']>;
    gjenstaendeSykedager: Maybe<Scalars['Int']['output']>;
    handlinger: Array<Handling>;
    hendelser: Array<Hendelse>;
    historikkinnslag: Array<Historikkinnslag>;
    id: Scalars['UUID']['output'];
    inntektstype: Inntektstype;
    maksdato: Scalars['LocalDate']['output'];
    notater: Array<Notat>;
    oppgave: Maybe<OppgaveForPeriodevisning>;
    opprettet: Scalars['LocalDateTime']['output'];
    paVent: Maybe<PaVent>;
    pensjonsgivendeInntekter: Array<PensjonsgivendeInntekt>;
    periodetilstand: Periodetilstand;
    periodetype: Periodetype;
    periodevilkar: Periodevilkar;
    risikovurdering: Maybe<Risikovurdering>;
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    tidslinje: Array<Dag>;
    tom: Scalars['LocalDate']['output'];
    totrinnsvurdering: Maybe<Totrinnsvurdering>;
    utbetaling: Utbetaling;
    varsler: Array<VarselDto>;
    vedtakBegrunnelser: Array<VedtakBegrunnelse>;
    vedtaksperiodeId: Scalars['UUID']['output'];
    vilkarsgrunnlagId: Maybe<Scalars['UUID']['output']>;
};

export type Dag = {
    __typename: 'Dag';
    begrunnelser: Maybe<Array<Begrunnelse>>;
    dato: Scalars['LocalDate']['output'];
    grad: Maybe<Scalars['Float']['output']>;
    kilde: Kilde;
    sykdomsdagtype: Sykdomsdagtype;
    utbetalingsdagtype: Utbetalingsdagtype;
    utbetalingsinfo: Maybe<Utbetalingsinfo>;
};

export type Dagoverstyring = Overstyring & {
    __typename: 'Dagoverstyring';
    begrunnelse: Scalars['String']['output'];
    dager: Array<OverstyrtDag>;
    ferdigstilt: Scalars['Boolean']['output'];
    hendelseId: Scalars['UUID']['output'];
    saksbehandler: Saksbehandler;
    timestamp: Scalars['LocalDateTime']['output'];
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export enum Dagtype {
    AaPdag = 'AAPdag',
    ArbeidIkkeGjenopptattDag = 'ArbeidIkkeGjenopptattDag',
    Arbeidsdag = 'Arbeidsdag',
    Avvistdag = 'Avvistdag',
    Dagpengerdag = 'Dagpengerdag',
    Egenmeldingsdag = 'Egenmeldingsdag',
    Feriedag = 'Feriedag',
    Foreldrepengerdag = 'Foreldrepengerdag',
    Helg = 'Helg',
    Omsorgspengerdag = 'Omsorgspengerdag',
    Opplaringspengerdag = 'Opplaringspengerdag',
    Permisjonsdag = 'Permisjonsdag',
    Pleiepengerdag = 'Pleiepengerdag',
    Svangerskapspengerdag = 'Svangerskapspengerdag',
    Sykedag = 'Sykedag',
    SykedagNav = 'SykedagNav',
}

export type DatoPeriode = {
    __typename: 'DatoPeriode';
    fom: Scalars['LocalDate']['output'];
    tom: Scalars['LocalDate']['output'];
};

export type DatoPeriodeInput = {
    fom: Scalars['LocalDate']['input'];
    tom: Scalars['LocalDate']['input'];
};

export type DokumentInntektsmelding = {
    __typename: 'DokumentInntektsmelding';
    arbeidsforholdId: Maybe<Scalars['String']['output']>;
    arbeidsgiverperioder: Maybe<Array<ImPeriode>>;
    avsenderSystem: Maybe<AvsenderSystem>;
    begrunnelseForReduksjonEllerIkkeUtbetalt: Maybe<Scalars['String']['output']>;
    beregnetInntekt: Maybe<Scalars['Float']['output']>;
    bruttoUtbetalt: Maybe<Scalars['Float']['output']>;
    endringIRefusjoner: Maybe<Array<EndringIRefusjon>>;
    ferieperioder: Maybe<Array<ImPeriode>>;
    foersteFravaersdag: Maybe<Scalars['LocalDate']['output']>;
    gjenopptakelseNaturalytelser: Maybe<Array<GjenopptakelseNaturalytelse>>;
    innsenderFulltNavn: Maybe<Scalars['String']['output']>;
    innsenderTelefon: Maybe<Scalars['String']['output']>;
    inntektEndringAarsaker: Maybe<Array<InntektEndringAarsak>>;
    naerRelasjon: Maybe<Scalars['Boolean']['output']>;
    opphoerAvNaturalytelser: Maybe<Array<OpphoerAvNaturalytelse>>;
    refusjon: Maybe<Refusjon>;
    virksomhetsnummer: Maybe<Scalars['String']['output']>;
};

export enum Egenskap {
    Arbeidstaker = 'ARBEIDSTAKER',
    Beslutter = 'BESLUTTER',
    DelvisRefusjon = 'DELVIS_REFUSJON',
    EgenAnsatt = 'EGEN_ANSATT',
    EnArbeidsgiver = 'EN_ARBEIDSGIVER',
    FlereArbeidsgivere = 'FLERE_ARBEIDSGIVERE',
    Forlengelse = 'FORLENGELSE',
    Forstegangsbehandling = 'FORSTEGANGSBEHANDLING',
    FortroligAdresse = 'FORTROLIG_ADRESSE',
    Gosys = 'GOSYS',
    Grunnbelopsregulering = 'GRUNNBELOPSREGULERING',
    Haster = 'HASTER',
    Infotrygdforlengelse = 'INFOTRYGDFORLENGELSE',
    IngenUtbetaling = 'INGEN_UTBETALING',
    ManglerIm = 'MANGLER_IM',
    Medlemskap = 'MEDLEMSKAP',
    OvergangFraIt = 'OVERGANG_FRA_IT',
    PaVent = 'PA_VENT',
    Retur = 'RETUR',
    Revurdering = 'REVURDERING',
    RiskQa = 'RISK_QA',
    SelvstendigNaeringsdrivende = 'SELVSTENDIG_NAERINGSDRIVENDE',
    Skjonnsfastsettelse = 'SKJONNSFASTSETTELSE',
    Soknad = 'SOKNAD',
    Spesialsak = 'SPESIALSAK',
    Stikkprove = 'STIKKPROVE',
    StrengtFortroligAdresse = 'STRENGT_FORTROLIG_ADRESSE',
    Tilbakedatert = 'TILBAKEDATERT',
    UtbetalingTilArbeidsgiver = 'UTBETALING_TIL_ARBEIDSGIVER',
    UtbetalingTilSykmeldt = 'UTBETALING_TIL_SYKMELDT',
    Utland = 'UTLAND',
    Vergemal = 'VERGEMAL',
}

export type EndrePaVent = Historikkinnslag & {
    __typename: 'EndrePaVent';
    arsaker: Array<Scalars['String']['output']>;
    dialogRef: Maybe<Scalars['Int']['output']>;
    frist: Maybe<Scalars['LocalDate']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    notattekst: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type EndringIRefusjon = {
    __typename: 'EndringIRefusjon';
    beloep: Maybe<Scalars['Float']['output']>;
    endringsdato: Maybe<Scalars['LocalDate']['output']>;
};

export type Enhet = {
    __typename: 'Enhet';
    id: Scalars['String']['output'];
    navn: Scalars['String']['output'];
};

export type Faresignal = {
    __typename: 'Faresignal';
    beskrivelse: Scalars['String']['output'];
    kategori: Array<Scalars['String']['output']>;
};

export type FiltreringInput = {
    egenskaper: Array<OppgaveegenskapInput>;
    egneSaker: Scalars['Boolean']['input'];
    egneSakerPaVent: Scalars['Boolean']['input'];
    ekskluderteEgenskaper?: InputMaybe<Array<OppgaveegenskapInput>>;
    ingenUkategoriserteEgenskaper: Scalars['Boolean']['input'];
    tildelt?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FjernetFraPaVent = Historikkinnslag & {
    __typename: 'FjernetFraPaVent';
    dialogRef: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    saksbehandlerIdent: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type Generasjon = {
    __typename: 'Generasjon';
    id: Scalars['UUID']['output'];
    perioder: Array<Periode>;
};

export type GhostPeriode = {
    __typename: 'GhostPeriode';
    deaktivert: Scalars['Boolean']['output'];
    fom: Scalars['LocalDate']['output'];
    id: Scalars['String']['output'];
    organisasjonsnummer: Scalars['String']['output'];
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    tom: Scalars['LocalDate']['output'];
    vilkarsgrunnlagId: Maybe<Scalars['UUID']['output']>;
};

export type GjenopptakelseNaturalytelse = {
    __typename: 'GjenopptakelseNaturalytelse';
    beloepPrMnd: Maybe<Scalars['Float']['output']>;
    fom: Maybe<Scalars['LocalDate']['output']>;
    naturalytelse: Maybe<Naturalytelse>;
};

export type Handling = {
    __typename: 'Handling';
    begrunnelse: Maybe<Scalars['String']['output']>;
    tillatt: Scalars['Boolean']['output'];
    type: Periodehandling;
};

export type Hendelse = {
    id: Scalars['UUID']['output'];
    type: Hendelsetype;
};

export enum Hendelsetype {
    Inntektsmelding = 'INNTEKTSMELDING',
    InntektHentetFraAordningen = 'INNTEKT_HENTET_FRA_AORDNINGEN',
    NySoknad = 'NY_SOKNAD',
    SendtSoknadArbeidsgiver = 'SENDT_SOKNAD_ARBEIDSGIVER',
    SendtSoknadArbeidsledig = 'SENDT_SOKNAD_ARBEIDSLEDIG',
    SendtSoknadFrilans = 'SENDT_SOKNAD_FRILANS',
    SendtSoknadNav = 'SENDT_SOKNAD_NAV',
    SendtSoknadSelvstendig = 'SENDT_SOKNAD_SELVSTENDIG',
    Ukjent = 'UKJENT',
}

export type Historikkinnslag = {
    dialogRef: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    saksbehandlerIdent: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type ImPeriode = {
    __typename: 'IMPeriode';
    fom: Maybe<Scalars['LocalDate']['output']>;
    tom: Maybe<Scalars['LocalDate']['output']>;
};

export type Infotrygdutbetaling = {
    __typename: 'Infotrygdutbetaling';
    dagsats: Scalars['Float']['output'];
    fom: Scalars['String']['output'];
    grad: Scalars['String']['output'];
    organisasjonsnummer: Scalars['String']['output'];
    tom: Scalars['String']['output'];
    typetekst: Scalars['String']['output'];
};

export type InntektEndringAarsak = {
    __typename: 'InntektEndringAarsak';
    aarsak: Scalars['String']['output'];
    bleKjent: Maybe<Scalars['LocalDate']['output']>;
    gjelderFra: Maybe<Scalars['LocalDate']['output']>;
    perioder: Maybe<Array<ImPeriode>>;
};

export type InntektFraAOrdningen = {
    __typename: 'InntektFraAOrdningen';
    maned: Scalars['YearMonth']['output'];
    sum: Scalars['Float']['output'];
};

export type InntektHentetFraAOrdningen = Hendelse & {
    __typename: 'InntektHentetFraAOrdningen';
    id: Scalars['UUID']['output'];
    mottattDato: Scalars['LocalDateTime']['output'];
    type: Hendelsetype;
};

export type InntektOgRefusjonOverstyringInput = {
    aktorId: Scalars['String']['input'];
    arbeidsgivere: Array<OverstyringArbeidsgiverInput>;
    fodselsnummer: Scalars['String']['input'];
    skjaringstidspunkt: Scalars['LocalDate']['input'];
    vedtaksperiodeId: Scalars['UUID']['input'];
};

export type Inntektoverstyring = Overstyring & {
    __typename: 'Inntektoverstyring';
    ferdigstilt: Scalars['Boolean']['output'];
    hendelseId: Scalars['UUID']['output'];
    inntekt: OverstyrtInntekt;
    saksbehandler: Saksbehandler;
    timestamp: Scalars['LocalDateTime']['output'];
    vedtaksperiodeId: Scalars['UUID']['output'];
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
    __typename: 'Inntektsmelding';
    beregnetInntekt: Scalars['Float']['output'];
    eksternDokumentId: Maybe<Scalars['UUID']['output']>;
    id: Scalars['UUID']['output'];
    mottattDato: Scalars['LocalDateTime']['output'];
    type: Hendelsetype;
};

export enum Inntektstype {
    Enarbeidsgiver = 'ENARBEIDSGIVER',
    Flerearbeidsgivere = 'FLEREARBEIDSGIVERE',
}

export enum Kategori {
    Inntektsforhold = 'Inntektsforhold',
    Inntektskilde = 'Inntektskilde',
    Mottaker = 'Mottaker',
    Oppgavetype = 'Oppgavetype',
    Periodetype = 'Periodetype',
    Status = 'Status',
    Ukategorisert = 'Ukategorisert',
}

export type Kilde = {
    __typename: 'Kilde';
    id: Scalars['UUID']['output'];
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
    __typename: 'Kommentar';
    feilregistrert_tidspunkt: Maybe<Scalars['LocalDateTime']['output']>;
    id: Scalars['Int']['output'];
    opprettet: Scalars['LocalDateTime']['output'];
    saksbehandlerident: Scalars['String']['output'];
    tekst: Scalars['String']['output'];
};

export type LagtPaVent = Historikkinnslag & {
    __typename: 'LagtPaVent';
    arsaker: Array<Scalars['String']['output']>;
    dialogRef: Maybe<Scalars['Int']['output']>;
    frist: Maybe<Scalars['LocalDate']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    notattekst: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type LeggTilTilkommenInntektResponse = {
    __typename: 'LeggTilTilkommenInntektResponse';
    tilkommenInntektId: Scalars['UUID']['output'];
};

export type LovhjemmelInput = {
    bokstav?: InputMaybe<Scalars['String']['input']>;
    ledd?: InputMaybe<Scalars['String']['input']>;
    lovverk: Scalars['String']['input'];
    lovverksversjon: Scalars['String']['input'];
    paragraf: Scalars['String']['input'];
};

export type MinimumSykdomsgradInput = {
    aktorId: Scalars['String']['input'];
    arbeidsgivere: Array<ArbeidsgiverInput>;
    begrunnelse: Scalars['String']['input'];
    fodselsnummer: Scalars['String']['input'];
    initierendeVedtaksperiodeId: Scalars['UUID']['input'];
    perioderVurdertIkkeOk: Array<PeriodeInput>;
    perioderVurdertOk: Array<PeriodeInput>;
};

export type MinimumSykdomsgradOverstyring = Overstyring & {
    __typename: 'MinimumSykdomsgradOverstyring';
    ferdigstilt: Scalars['Boolean']['output'];
    hendelseId: Scalars['UUID']['output'];
    minimumSykdomsgrad: OverstyrtMinimumSykdomsgrad;
    saksbehandler: Saksbehandler;
    timestamp: Scalars['LocalDateTime']['output'];
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export enum Mottaker {
    Arbeidsgiver = 'ARBEIDSGIVER',
    Begge = 'BEGGE',
    Ingen = 'INGEN',
    Sykmeldt = 'SYKMELDT',
}

export type Mutation = {
    __typename: 'Mutation';
    annuller: Scalars['Boolean']['output'];
    endrePaVent: Maybe<PaVent>;
    endreTilkommenInntekt: Scalars['Boolean']['output'];
    fattVedtak: Scalars['Boolean']['output'];
    feilregistrerKommentar: Maybe<Kommentar>;
    feilregistrerKommentarV2: Maybe<Kommentar>;
    feilregistrerNotat: Maybe<Notat>;
    fjernPaVent: Maybe<Scalars['Boolean']['output']>;
    fjernTildeling: Scalars['Boolean']['output'];
    fjernTilkommenInntekt: Scalars['Boolean']['output'];
    gjenopprettTilkommenInntekt: Scalars['Boolean']['output'];
    leggPaVent: Maybe<PaVent>;
    leggTilKommentar: Maybe<Kommentar>;
    leggTilNotat: Maybe<Notat>;
    leggTilTilkommenInntekt: LeggTilTilkommenInntektResponse;
    minimumSykdomsgrad: Maybe<Scalars['Boolean']['output']>;
    oppdaterPerson: Scalars['Boolean']['output'];
    opphevStans: Scalars['Boolean']['output'];
    opphevStansAutomatiskBehandling: Scalars['Boolean']['output'];
    opprettAbonnement: Scalars['Boolean']['output'];
    opprettTildeling: Maybe<Tildeling>;
    overstyrArbeidsforhold: Maybe<Scalars['Boolean']['output']>;
    overstyrDager: Maybe<Scalars['Boolean']['output']>;
    overstyrInntektOgRefusjon: Maybe<Scalars['Boolean']['output']>;
    sendIRetur: Maybe<Scalars['Boolean']['output']>;
    sendTilGodkjenningV2: Maybe<Scalars['Boolean']['output']>;
    sendTilInfotrygd: Scalars['Boolean']['output'];
    settVarselstatus: Maybe<VarselDto>;
    skjonnsfastsettSykepengegrunnlag: Maybe<Scalars['Boolean']['output']>;
    stansAutomatiskBehandling: Scalars['Boolean']['output'];
};

export type MutationAnnullerArgs = {
    annullering: AnnulleringDataInput;
};

export type MutationEndrePaVentArgs = {
    arsaker: Array<PaVentArsakInput>;
    frist: Scalars['LocalDate']['input'];
    notatTekst?: InputMaybe<Scalars['String']['input']>;
    oppgaveId: Scalars['String']['input'];
    tildeling: Scalars['Boolean']['input'];
};

export type MutationEndreTilkommenInntektArgs = {
    endretTil: TilkommenInntektInput;
    notatTilBeslutter: Scalars['String']['input'];
    tilkommenInntektId: Scalars['UUID']['input'];
};

export type MutationFattVedtakArgs = {
    begrunnelse?: InputMaybe<Scalars['String']['input']>;
    oppgavereferanse: Scalars['String']['input'];
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

export type MutationFjernPaVentArgs = {
    oppgaveId: Scalars['String']['input'];
};

export type MutationFjernTildelingArgs = {
    oppgaveId: Scalars['String']['input'];
};

export type MutationFjernTilkommenInntektArgs = {
    notatTilBeslutter: Scalars['String']['input'];
    tilkommenInntektId: Scalars['UUID']['input'];
};

export type MutationGjenopprettTilkommenInntektArgs = {
    endretTil: TilkommenInntektInput;
    notatTilBeslutter: Scalars['String']['input'];
    tilkommenInntektId: Scalars['UUID']['input'];
};

export type MutationLeggPaVentArgs = {
    arsaker?: InputMaybe<Array<PaVentArsakInput>>;
    frist: Scalars['LocalDate']['input'];
    notatTekst?: InputMaybe<Scalars['String']['input']>;
    oppgaveId: Scalars['String']['input'];
    tildeling: Scalars['Boolean']['input'];
};

export type MutationLeggTilKommentarArgs = {
    dialogRef: Scalars['Int']['input'];
    saksbehandlerident: Scalars['String']['input'];
    tekst: Scalars['String']['input'];
};

export type MutationLeggTilNotatArgs = {
    saksbehandlerOid: Scalars['String']['input'];
    tekst: Scalars['String']['input'];
    type: NotatType;
    vedtaksperiodeId: Scalars['String']['input'];
};

export type MutationLeggTilTilkommenInntektArgs = {
    fodselsnummer: Scalars['String']['input'];
    notatTilBeslutter: Scalars['String']['input'];
    verdier: TilkommenInntektInput;
};

export type MutationMinimumSykdomsgradArgs = {
    minimumSykdomsgrad: MinimumSykdomsgradInput;
};

export type MutationOppdaterPersonArgs = {
    fodselsnummer: Scalars['String']['input'];
};

export type MutationOpphevStansArgs = {
    begrunnelse: Scalars['String']['input'];
    fodselsnummer: Scalars['String']['input'];
};

export type MutationOpphevStansAutomatiskBehandlingArgs = {
    begrunnelse: Scalars['String']['input'];
    fodselsnummer: Scalars['String']['input'];
};

export type MutationOpprettAbonnementArgs = {
    personidentifikator: Scalars['String']['input'];
};

export type MutationOpprettTildelingArgs = {
    oppgaveId: Scalars['String']['input'];
};

export type MutationOverstyrArbeidsforholdArgs = {
    overstyring: ArbeidsforholdOverstyringHandlingInput;
};

export type MutationOverstyrDagerArgs = {
    overstyring: TidslinjeOverstyringInput;
};

export type MutationOverstyrInntektOgRefusjonArgs = {
    overstyring: InntektOgRefusjonOverstyringInput;
};

export type MutationSendIReturArgs = {
    notatTekst: Scalars['String']['input'];
    oppgavereferanse: Scalars['String']['input'];
};

export type MutationSendTilGodkjenningV2Args = {
    oppgavereferanse: Scalars['String']['input'];
    vedtakBegrunnelse?: InputMaybe<Scalars['String']['input']>;
};

export type MutationSendTilInfotrygdArgs = {
    arsak: Scalars['String']['input'];
    begrunnelser: Array<Scalars['String']['input']>;
    kommentar?: InputMaybe<Scalars['String']['input']>;
    oppgavereferanse: Scalars['String']['input'];
};

export type MutationSettVarselstatusArgs = {
    definisjonIdString?: InputMaybe<Scalars['String']['input']>;
    generasjonIdString: Scalars['String']['input'];
    ident: Scalars['String']['input'];
    varselkode: Scalars['String']['input'];
};

export type MutationSkjonnsfastsettSykepengegrunnlagArgs = {
    skjonnsfastsettelse: SkjonnsfastsettelseInput;
};

export type MutationStansAutomatiskBehandlingArgs = {
    begrunnelse: Scalars['String']['input'];
    fodselsnummer: Scalars['String']['input'];
};

export enum Naturalytelse {
    Aksjergrunnfondsbevistilunderkurs = 'AKSJERGRUNNFONDSBEVISTILUNDERKURS',
    Annet = 'ANNET',
    Bedriftsbarnehageplass = 'BEDRIFTSBARNEHAGEPLASS',
    Besoeksreiserhjemmetannet = 'BESOEKSREISERHJEMMETANNET',
    Bil = 'BIL',
    Bolig = 'BOLIG',
    Elektroniskkommunikasjon = 'ELEKTRONISKKOMMUNIKASJON',
    Fritransport = 'FRITRANSPORT',
    Innbetalingtilutenlandskpensjonsordning = 'INNBETALINGTILUTENLANDSKPENSJONSORDNING',
    Kostbesparelseihjemmet = 'KOSTBESPARELSEIHJEMMET',
    Kostdager = 'KOSTDAGER',
    Kostdoegn = 'KOSTDOEGN',
    Losji = 'LOSJI',
    Opsjoner = 'OPSJONER',
    Rentefordellaan = 'RENTEFORDELLAAN',
    Skattepliktigdelforsikringer = 'SKATTEPLIKTIGDELFORSIKRINGER',
    Tilskuddbarnehageplass = 'TILSKUDDBARNEHAGEPLASS',
    Ukjent = 'UKJENT',
    Yrkebiltjenestligbehovkilometer = 'YRKEBILTJENESTLIGBEHOVKILOMETER',
    Yrkebiltjenestligbehovlistepris = 'YRKEBILTJENESTLIGBEHOVLISTEPRIS',
}

export type Notat = {
    __typename: 'Notat';
    dialogRef: Scalars['Int']['output'];
    feilregistrert: Scalars['Boolean']['output'];
    feilregistrert_tidspunkt: Maybe<Scalars['LocalDateTime']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    opprettet: Scalars['LocalDateTime']['output'];
    saksbehandlerEpost: Scalars['String']['output'];
    saksbehandlerIdent: Scalars['String']['output'];
    saksbehandlerNavn: Scalars['String']['output'];
    saksbehandlerOid: Scalars['UUID']['output'];
    tekst: Scalars['String']['output'];
    type: NotatType;
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export enum NotatType {
    Generelt = 'Generelt',
    OpphevStans = 'OpphevStans',
    PaaVent = 'PaaVent',
    Retur = 'Retur',
}

export type OmregnetArsinntekt = {
    __typename: 'OmregnetArsinntekt';
    belop: Scalars['Float']['output'];
    inntektFraAOrdningen: Maybe<Array<InntektFraAOrdningen>>;
    kilde: Inntektskilde;
    manedsbelop: Scalars['Float']['output'];
};

export type OppgaveForPeriodevisning = {
    __typename: 'OppgaveForPeriodevisning';
    id: Scalars['String']['output'];
};

export type OppgaveTilBehandling = {
    __typename: 'OppgaveTilBehandling';
    aktorId: Scalars['String']['output'];
    antallArbeidsforhold: AntallArbeidsforhold;
    egenskaper: Array<Oppgaveegenskap>;
    id: Scalars['String']['output'];
    mottaker: Mottaker;
    navn: Personnavn;
    oppgavetype: Oppgavetype;
    opprettet: Scalars['LocalDateTime']['output'];
    opprinneligSoknadsdato: Scalars['LocalDateTime']['output'];
    paVentInfo: Maybe<PaVentInfo>;
    periodetype: Periodetype;
    tidsfrist: Maybe<Scalars['LocalDate']['output']>;
    tildeling: Maybe<Tildeling>;
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export type Oppgaveegenskap = {
    __typename: 'Oppgaveegenskap';
    egenskap: Egenskap;
    kategori: Kategori;
};

export type OppgaveegenskapInput = {
    egenskap: Egenskap;
    kategori: Kategori;
};

export type OppgaverTilBehandling = {
    __typename: 'OppgaverTilBehandling';
    oppgaver: Array<OppgaveTilBehandling>;
    totaltAntallOppgaver: Scalars['Int']['output'];
};

export type OppgavesorteringInput = {
    nokkel: Sorteringsnokkel;
    stigende: Scalars['Boolean']['input'];
};

export enum Oppgavetype {
    DelvisRefusjon = 'DELVIS_REFUSJON',
    FortroligAdresse = 'FORTROLIG_ADRESSE',
    IngenUtbetaling = 'INGEN_UTBETALING',
    Revurdering = 'REVURDERING',
    RiskQa = 'RISK_QA',
    Soknad = 'SOKNAD',
    Stikkprove = 'STIKKPROVE',
    UtbetalingTilArbeidsgiver = 'UTBETALING_TIL_ARBEIDSGIVER',
    UtbetalingTilSykmeldt = 'UTBETALING_TIL_SYKMELDT',
}

export type OpphevStansAutomatiskBehandlingSaksbehandler = Historikkinnslag & {
    __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
    dialogRef: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    notattekst: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type OpphoerAvNaturalytelse = {
    __typename: 'OpphoerAvNaturalytelse';
    beloepPrMnd: Maybe<Scalars['Float']['output']>;
    fom: Maybe<Scalars['LocalDate']['output']>;
    naturalytelse: Maybe<Naturalytelse>;
};

export type Opptegnelse = {
    __typename: 'Opptegnelse';
    aktorId: Scalars['String']['output'];
    payload: Scalars['String']['output'];
    sekvensnummer: Scalars['Int']['output'];
    type: Opptegnelsetype;
};

export enum Opptegnelsetype {
    FerdigbehandletGodkjenningsbehov = 'FERDIGBEHANDLET_GODKJENNINGSBEHOV',
    NySaksbehandleroppgave = 'NY_SAKSBEHANDLEROPPGAVE',
    PersondataOppdatert = 'PERSONDATA_OPPDATERT',
    PersonKlarTilBehandling = 'PERSON_KLAR_TIL_BEHANDLING',
    RevurderingAvvist = 'REVURDERING_AVVIST',
    RevurderingFerdigbehandlet = 'REVURDERING_FERDIGBEHANDLET',
    UtbetalingAnnulleringFeilet = 'UTBETALING_ANNULLERING_FEILET',
    UtbetalingAnnulleringOk = 'UTBETALING_ANNULLERING_OK',
}

export type Organisasjon = {
    __typename: 'Organisasjon';
    navn: Maybe<Scalars['String']['output']>;
    organisasjonsnummer: Scalars['String']['output'];
};

export type Overstyring = {
    ferdigstilt: Scalars['Boolean']['output'];
    hendelseId: Scalars['UUID']['output'];
    saksbehandler: Saksbehandler;
    timestamp: Scalars['LocalDateTime']['output'];
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export type OverstyringArbeidsforholdInput = {
    begrunnelse: Scalars['String']['input'];
    deaktivert: Scalars['Boolean']['input'];
    forklaring: Scalars['String']['input'];
    lovhjemmel?: InputMaybe<LovhjemmelInput>;
    orgnummer: Scalars['String']['input'];
};

export type OverstyringArbeidsgiverInput = {
    begrunnelse: Scalars['String']['input'];
    fom?: InputMaybe<Scalars['LocalDate']['input']>;
    forklaring: Scalars['String']['input'];
    fraManedligInntekt: Scalars['Float']['input'];
    fraRefusjonsopplysninger?: InputMaybe<Array<OverstyringRefusjonselementInput>>;
    lovhjemmel?: InputMaybe<LovhjemmelInput>;
    manedligInntekt: Scalars['Float']['input'];
    organisasjonsnummer: Scalars['String']['input'];
    refusjonsopplysninger?: InputMaybe<Array<OverstyringRefusjonselementInput>>;
    tom?: InputMaybe<Scalars['LocalDate']['input']>;
};

export type OverstyringDagInput = {
    dato: Scalars['LocalDate']['input'];
    fraGrad?: InputMaybe<Scalars['Int']['input']>;
    fraType: Scalars['String']['input'];
    grad?: InputMaybe<Scalars['Int']['input']>;
    lovhjemmel?: InputMaybe<LovhjemmelInput>;
    type: Scalars['String']['input'];
};

export type OverstyringRefusjonselementInput = {
    belop: Scalars['Float']['input'];
    fom: Scalars['LocalDate']['input'];
    tom?: InputMaybe<Scalars['LocalDate']['input']>;
};

export type OverstyrtDag = {
    __typename: 'OverstyrtDag';
    dato: Scalars['LocalDate']['output'];
    fraGrad: Maybe<Scalars['Int']['output']>;
    fraType: Maybe<Dagtype>;
    grad: Maybe<Scalars['Int']['output']>;
    type: Dagtype;
};

export type OverstyrtInntekt = {
    __typename: 'OverstyrtInntekt';
    begrunnelse: Scalars['String']['output'];
    forklaring: Scalars['String']['output'];
    fraManedligInntekt: Maybe<Scalars['Float']['output']>;
    fraRefusjonsopplysninger: Maybe<Array<Refusjonsopplysning>>;
    manedligInntekt: Scalars['Float']['output'];
    refusjonsopplysninger: Maybe<Array<Refusjonsopplysning>>;
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
};

export type OverstyrtMinimumSykdomsgrad = {
    __typename: 'OverstyrtMinimumSykdomsgrad';
    begrunnelse: Scalars['String']['output'];
    /** @deprecated Bruk vedtaksperiodeId i stedet */
    initierendeVedtaksperiodeId: Scalars['UUID']['output'];
    perioderVurdertIkkeOk: Array<OverstyrtMinimumSykdomsgradPeriode>;
    perioderVurdertOk: Array<OverstyrtMinimumSykdomsgradPeriode>;
};

export type OverstyrtMinimumSykdomsgradPeriode = {
    __typename: 'OverstyrtMinimumSykdomsgradPeriode';
    fom: Scalars['LocalDate']['output'];
    tom: Scalars['LocalDate']['output'];
};

export type PaVent = {
    __typename: 'PaVent';
    frist: Maybe<Scalars['LocalDate']['output']>;
    oid: Scalars['UUID']['output'];
};

export type PaVentArsakInput = {
    _key: Scalars['String']['input'];
    arsak: Scalars['String']['input'];
};

export type PaVentInfo = {
    __typename: 'PaVentInfo';
    arsaker: Array<Scalars['String']['output']>;
    dialogRef: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    opprettet: Scalars['LocalDateTime']['output'];
    saksbehandler: Scalars['String']['output'];
    tekst: Maybe<Scalars['String']['output']>;
    tidsfrist: Scalars['LocalDate']['output'];
};

export type PensjonsgivendeInntekt = {
    __typename: 'PensjonsgivendeInntekt';
    arligBelop: Scalars['BigDecimal']['output'];
    inntektsar: Scalars['Int']['output'];
};

export type Periode = {
    behandlingId: Scalars['UUID']['output'];
    erForkastet: Scalars['Boolean']['output'];
    fom: Scalars['LocalDate']['output'];
    hendelser: Array<Hendelse>;
    id: Scalars['UUID']['output'];
    inntektstype: Inntektstype;
    opprettet: Scalars['LocalDateTime']['output'];
    periodetilstand: Periodetilstand;
    periodetype: Periodetype;
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    tidslinje: Array<Dag>;
    tom: Scalars['LocalDate']['output'];
    varsler: Array<VarselDto>;
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export type PeriodeHistorikkElementNy = Historikkinnslag & {
    __typename: 'PeriodeHistorikkElementNy';
    dialogRef: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    saksbehandlerIdent: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type PeriodeInput = {
    fom: Scalars['LocalDate']['input'];
    tom: Scalars['LocalDate']['input'];
};

export enum Periodehandling {
    Avvise = 'AVVISE',
    Utbetale = 'UTBETALE',
}

export enum PeriodehistorikkType {
    EndrePaVent = 'ENDRE_PA_VENT',
    FjernFraPaVent = 'FJERN_FRA_PA_VENT',
    LeggPaVent = 'LEGG_PA_VENT',
    OpphevStansAutomatiskBehandlingSaksbehandler = 'OPPHEV_STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER',
    StansAutomatiskBehandling = 'STANS_AUTOMATISK_BEHANDLING',
    StansAutomatiskBehandlingSaksbehandler = 'STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER',
    TotrinnsvurderingAttestert = 'TOTRINNSVURDERING_ATTESTERT',
    TotrinnsvurderingRetur = 'TOTRINNSVURDERING_RETUR',
    TotrinnsvurderingTilGodkjenning = 'TOTRINNSVURDERING_TIL_GODKJENNING',
    VedtaksperiodeReberegnet = 'VEDTAKSPERIODE_REBEREGNET',
}

export enum Periodetilstand {
    AnnulleringFeilet = 'AnnulleringFeilet',
    Annullert = 'Annullert',
    AvventerInntektsopplysninger = 'AvventerInntektsopplysninger',
    ForberederGodkjenning = 'ForberederGodkjenning',
    IngenUtbetaling = 'IngenUtbetaling',
    ManglerInformasjon = 'ManglerInformasjon',
    RevurderingFeilet = 'RevurderingFeilet',
    TilAnnullering = 'TilAnnullering',
    TilGodkjenning = 'TilGodkjenning',
    TilInfotrygd = 'TilInfotrygd',
    TilSkjonnsfastsettelse = 'TilSkjonnsfastsettelse',
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
    __typename: 'Periodevilkar';
    alder: Alder;
    sykepengedager: Sykepengedager;
};

export type Person = {
    __typename: 'Person';
    aktorId: Scalars['String']['output'];
    arbeidsgivere: Array<Arbeidsgiver>;
    dodsdato: Maybe<Scalars['LocalDate']['output']>;
    enhet: Enhet;
    fodselsnummer: Scalars['String']['output'];
    infotrygdutbetalinger: Maybe<Array<Infotrygdutbetaling>>;
    personinfo: Personinfo;
    tildeling: Maybe<Tildeling>;
    tilleggsinfoForInntektskilder: Array<TilleggsinfoForInntektskilde>;
    versjon: Scalars['Int']['output'];
    vilkarsgrunnlagV2: Array<VilkarsgrunnlagV2>;
};

export type Personinfo = {
    __typename: 'Personinfo';
    adressebeskyttelse: Adressebeskyttelse;
    automatiskBehandlingStansetAvSaksbehandler: Maybe<Scalars['Boolean']['output']>;
    etternavn: Scalars['String']['output'];
    fodselsdato: Scalars['LocalDate']['output'];
    fornavn: Scalars['String']['output'];
    fullmakt: Maybe<Scalars['Boolean']['output']>;
    kjonn: Kjonn;
    mellomnavn: Maybe<Scalars['String']['output']>;
    reservasjon: Maybe<Reservasjon>;
    unntattFraAutomatisering: Maybe<UnntattFraAutomatiskGodkjenning>;
};

export type Personnavn = {
    __typename: 'Personnavn';
    etternavn: Scalars['String']['output'];
    fornavn: Scalars['String']['output'];
    mellomnavn: Maybe<Scalars['String']['output']>;
};

export type Query = {
    __typename: 'Query';
    antallOppgaver: AntallOppgaver;
    behandledeOppgaverFeed: BehandledeOppgaver;
    behandlingsstatistikk: Behandlingsstatistikk;
    hentInntektsmelding: Maybe<DokumentInntektsmelding>;
    hentSaksbehandlere: Array<Saksbehandler>;
    hentSoknad: Maybe<Soknad>;
    oppgaveFeed: OppgaverTilBehandling;
    opptegnelser: Array<Opptegnelse>;
    organisasjon: Maybe<Organisasjon>;
    person: Maybe<Person>;
    tildelteOppgaverFeed: OppgaverTilBehandling;
    tilkomneInntektskilder: Array<TilkommenInntektskilde>;
    tilkomneInntektskilderV2: Array<TilkommenInntektskilde>;
};

export type QueryBehandledeOppgaverFeedArgs = {
    fom: Scalars['LocalDate']['input'];
    limit: Scalars['Int']['input'];
    offset: Scalars['Int']['input'];
    tom: Scalars['LocalDate']['input'];
};

export type QueryHentInntektsmeldingArgs = {
    dokumentId: Scalars['String']['input'];
    fnr: Scalars['String']['input'];
};

export type QueryHentSoknadArgs = {
    dokumentId: Scalars['String']['input'];
    fnr: Scalars['String']['input'];
};

export type QueryOppgaveFeedArgs = {
    filtrering: FiltreringInput;
    limit: Scalars['Int']['input'];
    offset: Scalars['Int']['input'];
    sortering: Array<OppgavesorteringInput>;
};

export type QueryOpptegnelserArgs = {
    sekvensId?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryOrganisasjonArgs = {
    organisasjonsnummer: Scalars['String']['input'];
};

export type QueryPersonArgs = {
    aktorId?: InputMaybe<Scalars['String']['input']>;
    fnr?: InputMaybe<Scalars['String']['input']>;
};

export type QueryTildelteOppgaverFeedArgs = {
    limit: Scalars['Int']['input'];
    offset: Scalars['Int']['input'];
    oppslattSaksbehandler: SaksbehandlerInput;
};

export type QueryTilkomneInntektskilderArgs = {
    aktorId: Scalars['String']['input'];
};

export type QueryTilkomneInntektskilderV2Args = {
    fodselsnummer: Scalars['String']['input'];
};

export type Refusjon = {
    __typename: 'Refusjon';
    beloepPrMnd: Maybe<Scalars['Float']['output']>;
    opphoersdato: Maybe<Scalars['LocalDate']['output']>;
};

export type Refusjonselement = {
    __typename: 'Refusjonselement';
    belop: Scalars['Float']['output'];
    fom: Scalars['LocalDate']['output'];
    meldingsreferanseId: Scalars['UUID']['output'];
    tom: Maybe<Scalars['LocalDate']['output']>;
};

export type Refusjonsopplysning = {
    __typename: 'Refusjonsopplysning';
    belop: Scalars['Float']['output'];
    fom: Scalars['LocalDate']['output'];
    tom: Maybe<Scalars['LocalDate']['output']>;
};

export type Reservasjon = {
    __typename: 'Reservasjon';
    kanVarsles: Scalars['Boolean']['output'];
    reservert: Scalars['Boolean']['output'];
};

export type Risikovurdering = {
    __typename: 'Risikovurdering';
    funn: Maybe<Array<Faresignal>>;
    kontrollertOk: Array<Faresignal>;
};

export type Saksbehandler = {
    __typename: 'Saksbehandler';
    ident: Maybe<Scalars['String']['output']>;
    navn: Scalars['String']['output'];
};

export type SaksbehandlerInput = {
    ident?: InputMaybe<Scalars['String']['input']>;
    navn: Scalars['String']['input'];
};

export type Sammenligningsgrunnlag = {
    __typename: 'Sammenligningsgrunnlag';
    belop: Scalars['Float']['output'];
    inntektFraAOrdningen: Array<InntektFraAOrdningen>;
};

export type Simulering = {
    __typename: 'Simulering';
    fagsystemId: Scalars['String']['output'];
    perioder: Maybe<Array<Simuleringsperiode>>;
    tidsstempel: Scalars['LocalDateTime']['output'];
    totalbelop: Maybe<Scalars['Int']['output']>;
    utbetalingslinjer: Array<Simuleringslinje>;
};

export type Simuleringsdetaljer = {
    __typename: 'Simuleringsdetaljer';
    antallSats: Scalars['Int']['output'];
    belop: Scalars['Int']['output'];
    fom: Scalars['LocalDate']['output'];
    klassekode: Scalars['String']['output'];
    klassekodebeskrivelse: Scalars['String']['output'];
    konto: Scalars['String']['output'];
    refunderesOrgNr: Scalars['String']['output'];
    sats: Scalars['Float']['output'];
    tilbakeforing: Scalars['Boolean']['output'];
    tom: Scalars['LocalDate']['output'];
    typeSats: Scalars['String']['output'];
    uforegrad: Scalars['Int']['output'];
    utbetalingstype: Scalars['String']['output'];
};

export type Simuleringslinje = {
    __typename: 'Simuleringslinje';
    dagsats: Scalars['Int']['output'];
    fom: Scalars['LocalDate']['output'];
    grad: Scalars['Int']['output'];
    tom: Scalars['LocalDate']['output'];
};

export type Simuleringsperiode = {
    __typename: 'Simuleringsperiode';
    fom: Scalars['LocalDate']['output'];
    tom: Scalars['LocalDate']['output'];
    utbetalinger: Array<Simuleringsutbetaling>;
};

export type Simuleringsutbetaling = {
    __typename: 'Simuleringsutbetaling';
    detaljer: Array<Simuleringsdetaljer>;
    feilkonto: Scalars['Boolean']['output'];
    forfall: Scalars['LocalDate']['output'];
    mottakerId: Scalars['String']['output'];
    mottakerNavn: Scalars['String']['output'];
};

export type SkjonnsfastsattSykepengegrunnlag = {
    __typename: 'SkjonnsfastsattSykepengegrunnlag';
    arlig: Scalars['Float']['output'];
    arsak: Scalars['String']['output'];
    begrunnelse: Maybe<Scalars['String']['output']>;
    begrunnelseFritekst: Maybe<Scalars['String']['output']>;
    begrunnelseKonklusjon: Maybe<Scalars['String']['output']>;
    begrunnelseMal: Maybe<Scalars['String']['output']>;
    fraArlig: Maybe<Scalars['Float']['output']>;
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    type: Maybe<Skjonnsfastsettingstype>;
};

export type SkjonnsfastsettelseArbeidsgiverInput = {
    arlig: Scalars['Float']['input'];
    arsak: Scalars['String']['input'];
    begrunnelseFritekst?: InputMaybe<Scalars['String']['input']>;
    begrunnelseKonklusjon?: InputMaybe<Scalars['String']['input']>;
    begrunnelseMal?: InputMaybe<Scalars['String']['input']>;
    fraArlig: Scalars['Float']['input'];
    initierendeVedtaksperiodeId?: InputMaybe<Scalars['String']['input']>;
    lovhjemmel?: InputMaybe<LovhjemmelInput>;
    organisasjonsnummer: Scalars['String']['input'];
    type: SkjonnsfastsettelseType;
};

export type SkjonnsfastsettelseInput = {
    aktorId: Scalars['String']['input'];
    arbeidsgivere: Array<SkjonnsfastsettelseArbeidsgiverInput>;
    fodselsnummer: Scalars['String']['input'];
    skjaringstidspunkt: Scalars['LocalDate']['input'];
    vedtaksperiodeId: Scalars['UUID']['input'];
};

export enum SkjonnsfastsettelseType {
    Annet = 'ANNET',
    OmregnetArsinntekt = 'OMREGNET_ARSINNTEKT',
    RapportertArsinntekt = 'RAPPORTERT_ARSINNTEKT',
}

export enum Skjonnsfastsettingstype {
    Annet = 'ANNET',
    OmregnetArsinntekt = 'OMREGNET_ARSINNTEKT',
    RapportertArsinntekt = 'RAPPORTERT_ARSINNTEKT',
}

export type Soknad = {
    __typename: 'Soknad';
    arbeidGjenopptatt: Maybe<Scalars['LocalDate']['output']>;
    egenmeldingsdagerFraSykmelding: Maybe<Array<Scalars['LocalDate']['output']>>;
    soknadsperioder: Maybe<Array<Soknadsperioder>>;
    sporsmal: Maybe<Array<Sporsmal>>;
    sykmeldingSkrevet: Maybe<Scalars['LocalDateTime']['output']>;
    type: Maybe<Soknadstype>;
};

export type SoknadArbeidsgiver = Hendelse & {
    __typename: 'SoknadArbeidsgiver';
    eksternDokumentId: Maybe<Scalars['UUID']['output']>;
    fom: Scalars['LocalDate']['output'];
    id: Scalars['UUID']['output'];
    rapportertDato: Scalars['LocalDateTime']['output'];
    sendtArbeidsgiver: Scalars['LocalDateTime']['output'];
    tom: Scalars['LocalDate']['output'];
    type: Hendelsetype;
};

export type SoknadArbeidsledig = Hendelse & {
    __typename: 'SoknadArbeidsledig';
    eksternDokumentId: Maybe<Scalars['UUID']['output']>;
    fom: Scalars['LocalDate']['output'];
    id: Scalars['UUID']['output'];
    rapportertDato: Scalars['LocalDateTime']['output'];
    sendtNav: Scalars['LocalDateTime']['output'];
    tom: Scalars['LocalDate']['output'];
    type: Hendelsetype;
};

export type SoknadFrilans = Hendelse & {
    __typename: 'SoknadFrilans';
    eksternDokumentId: Maybe<Scalars['UUID']['output']>;
    fom: Scalars['LocalDate']['output'];
    id: Scalars['UUID']['output'];
    rapportertDato: Scalars['LocalDateTime']['output'];
    sendtNav: Scalars['LocalDateTime']['output'];
    tom: Scalars['LocalDate']['output'];
    type: Hendelsetype;
};

export type SoknadNav = Hendelse & {
    __typename: 'SoknadNav';
    eksternDokumentId: Maybe<Scalars['UUID']['output']>;
    fom: Scalars['LocalDate']['output'];
    id: Scalars['UUID']['output'];
    rapportertDato: Scalars['LocalDateTime']['output'];
    sendtNav: Scalars['LocalDateTime']['output'];
    tom: Scalars['LocalDate']['output'];
    type: Hendelsetype;
};

export type SoknadSelvstendig = Hendelse & {
    __typename: 'SoknadSelvstendig';
    eksternDokumentId: Maybe<Scalars['UUID']['output']>;
    fom: Scalars['LocalDate']['output'];
    id: Scalars['UUID']['output'];
    rapportertDato: Scalars['LocalDateTime']['output'];
    sendtNav: Scalars['LocalDateTime']['output'];
    tom: Scalars['LocalDate']['output'];
    type: Hendelsetype;
};

export type Soknadsperioder = {
    __typename: 'Soknadsperioder';
    faktiskGrad: Maybe<Scalars['Int']['output']>;
    fom: Scalars['LocalDate']['output'];
    grad: Maybe<Scalars['Int']['output']>;
    sykmeldingsgrad: Maybe<Scalars['Int']['output']>;
    tom: Scalars['LocalDate']['output'];
};

export enum Soknadstype {
    AnnetArbeidsforhold = 'Annet_arbeidsforhold',
    Arbeidsledig = 'Arbeidsledig',
    Arbeidstaker = 'Arbeidstaker',
    Behandlingsdager = 'Behandlingsdager',
    GradertReisetilskudd = 'Gradert_reisetilskudd',
    OppholdUtland = 'Opphold_utland',
    Reisetilskudd = 'Reisetilskudd',
    SelvstendigOgFrilanser = 'Selvstendig_og_frilanser',
    Ukjent = 'UKJENT',
}

export enum Sorteringsnokkel {
    Opprettet = 'OPPRETTET',
    SoknadMottatt = 'SOKNAD_MOTTATT',
    Tidsfrist = 'TIDSFRIST',
    TildeltTil = 'TILDELT_TIL',
}

export type Sporsmal = {
    __typename: 'Sporsmal';
    kriterieForVisningAvUndersporsmal: Maybe<Visningskriterium>;
    sporsmalstekst: Maybe<Scalars['String']['output']>;
    svar: Maybe<Array<Svar>>;
    svartype: Maybe<Svartype>;
    tag: Maybe<Scalars['String']['output']>;
    undersporsmal: Maybe<Array<Sporsmal>>;
    undertekst: Maybe<Scalars['String']['output']>;
};

export type StansAutomatiskBehandlingSaksbehandler = Historikkinnslag & {
    __typename: 'StansAutomatiskBehandlingSaksbehandler';
    dialogRef: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    notattekst: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type Svar = {
    __typename: 'Svar';
    verdi: Maybe<Scalars['String']['output']>;
};

export enum Svartype {
    Bekreftelsespunkter = 'BEKREFTELSESPUNKTER',
    Belop = 'BELOP',
    Checkbox = 'CHECKBOX',
    CheckboxGruppe = 'CHECKBOX_GRUPPE',
    CheckboxPanel = 'CHECKBOX_PANEL',
    ComboboxMulti = 'COMBOBOX_MULTI',
    ComboboxSingle = 'COMBOBOX_SINGLE',
    Dato = 'DATO',
    Datoer = 'DATOER',
    Fritekst = 'FRITEKST',
    GruppeAvUndersporsmal = 'GRUPPE_AV_UNDERSPORSMAL',
    IkkeRelevant = 'IKKE_RELEVANT',
    InfoBehandlingsdager = 'INFO_BEHANDLINGSDAGER',
    JaNei = 'JA_NEI',
    Kilometer = 'KILOMETER',
    Kvittering = 'KVITTERING',
    Land = 'LAND',
    Oppsummering = 'OPPSUMMERING',
    Periode = 'PERIODE',
    Perioder = 'PERIODER',
    Prosent = 'PROSENT',
    Radio = 'RADIO',
    RadioGruppe = 'RADIO_GRUPPE',
    RadioGruppeTimerProsent = 'RADIO_GRUPPE_TIMER_PROSENT',
    RadioGruppeUkekalender = 'RADIO_GRUPPE_UKEKALENDER',
    Tall = 'TALL',
    Timer = 'TIMER',
    Ukjent = 'UKJENT',
}

export enum Sykdomsdagtype {
    AndreYtelserAap = 'ANDRE_YTELSER_AAP',
    AndreYtelserDagpenger = 'ANDRE_YTELSER_DAGPENGER',
    AndreYtelserForeldrepenger = 'ANDRE_YTELSER_FORELDREPENGER',
    AndreYtelserOmsorgspenger = 'ANDRE_YTELSER_OMSORGSPENGER',
    AndreYtelserOpplaringspenger = 'ANDRE_YTELSER_OPPLARINGSPENGER',
    AndreYtelserPleiepenger = 'ANDRE_YTELSER_PLEIEPENGER',
    AndreYtelserSvangerskapspenger = 'ANDRE_YTELSER_SVANGERSKAPSPENGER',
    Arbeidikkegjenopptattdag = 'ARBEIDIKKEGJENOPPTATTDAG',
    Arbeidsdag = 'ARBEIDSDAG',
    Arbeidsgiverdag = 'ARBEIDSGIVERDAG',
    Avslatt = 'AVSLATT',
    Feriedag = 'FERIEDAG',
    ForeldetSykedag = 'FORELDET_SYKEDAG',
    FriskHelgedag = 'FRISK_HELGEDAG',
    Permisjonsdag = 'PERMISJONSDAG',
    Sykedag = 'SYKEDAG',
    SykedagNav = 'SYKEDAG_NAV',
    SykHelgedag = 'SYK_HELGEDAG',
    Ubestemtdag = 'UBESTEMTDAG',
}

export type Sykepengedager = {
    __typename: 'Sykepengedager';
    forbrukteSykedager: Maybe<Scalars['Int']['output']>;
    gjenstaendeSykedager: Maybe<Scalars['Int']['output']>;
    maksdato: Scalars['LocalDate']['output'];
    oppfylt: Scalars['Boolean']['output'];
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
};

export type Sykepengegrunnlagsgrense = {
    __typename: 'Sykepengegrunnlagsgrense';
    grense: Scalars['Int']['output'];
    grunnbelop: Scalars['Int']['output'];
    virkningstidspunkt: Scalars['LocalDate']['output'];
};

export type Sykepengegrunnlagskjonnsfastsetting = Overstyring & {
    __typename: 'Sykepengegrunnlagskjonnsfastsetting';
    ferdigstilt: Scalars['Boolean']['output'];
    hendelseId: Scalars['UUID']['output'];
    saksbehandler: Saksbehandler;
    skjonnsfastsatt: SkjonnsfastsattSykepengegrunnlag;
    timestamp: Scalars['LocalDateTime']['output'];
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export type Sykmelding = Hendelse & {
    __typename: 'Sykmelding';
    fom: Scalars['LocalDate']['output'];
    id: Scalars['UUID']['output'];
    rapportertDato: Scalars['LocalDateTime']['output'];
    tom: Scalars['LocalDate']['output'];
    type: Hendelsetype;
};

export type TidslinjeOverstyringInput = {
    aktorId: Scalars['String']['input'];
    begrunnelse: Scalars['String']['input'];
    dager: Array<OverstyringDagInput>;
    fodselsnummer: Scalars['String']['input'];
    organisasjonsnummer: Scalars['String']['input'];
    vedtaksperiodeId: Scalars['UUID']['input'];
};

export type Tildeling = {
    __typename: 'Tildeling';
    epost: Scalars['String']['output'];
    navn: Scalars['String']['output'];
    oid: Scalars['UUID']['output'];
};

export type TilkommenInntekt = {
    __typename: 'TilkommenInntekt';
    ekskluderteUkedager: Array<Scalars['LocalDate']['output']>;
    erDelAvAktivTotrinnsvurdering: Scalars['Boolean']['output'];
    events: Array<TilkommenInntektEvent>;
    fjernet: Scalars['Boolean']['output'];
    periode: DatoPeriode;
    periodebelop: Scalars['BigDecimal']['output'];
    tilkommenInntektId: Scalars['UUID']['output'];
};

export type TilkommenInntektEndretEvent = TilkommenInntektEvent & {
    __typename: 'TilkommenInntektEndretEvent';
    endringer: TilkommenInntektEventEndringer;
    metadata: TilkommenInntektEventMetadata;
};

export type TilkommenInntektEvent = {
    metadata: TilkommenInntektEventMetadata;
};

export type TilkommenInntektEventBigDecimalEndring = {
    __typename: 'TilkommenInntektEventBigDecimalEndring';
    fra: Scalars['BigDecimal']['output'];
    til: Scalars['BigDecimal']['output'];
};

export type TilkommenInntektEventDatoPeriodeEndring = {
    __typename: 'TilkommenInntektEventDatoPeriodeEndring';
    fra: DatoPeriode;
    til: DatoPeriode;
};

export type TilkommenInntektEventEndringer = {
    __typename: 'TilkommenInntektEventEndringer';
    ekskluderteUkedager: Maybe<TilkommenInntektEventListLocalDateEndring>;
    organisasjonsnummer: Maybe<TilkommenInntektEventStringEndring>;
    periode: Maybe<TilkommenInntektEventDatoPeriodeEndring>;
    periodebelop: Maybe<TilkommenInntektEventBigDecimalEndring>;
};

export type TilkommenInntektEventListLocalDateEndring = {
    __typename: 'TilkommenInntektEventListLocalDateEndring';
    fra: Array<Scalars['LocalDate']['output']>;
    til: Array<Scalars['LocalDate']['output']>;
};

export type TilkommenInntektEventMetadata = {
    __typename: 'TilkommenInntektEventMetadata';
    notatTilBeslutter: Scalars['String']['output'];
    sekvensnummer: Scalars['Int']['output'];
    tidspunkt: Scalars['LocalDateTime']['output'];
    utfortAvSaksbehandlerIdent: Scalars['String']['output'];
};

export type TilkommenInntektEventStringEndring = {
    __typename: 'TilkommenInntektEventStringEndring';
    fra: Scalars['String']['output'];
    til: Scalars['String']['output'];
};

export type TilkommenInntektFjernetEvent = TilkommenInntektEvent & {
    __typename: 'TilkommenInntektFjernetEvent';
    metadata: TilkommenInntektEventMetadata;
};

export type TilkommenInntektGjenopprettetEvent = TilkommenInntektEvent & {
    __typename: 'TilkommenInntektGjenopprettetEvent';
    endringer: TilkommenInntektEventEndringer;
    metadata: TilkommenInntektEventMetadata;
};

export type TilkommenInntektInput = {
    ekskluderteUkedager: Array<Scalars['LocalDate']['input']>;
    organisasjonsnummer: Scalars['String']['input'];
    periode: DatoPeriodeInput;
    periodebelop: Scalars['BigDecimal']['input'];
};

export type TilkommenInntektOpprettetEvent = TilkommenInntektEvent & {
    __typename: 'TilkommenInntektOpprettetEvent';
    ekskluderteUkedager: Array<Scalars['LocalDate']['output']>;
    metadata: TilkommenInntektEventMetadata;
    organisasjonsnummer: Scalars['String']['output'];
    periode: DatoPeriode;
    periodebelop: Scalars['BigDecimal']['output'];
};

export type TilkommenInntektskilde = {
    __typename: 'TilkommenInntektskilde';
    inntekter: Array<TilkommenInntekt>;
    organisasjonsnummer: Scalars['String']['output'];
};

export type TilleggsinfoForInntektskilde = {
    __typename: 'TilleggsinfoForInntektskilde';
    navn: Scalars['String']['output'];
    orgnummer: Scalars['String']['output'];
};

export type Totrinnsvurdering = {
    __typename: 'Totrinnsvurdering';
    beslutter: Maybe<Scalars['UUID']['output']>;
    erBeslutteroppgave: Scalars['Boolean']['output'];
    erRetur: Scalars['Boolean']['output'];
    saksbehandler: Maybe<Scalars['UUID']['output']>;
};

export type TotrinnsvurderingRetur = Historikkinnslag & {
    __typename: 'TotrinnsvurderingRetur';
    dialogRef: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    notattekst: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type UberegnetPeriode = Periode & {
    __typename: 'UberegnetPeriode';
    behandlingId: Scalars['UUID']['output'];
    erForkastet: Scalars['Boolean']['output'];
    fom: Scalars['LocalDate']['output'];
    hendelser: Array<Hendelse>;
    id: Scalars['UUID']['output'];
    inntektstype: Inntektstype;
    notater: Array<Notat>;
    opprettet: Scalars['LocalDateTime']['output'];
    periodetilstand: Periodetilstand;
    periodetype: Periodetype;
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    tidslinje: Array<Dag>;
    tom: Scalars['LocalDate']['output'];
    varsler: Array<VarselDto>;
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export type UnntattFraAutomatiskGodkjenning = {
    __typename: 'UnntattFraAutomatiskGodkjenning';
    arsaker: Array<Scalars['String']['output']>;
    erUnntatt: Scalars['Boolean']['output'];
    tidspunkt: Maybe<Scalars['LocalDateTime']['output']>;
};

export type Utbetaling = {
    __typename: 'Utbetaling';
    arbeidsgiverFagsystemId: Scalars['String']['output'];
    arbeidsgiverNettoBelop: Scalars['Int']['output'];
    arbeidsgiversimulering: Maybe<Simulering>;
    id: Scalars['UUID']['output'];
    personFagsystemId: Scalars['String']['output'];
    personNettoBelop: Scalars['Int']['output'];
    personsimulering: Maybe<Simulering>;
    status: Utbetalingstatus;
    type: Utbetalingtype;
    vurdering: Maybe<Vurdering>;
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
    __typename: 'Utbetalingsinfo';
    arbeidsgiverbelop: Maybe<Scalars['Int']['output']>;
    inntekt: Maybe<Scalars['Int']['output']>;
    personbelop: Maybe<Scalars['Int']['output']>;
    refusjonsbelop: Maybe<Scalars['Int']['output']>;
    totalGrad: Maybe<Scalars['Float']['output']>;
    utbetaling: Maybe<Scalars['Int']['output']>;
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
    __typename: 'VarselDTO';
    definisjonId: Scalars['UUID']['output'];
    forklaring: Maybe<Scalars['String']['output']>;
    generasjonId: Scalars['UUID']['output'];
    handling: Maybe<Scalars['String']['output']>;
    kode: Scalars['String']['output'];
    opprettet: Scalars['LocalDateTime']['output'];
    tittel: Scalars['String']['output'];
    vurdering: Maybe<VarselvurderingDto>;
};

export enum Varselstatus {
    Aktiv = 'AKTIV',
    Avvist = 'AVVIST',
    Godkjent = 'GODKJENT',
    Vurdert = 'VURDERT',
}

export type VarselvurderingDto = {
    __typename: 'VarselvurderingDTO';
    ident: Scalars['String']['output'];
    status: Varselstatus;
    tidsstempel: Scalars['LocalDateTime']['output'];
};

export type VedtakBegrunnelse = {
    __typename: 'VedtakBegrunnelse';
    begrunnelse: Maybe<Scalars['String']['output']>;
    opprettet: Scalars['LocalDateTime']['output'];
    saksbehandlerIdent: Scalars['String']['output'];
    utfall: VedtakUtfall;
};

export enum VedtakUtfall {
    Avslag = 'AVSLAG',
    DelvisInnvilgelse = 'DELVIS_INNVILGELSE',
    Innvilgelse = 'INNVILGELSE',
}

export type VilkarsgrunnlagAvviksvurdering = {
    __typename: 'VilkarsgrunnlagAvviksvurdering';
    avviksprosent: Scalars['BigDecimal']['output'];
    beregningsgrunnlag: Scalars['BigDecimal']['output'];
    sammenligningsgrunnlag: Scalars['BigDecimal']['output'];
};

export type VilkarsgrunnlagInfotrygdV2 = VilkarsgrunnlagV2 & {
    __typename: 'VilkarsgrunnlagInfotrygdV2';
    arbeidsgiverrefusjoner: Array<Arbeidsgiverrefusjon>;
    id: Scalars['UUID']['output'];
    inntekter: Array<Arbeidsgiverinntekt>;
    omregnetArsinntekt: Scalars['Float']['output'];
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    sykepengegrunnlag: Scalars['Float']['output'];
};

export type VilkarsgrunnlagSpleisV2 = VilkarsgrunnlagV2 & {
    __typename: 'VilkarsgrunnlagSpleisV2';
    antallOpptjeningsdagerErMinst: Scalars['Int']['output'];
    arbeidsgiverrefusjoner: Array<Arbeidsgiverrefusjon>;
    avviksvurdering: Maybe<VilkarsgrunnlagAvviksvurdering>;
    beregningsgrunnlag: Scalars['BigDecimal']['output'];
    grunnbelop: Scalars['Int']['output'];
    id: Scalars['UUID']['output'];
    inntekter: Array<Arbeidsgiverinntekt>;
    oppfyllerKravOmMinstelonn: Scalars['Boolean']['output'];
    oppfyllerKravOmOpptjening: Scalars['Boolean']['output'];
    opptjeningFra: Scalars['LocalDate']['output'];
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    skjonnsmessigFastsattAarlig: Maybe<Scalars['Float']['output']>;
    sykepengegrunnlag: Scalars['Float']['output'];
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    vurderingAvKravOmMedlemskap: VilkarsgrunnlagVurdering;
};

export type VilkarsgrunnlagV2 = {
    arbeidsgiverrefusjoner: Array<Arbeidsgiverrefusjon>;
    id: Scalars['UUID']['output'];
    inntekter: Array<Arbeidsgiverinntekt>;
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    sykepengegrunnlag: Scalars['Float']['output'];
};

export enum VilkarsgrunnlagVurdering {
    IkkeOppfylt = 'IKKE_OPPFYLT',
    IkkeVurdert = 'IKKE_VURDERT',
    Oppfylt = 'OPPFYLT',
}

export enum Visningskriterium {
    Checked = 'CHECKED',
    Ja = 'JA',
    Nei = 'NEI',
    Ukjent = 'UKJENT',
}

export type Vurdering = {
    __typename: 'Vurdering';
    automatisk: Scalars['Boolean']['output'];
    godkjent: Scalars['Boolean']['output'];
    ident: Scalars['String']['output'];
    tidsstempel: Scalars['LocalDateTime']['output'];
};

export type AnnullerMutationVariables = Exact<{
    annullering: AnnulleringDataInput;
}>;

export type AnnullerMutation = { __typename: 'Mutation'; annuller: boolean };

export type AntallOppgaverQueryVariables = Exact<{ [key: string]: never }>;

export type AntallOppgaverQuery = {
    __typename: 'Query';
    antallOppgaver: { __typename: 'AntallOppgaver'; antallMineSaker: number; antallMineSakerPaVent: number };
};

export type BehandledeOppgaverFeedQueryVariables = Exact<{
    offset: Scalars['Int']['input'];
    limit: Scalars['Int']['input'];
    fom: Scalars['LocalDate']['input'];
    tom: Scalars['LocalDate']['input'];
}>;

export type BehandledeOppgaverFeedQuery = {
    __typename: 'Query';
    behandledeOppgaverFeed: {
        __typename: 'BehandledeOppgaver';
        totaltAntallOppgaver: number;
        oppgaver: Array<{
            __typename: 'BehandletOppgave';
            id: string;
            aktorId: string;
            ferdigstiltAv: string | null;
            beslutter: string | null;
            saksbehandler: string | null;
            ferdigstiltTidspunkt: string;
            antallArbeidsforhold: AntallArbeidsforhold;
            periodetype: Periodetype;
            oppgavetype: Oppgavetype;
            personnavn: { __typename: 'Personnavn'; fornavn: string; mellomnavn: string | null; etternavn: string };
        }>;
    };
};

export type AntallFragment = { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };

export type HentBehandlingsstatistikkQueryVariables = Exact<{ [key: string]: never }>;

export type HentBehandlingsstatistikkQuery = {
    __typename: 'Query';
    behandlingsstatistikk: {
        __typename: 'Behandlingsstatistikk';
        antallAnnulleringer: number;
        antallAvvisninger: number;
        enArbeidsgiver: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        flereArbeidsgivere: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        beslutter: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        egenAnsatt: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        delvisRefusjon: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        faresignaler: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        forlengelser: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        forlengelseIt: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        forstegangsbehandling: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        fortroligAdresse: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        revurdering: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        stikkprover: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        utbetalingTilArbeidsgiver: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        utbetalingTilSykmeldt: { __typename: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
    };
};

export type FetchInntektsmeldingQueryVariables = Exact<{
    fnr: Scalars['String']['input'];
    dokumentId: Scalars['String']['input'];
}>;

export type FetchInntektsmeldingQuery = {
    __typename: 'Query';
    hentInntektsmelding: {
        __typename: 'DokumentInntektsmelding';
        arbeidsforholdId: string | null;
        virksomhetsnummer: string | null;
        begrunnelseForReduksjonEllerIkkeUtbetalt: string | null;
        bruttoUtbetalt: number | null;
        beregnetInntekt: number | null;
        foersteFravaersdag: string | null;
        naerRelasjon: boolean | null;
        innsenderFulltNavn: string | null;
        innsenderTelefon: string | null;
        refusjon: { __typename: 'Refusjon'; beloepPrMnd: number | null; opphoersdato: string | null } | null;
        endringIRefusjoner: Array<{
            __typename: 'EndringIRefusjon';
            endringsdato: string | null;
            beloep: number | null;
        }> | null;
        opphoerAvNaturalytelser: Array<{
            __typename: 'OpphoerAvNaturalytelse';
            naturalytelse: Naturalytelse | null;
            fom: string | null;
            beloepPrMnd: number | null;
        }> | null;
        gjenopptakelseNaturalytelser: Array<{
            __typename: 'GjenopptakelseNaturalytelse';
            naturalytelse: Naturalytelse | null;
            fom: string | null;
            beloepPrMnd: number | null;
        }> | null;
        arbeidsgiverperioder: Array<{ __typename: 'IMPeriode'; fom: string | null; tom: string | null }> | null;
        ferieperioder: Array<{ __typename: 'IMPeriode'; fom: string | null; tom: string | null }> | null;
        inntektEndringAarsaker: Array<{
            __typename: 'InntektEndringAarsak';
            aarsak: string;
            gjelderFra: string | null;
            bleKjent: string | null;
            perioder: Array<{ __typename: 'IMPeriode'; fom: string | null; tom: string | null }> | null;
        }> | null;
        avsenderSystem: { __typename: 'AvsenderSystem'; navn: string | null } | null;
    } | null;
};

export type SporsmalFragment = {
    __typename: 'Sporsmal';
    sporsmalstekst: string | null;
    svartype: Svartype | null;
    tag: string | null;
    svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
};

export type FetchSoknadQueryVariables = Exact<{
    fnr: Scalars['String']['input'];
    dokumentId: Scalars['String']['input'];
}>;

export type FetchSoknadQuery = {
    __typename: 'Query';
    hentSoknad: {
        __typename: 'Soknad';
        type: Soknadstype | null;
        arbeidGjenopptatt: string | null;
        sykmeldingSkrevet: string | null;
        egenmeldingsdagerFraSykmelding: Array<string> | null;
        soknadsperioder: Array<{
            __typename: 'Soknadsperioder';
            fom: string;
            tom: string;
            grad: number | null;
            faktiskGrad: number | null;
            sykmeldingsgrad: number | null;
        }> | null;
        sporsmal: Array<{
            __typename: 'Sporsmal';
            sporsmalstekst: string | null;
            svartype: Svartype | null;
            tag: string | null;
            undersporsmal: Array<{
                __typename: 'Sporsmal';
                sporsmalstekst: string | null;
                svartype: Svartype | null;
                tag: string | null;
                undersporsmal: Array<{
                    __typename: 'Sporsmal';
                    sporsmalstekst: string | null;
                    svartype: Svartype | null;
                    tag: string | null;
                    undersporsmal: Array<{
                        __typename: 'Sporsmal';
                        sporsmalstekst: string | null;
                        svartype: Svartype | null;
                        tag: string | null;
                        undersporsmal: Array<{
                            __typename: 'Sporsmal';
                            sporsmalstekst: string | null;
                            svartype: Svartype | null;
                            tag: string | null;
                            undersporsmal: Array<{
                                __typename: 'Sporsmal';
                                sporsmalstekst: string | null;
                                svartype: Svartype | null;
                                tag: string | null;
                                undersporsmal: Array<{
                                    __typename: 'Sporsmal';
                                    sporsmalstekst: string | null;
                                    svartype: Svartype | null;
                                    tag: string | null;
                                    undersporsmal: Array<{
                                        __typename: 'Sporsmal';
                                        sporsmalstekst: string | null;
                                        svartype: Svartype | null;
                                        tag: string | null;
                                        undersporsmal: Array<{
                                            __typename: 'Sporsmal';
                                            sporsmalstekst: string | null;
                                            svartype: Svartype | null;
                                            tag: string | null;
                                            undersporsmal: Array<{
                                                __typename: 'Sporsmal';
                                                sporsmalstekst: string | null;
                                                svartype: Svartype | null;
                                                tag: string | null;
                                                undersporsmal: Array<{
                                                    __typename: 'Sporsmal';
                                                    sporsmalstekst: string | null;
                                                    svartype: Svartype | null;
                                                    tag: string | null;
                                                    svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
                                                }> | null;
                                                svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
                                            }> | null;
                                            svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
                                        }> | null;
                                        svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
                                    }> | null;
                                    svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
                                }> | null;
                                svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
                            }> | null;
                            svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
                        }> | null;
                        svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
                    }> | null;
                    svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
                }> | null;
                svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
            }> | null;
            svar: Array<{ __typename: 'Svar'; verdi: string | null }> | null;
        }> | null;
    } | null;
};

export type HentSaksbehandlereQueryVariables = Exact<{ [key: string]: never }>;

export type HentSaksbehandlereQuery = {
    __typename: 'Query';
    hentSaksbehandlere: Array<{ __typename: 'Saksbehandler'; ident: string | null; navn: string }>;
};

export type FeilregistrerKommentarMutationMutationVariables = Exact<{
    id: Scalars['Int']['input'];
}>;

export type FeilregistrerKommentarMutationMutation = {
    __typename: 'Mutation';
    feilregistrerKommentar: {
        __typename: 'Kommentar';
        id: number;
        opprettet: string;
        feilregistrert_tidspunkt: string | null;
        saksbehandlerident: string;
        tekst: string;
    } | null;
};

export type LeggTilKommentarMutationVariables = Exact<{
    tekst: Scalars['String']['input'];
    dialogRef: Scalars['Int']['input'];
    saksbehandlerident: Scalars['String']['input'];
}>;

export type LeggTilKommentarMutation = {
    __typename: 'Mutation';
    leggTilKommentar: {
        __typename: 'Kommentar';
        id: number;
        tekst: string;
        opprettet: string;
        saksbehandlerident: string;
        feilregistrert_tidspunkt: string | null;
    } | null;
};

export type FeilregistrerNotatMutationMutationVariables = Exact<{
    id: Scalars['Int']['input'];
}>;

export type FeilregistrerNotatMutationMutation = {
    __typename: 'Mutation';
    feilregistrerNotat: {
        __typename: 'Notat';
        id: number;
        tekst: string;
        opprettet: string;
        saksbehandlerOid: string;
        saksbehandlerNavn: string;
        saksbehandlerEpost: string;
        saksbehandlerIdent: string;
        vedtaksperiodeId: string;
        feilregistrert: boolean;
        feilregistrert_tidspunkt: string | null;
        type: NotatType;
        kommentarer: Array<{
            __typename: 'Kommentar';
            id: number;
            tekst: string;
            opprettet: string;
            saksbehandlerident: string;
            feilregistrert_tidspunkt: string | null;
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
    __typename: 'Mutation';
    leggTilNotat: {
        __typename: 'Notat';
        id: number;
        tekst: string;
        opprettet: string;
        saksbehandlerOid: string;
        saksbehandlerNavn: string;
        saksbehandlerEpost: string;
        saksbehandlerIdent: string;
        vedtaksperiodeId: string;
        feilregistrert: boolean;
        feilregistrert_tidspunkt: string | null;
        type: NotatType;
        kommentarer: Array<{
            __typename: 'Kommentar';
            id: number;
            tekst: string;
            opprettet: string;
            saksbehandlerident: string;
            feilregistrert_tidspunkt: string | null;
        }>;
    } | null;
};

export type OppgaveFeedQueryVariables = Exact<{
    offset: Scalars['Int']['input'];
    limit: Scalars['Int']['input'];
    sortering: Array<OppgavesorteringInput> | OppgavesorteringInput;
    filtrering: FiltreringInput;
}>;

export type OppgaveFeedQuery = {
    __typename: 'Query';
    oppgaveFeed: {
        __typename: 'OppgaverTilBehandling';
        totaltAntallOppgaver: number;
        oppgaver: Array<{
            __typename: 'OppgaveTilBehandling';
            aktorId: string;
            id: string;
            opprettet: string;
            opprinneligSoknadsdato: string;
            tidsfrist: string | null;
            vedtaksperiodeId: string;
            oppgavetype: Oppgavetype;
            periodetype: Periodetype;
            mottaker: Mottaker;
            antallArbeidsforhold: AntallArbeidsforhold;
            egenskaper: Array<{ __typename: 'Oppgaveegenskap'; egenskap: Egenskap; kategori: Kategori }>;
            navn: { __typename: 'Personnavn'; fornavn: string; etternavn: string; mellomnavn: string | null };
            paVentInfo: {
                __typename: 'PaVentInfo';
                tidsfrist: string;
                opprettet: string;
                saksbehandler: string;
                dialogRef: number;
                arsaker: Array<string>;
                tekst: string | null;
                kommentarer: Array<{
                    __typename: 'Kommentar';
                    id: number;
                    opprettet: string;
                    saksbehandlerident: string;
                    tekst: string;
                    feilregistrert_tidspunkt: string | null;
                }>;
            } | null;
            tildeling: { __typename: 'Tildeling'; epost: string; navn: string; oid: string } | null;
        }>;
    };
};

export type OpphevStansMutationVariables = Exact<{
    fodselsnummer: Scalars['String']['input'];
    begrunnelse: Scalars['String']['input'];
}>;

export type OpphevStansMutation = { __typename: 'Mutation'; opphevStans: boolean };

export type OpprettAbonnementMutationVariables = Exact<{
    personidentifikator: Scalars['String']['input'];
}>;

export type OpprettAbonnementMutation = { __typename: 'Mutation'; opprettAbonnement: boolean };

export type OpptegnelserQueryVariables = Exact<{
    sekvensId?: InputMaybe<Scalars['Int']['input']>;
}>;

export type OpptegnelserQuery = {
    __typename: 'Query';
    opptegnelser: Array<{
        __typename: 'Opptegnelse';
        aktorId: string;
        type: Opptegnelsetype;
        sekvensnummer: number;
        payload: string;
    }>;
};

export type HentOrganisasjonQueryVariables = Exact<{
    organisasjonsnummer: Scalars['String']['input'];
}>;

export type HentOrganisasjonQuery = {
    __typename: 'Query';
    organisasjon: { __typename: 'Organisasjon'; organisasjonsnummer: string; navn: string | null } | null;
};

export type OverstyrArbeidsforholdMutationMutationVariables = Exact<{
    overstyring: ArbeidsforholdOverstyringHandlingInput;
}>;

export type OverstyrArbeidsforholdMutationMutation = { __typename: 'Mutation'; overstyrArbeidsforhold: boolean | null };

export type OverstyrDagerMutationMutationVariables = Exact<{
    overstyring: TidslinjeOverstyringInput;
}>;

export type OverstyrDagerMutationMutation = { __typename: 'Mutation'; overstyrDager: boolean | null };

export type OverstyrInntektOgRefusjonMutationMutationVariables = Exact<{
    overstyring: InntektOgRefusjonOverstyringInput;
}>;

export type OverstyrInntektOgRefusjonMutationMutation = {
    __typename: 'Mutation';
    overstyrInntektOgRefusjon: boolean | null;
};

export type MinimumSykdomsgradMutationMutationVariables = Exact<{
    minimumSykdomsgrad: MinimumSykdomsgradInput;
}>;

export type MinimumSykdomsgradMutationMutation = { __typename: 'Mutation'; minimumSykdomsgrad: boolean | null };

export type SimuleringFragment = {
    __typename: 'Simulering';
    fagsystemId: string;
    totalbelop: number | null;
    tidsstempel: string;
    utbetalingslinjer: Array<{
        __typename: 'Simuleringslinje';
        fom: string;
        tom: string;
        dagsats: number;
        grad: number;
    }>;
    perioder: Array<{
        __typename: 'Simuleringsperiode';
        fom: string;
        tom: string;
        utbetalinger: Array<{
            __typename: 'Simuleringsutbetaling';
            mottakerId: string;
            mottakerNavn: string;
            forfall: string;
            feilkonto: boolean;
            detaljer: Array<{
                __typename: 'Simuleringsdetaljer';
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

export type Overstyring_Arbeidsforholdoverstyring_Fragment = {
    __typename: 'Arbeidsforholdoverstyring';
    begrunnelse: string;
    deaktivert: boolean;
    skjaeringstidspunkt: string;
    forklaring: string;
    hendelseId: string;
    timestamp: string;
    ferdigstilt: boolean;
    vedtaksperiodeId: string;
    saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
};

export type Overstyring_Dagoverstyring_Fragment = {
    __typename: 'Dagoverstyring';
    begrunnelse: string;
    hendelseId: string;
    timestamp: string;
    ferdigstilt: boolean;
    vedtaksperiodeId: string;
    dager: Array<{
        __typename: 'OverstyrtDag';
        grad: number | null;
        fraGrad: number | null;
        dato: string;
        type: Dagtype;
        fraType: Dagtype | null;
    }>;
    saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
};

export type Overstyring_Inntektoverstyring_Fragment = {
    __typename: 'Inntektoverstyring';
    hendelseId: string;
    timestamp: string;
    ferdigstilt: boolean;
    vedtaksperiodeId: string;
    inntekt: {
        __typename: 'OverstyrtInntekt';
        skjaeringstidspunkt: string;
        forklaring: string;
        begrunnelse: string;
        manedligInntekt: number;
        fraManedligInntekt: number | null;
        refusjonsopplysninger: Array<{
            __typename: 'Refusjonsopplysning';
            fom: string;
            tom: string | null;
            belop: number;
        }> | null;
        fraRefusjonsopplysninger: Array<{
            __typename: 'Refusjonsopplysning';
            fom: string;
            tom: string | null;
            belop: number;
        }> | null;
    };
    saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
};

export type Overstyring_MinimumSykdomsgradOverstyring_Fragment = {
    __typename: 'MinimumSykdomsgradOverstyring';
    hendelseId: string;
    timestamp: string;
    ferdigstilt: boolean;
    vedtaksperiodeId: string;
    minimumSykdomsgrad: {
        __typename: 'OverstyrtMinimumSykdomsgrad';
        begrunnelse: string;
        initierendeVedtaksperiodeId: string;
        perioderVurdertOk: Array<{ __typename: 'OverstyrtMinimumSykdomsgradPeriode'; fom: string; tom: string }>;
        perioderVurdertIkkeOk: Array<{ __typename: 'OverstyrtMinimumSykdomsgradPeriode'; fom: string; tom: string }>;
    };
    saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
};

export type Overstyring_Sykepengegrunnlagskjonnsfastsetting_Fragment = {
    __typename: 'Sykepengegrunnlagskjonnsfastsetting';
    hendelseId: string;
    timestamp: string;
    ferdigstilt: boolean;
    vedtaksperiodeId: string;
    skjonnsfastsatt: {
        __typename: 'SkjonnsfastsattSykepengegrunnlag';
        arsak: string;
        type: Skjonnsfastsettingstype | null;
        begrunnelse: string | null;
        begrunnelseMal: string | null;
        begrunnelseFritekst: string | null;
        begrunnelseKonklusjon: string | null;
        arlig: number;
        fraArlig: number | null;
        skjaeringstidspunkt: string;
    };
    saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
};

export type OverstyringFragment =
    | Overstyring_Arbeidsforholdoverstyring_Fragment
    | Overstyring_Dagoverstyring_Fragment
    | Overstyring_Inntektoverstyring_Fragment
    | Overstyring_MinimumSykdomsgradOverstyring_Fragment
    | Overstyring_Sykepengegrunnlagskjonnsfastsetting_Fragment;

export type TilleggsinfoForInntektskildeFragment = {
    __typename: 'TilleggsinfoForInntektskilde';
    orgnummer: string;
    navn: string;
};

export type ArbeidsgiverFragment = {
    __typename: 'Arbeidsgiver';
    navn: string;
    organisasjonsnummer: string;
    arbeidsforhold: Array<{
        __typename: 'Arbeidsforhold';
        sluttdato: string | null;
        startdato: string;
        stillingsprosent: number;
        stillingstittel: string;
    }>;
    ghostPerioder: Array<{
        __typename: 'GhostPeriode';
        id: string;
        deaktivert: boolean;
        vilkarsgrunnlagId: string | null;
        skjaeringstidspunkt: string;
        fom: string;
        tom: string;
        organisasjonsnummer: string;
    }>;
    generasjoner: Array<{
        __typename: 'Generasjon';
        id: string;
        perioder: Array<
            | {
                  __typename: 'BeregnetPeriode';
                  id: string;
                  beregningId: string;
                  forbrukteSykedager: number | null;
                  gjenstaendeSykedager: number | null;
                  vedtaksperiodeId: string;
                  maksdato: string;
                  vilkarsgrunnlagId: string | null;
                  behandlingId: string;
                  fom: string;
                  tom: string;
                  erForkastet: boolean;
                  inntektstype: Inntektstype;
                  opprettet: string;
                  periodetype: Periodetype;
                  periodetilstand: Periodetilstand;
                  skjaeringstidspunkt: string;
                  handlinger: Array<{
                      __typename: 'Handling';
                      type: Periodehandling;
                      tillatt: boolean;
                      begrunnelse: string | null;
                  }>;
                  notater: Array<{
                      __typename: 'Notat';
                      id: number;
                      dialogRef: number;
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
                          __typename: 'Kommentar';
                          id: number;
                          tekst: string;
                          opprettet: string;
                          saksbehandlerident: string;
                          feilregistrert_tidspunkt: string | null;
                      }>;
                  }>;
                  historikkinnslag: Array<
                      | {
                            __typename: 'EndrePaVent';
                            frist: string | null;
                            arsaker: Array<string>;
                            notattekst: string | null;
                            id: number;
                            type: PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'FjernetFraPaVent';
                            id: number;
                            type: PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                        }
                      | {
                            __typename: 'LagtPaVent';
                            frist: string | null;
                            arsaker: Array<string>;
                            notattekst: string | null;
                            id: number;
                            type: PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                            notattekst: string | null;
                            id: number;
                            type: PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'PeriodeHistorikkElementNy';
                            id: number;
                            type: PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                        }
                      | {
                            __typename: 'StansAutomatiskBehandlingSaksbehandler';
                            notattekst: string | null;
                            id: number;
                            type: PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                      | {
                            __typename: 'TotrinnsvurderingRetur';
                            notattekst: string | null;
                            id: number;
                            type: PeriodehistorikkType;
                            timestamp: string;
                            saksbehandlerIdent: string | null;
                            dialogRef: number | null;
                            kommentarer: Array<{
                                __typename: 'Kommentar';
                                id: number;
                                tekst: string;
                                opprettet: string;
                                saksbehandlerident: string;
                                feilregistrert_tidspunkt: string | null;
                            }>;
                        }
                  >;
                  periodevilkar: {
                      __typename: 'Periodevilkar';
                      alder: { __typename: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
                      sykepengedager: {
                          __typename: 'Sykepengedager';
                          forbrukteSykedager: number | null;
                          gjenstaendeSykedager: number | null;
                          maksdato: string;
                          oppfylt: boolean;
                          skjaeringstidspunkt: string;
                      };
                  };
                  risikovurdering: {
                      __typename: 'Risikovurdering';
                      funn: Array<{ __typename: 'Faresignal'; beskrivelse: string; kategori: Array<string> }> | null;
                      kontrollertOk: Array<{ __typename: 'Faresignal'; beskrivelse: string; kategori: Array<string> }>;
                  } | null;
                  utbetaling: {
                      __typename: 'Utbetaling';
                      id: string;
                      arbeidsgiverFagsystemId: string;
                      arbeidsgiverNettoBelop: number;
                      personFagsystemId: string;
                      personNettoBelop: number;
                      status: Utbetalingstatus;
                      type: Utbetalingtype;
                      vurdering: {
                          __typename: 'Vurdering';
                          automatisk: boolean;
                          godkjent: boolean;
                          ident: string;
                          tidsstempel: string;
                      } | null;
                      arbeidsgiversimulering: {
                          __typename: 'Simulering';
                          fagsystemId: string;
                          totalbelop: number | null;
                          tidsstempel: string;
                          utbetalingslinjer: Array<{
                              __typename: 'Simuleringslinje';
                              fom: string;
                              tom: string;
                              dagsats: number;
                              grad: number;
                          }>;
                          perioder: Array<{
                              __typename: 'Simuleringsperiode';
                              fom: string;
                              tom: string;
                              utbetalinger: Array<{
                                  __typename: 'Simuleringsutbetaling';
                                  mottakerId: string;
                                  mottakerNavn: string;
                                  forfall: string;
                                  feilkonto: boolean;
                                  detaljer: Array<{
                                      __typename: 'Simuleringsdetaljer';
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
                      personsimulering: {
                          __typename: 'Simulering';
                          fagsystemId: string;
                          totalbelop: number | null;
                          tidsstempel: string;
                          utbetalingslinjer: Array<{
                              __typename: 'Simuleringslinje';
                              fom: string;
                              tom: string;
                              dagsats: number;
                              grad: number;
                          }>;
                          perioder: Array<{
                              __typename: 'Simuleringsperiode';
                              fom: string;
                              tom: string;
                              utbetalinger: Array<{
                                  __typename: 'Simuleringsutbetaling';
                                  mottakerId: string;
                                  mottakerNavn: string;
                                  forfall: string;
                                  feilkonto: boolean;
                                  detaljer: Array<{
                                      __typename: 'Simuleringsdetaljer';
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
                  oppgave: { __typename: 'OppgaveForPeriodevisning'; id: string } | null;
                  paVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
                  totrinnsvurdering: {
                      __typename: 'Totrinnsvurdering';
                      erBeslutteroppgave: boolean;
                      erRetur: boolean;
                      saksbehandler: string | null;
                      beslutter: string | null;
                  } | null;
                  egenskaper: Array<{ __typename: 'Oppgaveegenskap'; egenskap: Egenskap; kategori: Kategori }>;
                  avslag: Array<{
                      __typename: 'Avslag';
                      type: Avslagstype;
                      begrunnelse: string;
                      opprettet: string;
                      saksbehandlerIdent: string;
                      invalidert: boolean;
                  }>;
                  vedtakBegrunnelser: Array<{
                      __typename: 'VedtakBegrunnelse';
                      utfall: VedtakUtfall;
                      begrunnelse: string | null;
                      opprettet: string;
                      saksbehandlerIdent: string;
                  }>;
                  annullering: {
                      __typename: 'Annullering';
                      saksbehandlerIdent: string;
                      arbeidsgiverFagsystemId: string | null;
                      personFagsystemId: string | null;
                      tidspunkt: string;
                      arsaker: Array<string>;
                      begrunnelse: string | null;
                  } | null;
                  pensjonsgivendeInntekter: Array<{
                      __typename: 'PensjonsgivendeInntekt';
                      arligBelop: string;
                      inntektsar: number;
                  }>;
                  annulleringskandidater: Array<{
                      __typename: 'Annulleringskandidat';
                      fom: string;
                      organisasjonsnummer: string;
                      tom: string;
                      vedtaksperiodeId: string;
                  }>;
                  tidslinje: Array<{
                      __typename: 'Dag';
                      dato: string;
                      grad: number | null;
                      sykdomsdagtype: Sykdomsdagtype;
                      utbetalingsdagtype: Utbetalingsdagtype;
                      begrunnelser: Array<Begrunnelse> | null;
                      kilde: { __typename: 'Kilde'; id: string; type: Kildetype };
                      utbetalingsinfo: {
                          __typename: 'Utbetalingsinfo';
                          arbeidsgiverbelop: number | null;
                          inntekt: number | null;
                          personbelop: number | null;
                          refusjonsbelop: number | null;
                          totalGrad: number | null;
                          utbetaling: number | null;
                      } | null;
                  }>;
                  varsler: Array<{
                      __typename: 'VarselDTO';
                      generasjonId: string;
                      definisjonId: string;
                      opprettet: string;
                      kode: string;
                      tittel: string;
                      forklaring: string | null;
                      handling: string | null;
                      vurdering: {
                          __typename: 'VarselvurderingDTO';
                          ident: string;
                          status: Varselstatus;
                          tidsstempel: string;
                      } | null;
                  }>;
                  hendelser: Array<
                      | {
                            __typename: 'InntektHentetFraAOrdningen';
                            mottattDato: string;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'Inntektsmelding';
                            beregnetInntekt: number;
                            mottattDato: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadArbeidsgiver';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtArbeidsgiver: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadArbeidsledig';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadFrilans';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadNav';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadSelvstendig';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'Sykmelding';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            id: string;
                            type: Hendelsetype;
                        }
                  >;
              }
            | {
                  __typename: 'UberegnetPeriode';
                  id: string;
                  behandlingId: string;
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
                      __typename: 'Notat';
                      id: number;
                      dialogRef: number;
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
                          __typename: 'Kommentar';
                          id: number;
                          tekst: string;
                          opprettet: string;
                          saksbehandlerident: string;
                          feilregistrert_tidspunkt: string | null;
                      }>;
                  }>;
                  tidslinje: Array<{
                      __typename: 'Dag';
                      dato: string;
                      grad: number | null;
                      sykdomsdagtype: Sykdomsdagtype;
                      utbetalingsdagtype: Utbetalingsdagtype;
                      begrunnelser: Array<Begrunnelse> | null;
                      kilde: { __typename: 'Kilde'; id: string; type: Kildetype };
                      utbetalingsinfo: {
                          __typename: 'Utbetalingsinfo';
                          arbeidsgiverbelop: number | null;
                          inntekt: number | null;
                          personbelop: number | null;
                          refusjonsbelop: number | null;
                          totalGrad: number | null;
                          utbetaling: number | null;
                      } | null;
                  }>;
                  varsler: Array<{
                      __typename: 'VarselDTO';
                      generasjonId: string;
                      definisjonId: string;
                      opprettet: string;
                      kode: string;
                      tittel: string;
                      forklaring: string | null;
                      handling: string | null;
                      vurdering: {
                          __typename: 'VarselvurderingDTO';
                          ident: string;
                          status: Varselstatus;
                          tidsstempel: string;
                      } | null;
                  }>;
                  hendelser: Array<
                      | {
                            __typename: 'InntektHentetFraAOrdningen';
                            mottattDato: string;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'Inntektsmelding';
                            beregnetInntekt: number;
                            mottattDato: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadArbeidsgiver';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtArbeidsgiver: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadArbeidsledig';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadFrilans';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadNav';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'SoknadSelvstendig';
                            fom: string;
                            tom: string;
                            rapportertDato: string;
                            sendtNav: string;
                            eksternDokumentId: string | null;
                            id: string;
                            type: Hendelsetype;
                        }
                      | {
                            __typename: 'Sykmelding';
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
              vedtaksperiodeId: string;
              saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
          }
        | {
              __typename: 'Dagoverstyring';
              begrunnelse: string;
              hendelseId: string;
              timestamp: string;
              ferdigstilt: boolean;
              vedtaksperiodeId: string;
              dager: Array<{
                  __typename: 'OverstyrtDag';
                  grad: number | null;
                  fraGrad: number | null;
                  dato: string;
                  type: Dagtype;
                  fraType: Dagtype | null;
              }>;
              saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
          }
        | {
              __typename: 'Inntektoverstyring';
              hendelseId: string;
              timestamp: string;
              ferdigstilt: boolean;
              vedtaksperiodeId: string;
              inntekt: {
                  __typename: 'OverstyrtInntekt';
                  skjaeringstidspunkt: string;
                  forklaring: string;
                  begrunnelse: string;
                  manedligInntekt: number;
                  fraManedligInntekt: number | null;
                  refusjonsopplysninger: Array<{
                      __typename: 'Refusjonsopplysning';
                      fom: string;
                      tom: string | null;
                      belop: number;
                  }> | null;
                  fraRefusjonsopplysninger: Array<{
                      __typename: 'Refusjonsopplysning';
                      fom: string;
                      tom: string | null;
                      belop: number;
                  }> | null;
              };
              saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
          }
        | {
              __typename: 'MinimumSykdomsgradOverstyring';
              hendelseId: string;
              timestamp: string;
              ferdigstilt: boolean;
              vedtaksperiodeId: string;
              minimumSykdomsgrad: {
                  __typename: 'OverstyrtMinimumSykdomsgrad';
                  begrunnelse: string;
                  initierendeVedtaksperiodeId: string;
                  perioderVurdertOk: Array<{
                      __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                      fom: string;
                      tom: string;
                  }>;
                  perioderVurdertIkkeOk: Array<{
                      __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                      fom: string;
                      tom: string;
                  }>;
              };
              saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
          }
        | {
              __typename: 'Sykepengegrunnlagskjonnsfastsetting';
              hendelseId: string;
              timestamp: string;
              ferdigstilt: boolean;
              vedtaksperiodeId: string;
              skjonnsfastsatt: {
                  __typename: 'SkjonnsfastsattSykepengegrunnlag';
                  arsak: string;
                  type: Skjonnsfastsettingstype | null;
                  begrunnelse: string | null;
                  begrunnelseMal: string | null;
                  begrunnelseFritekst: string | null;
                  begrunnelseKonklusjon: string | null;
                  arlig: number;
                  fraArlig: number | null;
                  skjaeringstidspunkt: string;
              };
              saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
          }
    >;
    inntekterFraAordningen: Array<{
        __typename: 'ArbeidsgiverInntekterFraAOrdningen';
        skjaeringstidspunkt: string;
        inntekter: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
    }>;
};

export type VilkarsgrunnlagV2_VilkarsgrunnlagInfotrygdV2_Fragment = {
    __typename: 'VilkarsgrunnlagInfotrygdV2';
    omregnetArsinntekt: number;
    id: string;
    sykepengegrunnlag: number;
    skjaeringstidspunkt: string;
    inntekter: Array<{
        __typename: 'Arbeidsgiverinntekt';
        arbeidsgiver: string;
        deaktivert: boolean | null;
        fom: string | null;
        tom: string | null;
        sammenligningsgrunnlag: {
            __typename: 'Sammenligningsgrunnlag';
            belop: number;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
        } | null;
        omregnetArsinntekt: {
            __typename: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Inntektskilde;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
        skjonnsmessigFastsatt: {
            __typename: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Inntektskilde;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
    }>;
    arbeidsgiverrefusjoner: Array<{
        __typename: 'Arbeidsgiverrefusjon';
        arbeidsgiver: string;
        refusjonsopplysninger: Array<{
            __typename: 'Refusjonselement';
            fom: string;
            tom: string | null;
            belop: number;
            meldingsreferanseId: string;
        }>;
    }>;
};

export type VilkarsgrunnlagV2_VilkarsgrunnlagSpleisV2_Fragment = {
    __typename: 'VilkarsgrunnlagSpleisV2';
    skjonnsmessigFastsattAarlig: number | null;
    vurderingAvKravOmMedlemskap: VilkarsgrunnlagVurdering;
    oppfyllerKravOmMinstelonn: boolean;
    oppfyllerKravOmOpptjening: boolean;
    antallOpptjeningsdagerErMinst: number;
    grunnbelop: number;
    opptjeningFra: string;
    beregningsgrunnlag: string;
    id: string;
    sykepengegrunnlag: number;
    skjaeringstidspunkt: string;
    sykepengegrunnlagsgrense: {
        __typename: 'Sykepengegrunnlagsgrense';
        grunnbelop: number;
        grense: number;
        virkningstidspunkt: string;
    };
    avviksvurdering: {
        __typename: 'VilkarsgrunnlagAvviksvurdering';
        avviksprosent: string;
        beregningsgrunnlag: string;
        sammenligningsgrunnlag: string;
    } | null;
    inntekter: Array<{
        __typename: 'Arbeidsgiverinntekt';
        arbeidsgiver: string;
        deaktivert: boolean | null;
        fom: string | null;
        tom: string | null;
        sammenligningsgrunnlag: {
            __typename: 'Sammenligningsgrunnlag';
            belop: number;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
        } | null;
        omregnetArsinntekt: {
            __typename: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Inntektskilde;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
        skjonnsmessigFastsatt: {
            __typename: 'OmregnetArsinntekt';
            belop: number;
            manedsbelop: number;
            kilde: Inntektskilde;
            inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }> | null;
        } | null;
    }>;
    arbeidsgiverrefusjoner: Array<{
        __typename: 'Arbeidsgiverrefusjon';
        arbeidsgiver: string;
        refusjonsopplysninger: Array<{
            __typename: 'Refusjonselement';
            fom: string;
            tom: string | null;
            belop: number;
            meldingsreferanseId: string;
        }>;
    }>;
};

export type VilkarsgrunnlagV2Fragment =
    | VilkarsgrunnlagV2_VilkarsgrunnlagInfotrygdV2_Fragment
    | VilkarsgrunnlagV2_VilkarsgrunnlagSpleisV2_Fragment;

export type NotatFragment = {
    __typename: 'Notat';
    id: number;
    dialogRef: number;
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
        __typename: 'Kommentar';
        id: number;
        tekst: string;
        opprettet: string;
        saksbehandlerident: string;
        feilregistrert_tidspunkt: string | null;
    }>;
};

export type KommentarFragment = {
    __typename: 'Kommentar';
    id: number;
    tekst: string;
    opprettet: string;
    saksbehandlerident: string;
    feilregistrert_tidspunkt: string | null;
};

export type GhostPeriodeFragment = {
    __typename: 'GhostPeriode';
    id: string;
    deaktivert: boolean;
    vilkarsgrunnlagId: string | null;
    skjaeringstidspunkt: string;
    fom: string;
    tom: string;
    organisasjonsnummer: string;
};

export type UberegnetPeriodeFragment = {
    __typename: 'UberegnetPeriode';
    id: string;
    behandlingId: string;
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
        __typename: 'Notat';
        id: number;
        dialogRef: number;
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
            __typename: 'Kommentar';
            id: number;
            tekst: string;
            opprettet: string;
            saksbehandlerident: string;
            feilregistrert_tidspunkt: string | null;
        }>;
    }>;
    tidslinje: Array<{
        __typename: 'Dag';
        dato: string;
        grad: number | null;
        sykdomsdagtype: Sykdomsdagtype;
        utbetalingsdagtype: Utbetalingsdagtype;
        begrunnelser: Array<Begrunnelse> | null;
        kilde: { __typename: 'Kilde'; id: string; type: Kildetype };
        utbetalingsinfo: {
            __typename: 'Utbetalingsinfo';
            arbeidsgiverbelop: number | null;
            inntekt: number | null;
            personbelop: number | null;
            refusjonsbelop: number | null;
            totalGrad: number | null;
            utbetaling: number | null;
        } | null;
    }>;
    varsler: Array<{
        __typename: 'VarselDTO';
        generasjonId: string;
        definisjonId: string;
        opprettet: string;
        kode: string;
        tittel: string;
        forklaring: string | null;
        handling: string | null;
        vurdering: {
            __typename: 'VarselvurderingDTO';
            ident: string;
            status: Varselstatus;
            tidsstempel: string;
        } | null;
    }>;
    hendelser: Array<
        | { __typename: 'InntektHentetFraAOrdningen'; mottattDato: string; id: string; type: Hendelsetype }
        | {
              __typename: 'Inntektsmelding';
              beregnetInntekt: number;
              mottattDato: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsgiver';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtArbeidsgiver: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsledig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadFrilans';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadNav';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadSelvstendig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | { __typename: 'Sykmelding'; fom: string; tom: string; rapportertDato: string; id: string; type: Hendelsetype }
    >;
};

export type BeregnetPeriodeFragment = {
    __typename: 'BeregnetPeriode';
    id: string;
    beregningId: string;
    forbrukteSykedager: number | null;
    gjenstaendeSykedager: number | null;
    vedtaksperiodeId: string;
    maksdato: string;
    vilkarsgrunnlagId: string | null;
    behandlingId: string;
    fom: string;
    tom: string;
    erForkastet: boolean;
    inntektstype: Inntektstype;
    opprettet: string;
    periodetype: Periodetype;
    periodetilstand: Periodetilstand;
    skjaeringstidspunkt: string;
    handlinger: Array<{ __typename: 'Handling'; type: Periodehandling; tillatt: boolean; begrunnelse: string | null }>;
    notater: Array<{
        __typename: 'Notat';
        id: number;
        dialogRef: number;
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
            __typename: 'Kommentar';
            id: number;
            tekst: string;
            opprettet: string;
            saksbehandlerident: string;
            feilregistrert_tidspunkt: string | null;
        }>;
    }>;
    historikkinnslag: Array<
        | {
              __typename: 'EndrePaVent';
              frist: string | null;
              arsaker: Array<string>;
              notattekst: string | null;
              id: number;
              type: PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'FjernetFraPaVent';
              id: number;
              type: PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
          }
        | {
              __typename: 'LagtPaVent';
              frist: string | null;
              arsaker: Array<string>;
              notattekst: string | null;
              id: number;
              type: PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
              notattekst: string | null;
              id: number;
              type: PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'PeriodeHistorikkElementNy';
              id: number;
              type: PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
          }
        | {
              __typename: 'StansAutomatiskBehandlingSaksbehandler';
              notattekst: string | null;
              id: number;
              type: PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
        | {
              __typename: 'TotrinnsvurderingRetur';
              notattekst: string | null;
              id: number;
              type: PeriodehistorikkType;
              timestamp: string;
              saksbehandlerIdent: string | null;
              dialogRef: number | null;
              kommentarer: Array<{
                  __typename: 'Kommentar';
                  id: number;
                  tekst: string;
                  opprettet: string;
                  saksbehandlerident: string;
                  feilregistrert_tidspunkt: string | null;
              }>;
          }
    >;
    periodevilkar: {
        __typename: 'Periodevilkar';
        alder: { __typename: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
        sykepengedager: {
            __typename: 'Sykepengedager';
            forbrukteSykedager: number | null;
            gjenstaendeSykedager: number | null;
            maksdato: string;
            oppfylt: boolean;
            skjaeringstidspunkt: string;
        };
    };
    risikovurdering: {
        __typename: 'Risikovurdering';
        funn: Array<{ __typename: 'Faresignal'; beskrivelse: string; kategori: Array<string> }> | null;
        kontrollertOk: Array<{ __typename: 'Faresignal'; beskrivelse: string; kategori: Array<string> }>;
    } | null;
    utbetaling: {
        __typename: 'Utbetaling';
        id: string;
        arbeidsgiverFagsystemId: string;
        arbeidsgiverNettoBelop: number;
        personFagsystemId: string;
        personNettoBelop: number;
        status: Utbetalingstatus;
        type: Utbetalingtype;
        vurdering: {
            __typename: 'Vurdering';
            automatisk: boolean;
            godkjent: boolean;
            ident: string;
            tidsstempel: string;
        } | null;
        arbeidsgiversimulering: {
            __typename: 'Simulering';
            fagsystemId: string;
            totalbelop: number | null;
            tidsstempel: string;
            utbetalingslinjer: Array<{
                __typename: 'Simuleringslinje';
                fom: string;
                tom: string;
                dagsats: number;
                grad: number;
            }>;
            perioder: Array<{
                __typename: 'Simuleringsperiode';
                fom: string;
                tom: string;
                utbetalinger: Array<{
                    __typename: 'Simuleringsutbetaling';
                    mottakerId: string;
                    mottakerNavn: string;
                    forfall: string;
                    feilkonto: boolean;
                    detaljer: Array<{
                        __typename: 'Simuleringsdetaljer';
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
        personsimulering: {
            __typename: 'Simulering';
            fagsystemId: string;
            totalbelop: number | null;
            tidsstempel: string;
            utbetalingslinjer: Array<{
                __typename: 'Simuleringslinje';
                fom: string;
                tom: string;
                dagsats: number;
                grad: number;
            }>;
            perioder: Array<{
                __typename: 'Simuleringsperiode';
                fom: string;
                tom: string;
                utbetalinger: Array<{
                    __typename: 'Simuleringsutbetaling';
                    mottakerId: string;
                    mottakerNavn: string;
                    forfall: string;
                    feilkonto: boolean;
                    detaljer: Array<{
                        __typename: 'Simuleringsdetaljer';
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
    oppgave: { __typename: 'OppgaveForPeriodevisning'; id: string } | null;
    paVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
    totrinnsvurdering: {
        __typename: 'Totrinnsvurdering';
        erBeslutteroppgave: boolean;
        erRetur: boolean;
        saksbehandler: string | null;
        beslutter: string | null;
    } | null;
    egenskaper: Array<{ __typename: 'Oppgaveegenskap'; egenskap: Egenskap; kategori: Kategori }>;
    avslag: Array<{
        __typename: 'Avslag';
        type: Avslagstype;
        begrunnelse: string;
        opprettet: string;
        saksbehandlerIdent: string;
        invalidert: boolean;
    }>;
    vedtakBegrunnelser: Array<{
        __typename: 'VedtakBegrunnelse';
        utfall: VedtakUtfall;
        begrunnelse: string | null;
        opprettet: string;
        saksbehandlerIdent: string;
    }>;
    annullering: {
        __typename: 'Annullering';
        saksbehandlerIdent: string;
        arbeidsgiverFagsystemId: string | null;
        personFagsystemId: string | null;
        tidspunkt: string;
        arsaker: Array<string>;
        begrunnelse: string | null;
    } | null;
    pensjonsgivendeInntekter: Array<{ __typename: 'PensjonsgivendeInntekt'; arligBelop: string; inntektsar: number }>;
    annulleringskandidater: Array<{
        __typename: 'Annulleringskandidat';
        fom: string;
        organisasjonsnummer: string;
        tom: string;
        vedtaksperiodeId: string;
    }>;
    tidslinje: Array<{
        __typename: 'Dag';
        dato: string;
        grad: number | null;
        sykdomsdagtype: Sykdomsdagtype;
        utbetalingsdagtype: Utbetalingsdagtype;
        begrunnelser: Array<Begrunnelse> | null;
        kilde: { __typename: 'Kilde'; id: string; type: Kildetype };
        utbetalingsinfo: {
            __typename: 'Utbetalingsinfo';
            arbeidsgiverbelop: number | null;
            inntekt: number | null;
            personbelop: number | null;
            refusjonsbelop: number | null;
            totalGrad: number | null;
            utbetaling: number | null;
        } | null;
    }>;
    varsler: Array<{
        __typename: 'VarselDTO';
        generasjonId: string;
        definisjonId: string;
        opprettet: string;
        kode: string;
        tittel: string;
        forklaring: string | null;
        handling: string | null;
        vurdering: {
            __typename: 'VarselvurderingDTO';
            ident: string;
            status: Varselstatus;
            tidsstempel: string;
        } | null;
    }>;
    hendelser: Array<
        | { __typename: 'InntektHentetFraAOrdningen'; mottattDato: string; id: string; type: Hendelsetype }
        | {
              __typename: 'Inntektsmelding';
              beregnetInntekt: number;
              mottattDato: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsgiver';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtArbeidsgiver: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsledig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadFrilans';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadNav';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadSelvstendig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | { __typename: 'Sykmelding'; fom: string; tom: string; rapportertDato: string; id: string; type: Hendelsetype }
    >;
};

export type Periode_BeregnetPeriode_Fragment = {
    __typename: 'BeregnetPeriode';
    behandlingId: string;
    fom: string;
    tom: string;
    erForkastet: boolean;
    inntektstype: Inntektstype;
    opprettet: string;
    periodetype: Periodetype;
    vedtaksperiodeId: string;
    periodetilstand: Periodetilstand;
    skjaeringstidspunkt: string;
    tidslinje: Array<{
        __typename: 'Dag';
        dato: string;
        grad: number | null;
        sykdomsdagtype: Sykdomsdagtype;
        utbetalingsdagtype: Utbetalingsdagtype;
        begrunnelser: Array<Begrunnelse> | null;
        kilde: { __typename: 'Kilde'; id: string; type: Kildetype };
        utbetalingsinfo: {
            __typename: 'Utbetalingsinfo';
            arbeidsgiverbelop: number | null;
            inntekt: number | null;
            personbelop: number | null;
            refusjonsbelop: number | null;
            totalGrad: number | null;
            utbetaling: number | null;
        } | null;
    }>;
    varsler: Array<{
        __typename: 'VarselDTO';
        generasjonId: string;
        definisjonId: string;
        opprettet: string;
        kode: string;
        tittel: string;
        forklaring: string | null;
        handling: string | null;
        vurdering: {
            __typename: 'VarselvurderingDTO';
            ident: string;
            status: Varselstatus;
            tidsstempel: string;
        } | null;
    }>;
    hendelser: Array<
        | { __typename: 'InntektHentetFraAOrdningen'; mottattDato: string; id: string; type: Hendelsetype }
        | {
              __typename: 'Inntektsmelding';
              beregnetInntekt: number;
              mottattDato: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsgiver';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtArbeidsgiver: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsledig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadFrilans';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadNav';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadSelvstendig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | { __typename: 'Sykmelding'; fom: string; tom: string; rapportertDato: string; id: string; type: Hendelsetype }
    >;
};

export type Periode_UberegnetPeriode_Fragment = {
    __typename: 'UberegnetPeriode';
    behandlingId: string;
    fom: string;
    tom: string;
    erForkastet: boolean;
    inntektstype: Inntektstype;
    opprettet: string;
    periodetype: Periodetype;
    vedtaksperiodeId: string;
    periodetilstand: Periodetilstand;
    skjaeringstidspunkt: string;
    tidslinje: Array<{
        __typename: 'Dag';
        dato: string;
        grad: number | null;
        sykdomsdagtype: Sykdomsdagtype;
        utbetalingsdagtype: Utbetalingsdagtype;
        begrunnelser: Array<Begrunnelse> | null;
        kilde: { __typename: 'Kilde'; id: string; type: Kildetype };
        utbetalingsinfo: {
            __typename: 'Utbetalingsinfo';
            arbeidsgiverbelop: number | null;
            inntekt: number | null;
            personbelop: number | null;
            refusjonsbelop: number | null;
            totalGrad: number | null;
            utbetaling: number | null;
        } | null;
    }>;
    varsler: Array<{
        __typename: 'VarselDTO';
        generasjonId: string;
        definisjonId: string;
        opprettet: string;
        kode: string;
        tittel: string;
        forklaring: string | null;
        handling: string | null;
        vurdering: {
            __typename: 'VarselvurderingDTO';
            ident: string;
            status: Varselstatus;
            tidsstempel: string;
        } | null;
    }>;
    hendelser: Array<
        | { __typename: 'InntektHentetFraAOrdningen'; mottattDato: string; id: string; type: Hendelsetype }
        | {
              __typename: 'Inntektsmelding';
              beregnetInntekt: number;
              mottattDato: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsgiver';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtArbeidsgiver: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadArbeidsledig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadFrilans';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadNav';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | {
              __typename: 'SoknadSelvstendig';
              fom: string;
              tom: string;
              rapportertDato: string;
              sendtNav: string;
              eksternDokumentId: string | null;
              id: string;
              type: Hendelsetype;
          }
        | { __typename: 'Sykmelding'; fom: string; tom: string; rapportertDato: string; id: string; type: Hendelsetype }
    >;
};

export type PeriodeFragment = Periode_BeregnetPeriode_Fragment | Periode_UberegnetPeriode_Fragment;

export type PersonFragment = {
    __typename: 'Person';
    fodselsnummer: string;
    dodsdato: string | null;
    versjon: number;
    aktorId: string;
    enhet: { __typename: 'Enhet'; id: string; navn: string };
    infotrygdutbetalinger: Array<{
        __typename: 'Infotrygdutbetaling';
        organisasjonsnummer: string;
        dagsats: number;
        fom: string;
        tom: string;
        grad: string;
        typetekst: string;
    }> | null;
    personinfo: {
        __typename: 'Personinfo';
        fornavn: string;
        mellomnavn: string | null;
        etternavn: string;
        adressebeskyttelse: Adressebeskyttelse;
        fodselsdato: string;
        kjonn: Kjonn;
        fullmakt: boolean | null;
        automatiskBehandlingStansetAvSaksbehandler: boolean | null;
        reservasjon: { __typename: 'Reservasjon'; kanVarsles: boolean; reservert: boolean } | null;
        unntattFraAutomatisering: {
            __typename: 'UnntattFraAutomatiskGodkjenning';
            erUnntatt: boolean;
            arsaker: Array<string>;
            tidspunkt: string | null;
        } | null;
    };
    tildeling: { __typename: 'Tildeling'; navn: string; epost: string; oid: string } | null;
    vilkarsgrunnlagV2: Array<
        | {
              __typename: 'VilkarsgrunnlagInfotrygdV2';
              omregnetArsinntekt: number;
              id: string;
              sykepengegrunnlag: number;
              skjaeringstidspunkt: string;
              inntekter: Array<{
                  __typename: 'Arbeidsgiverinntekt';
                  arbeidsgiver: string;
                  deaktivert: boolean | null;
                  fom: string | null;
                  tom: string | null;
                  sammenligningsgrunnlag: {
                      __typename: 'Sammenligningsgrunnlag';
                      belop: number;
                      inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
                  } | null;
                  omregnetArsinntekt: {
                      __typename: 'OmregnetArsinntekt';
                      belop: number;
                      manedsbelop: number;
                      kilde: Inntektskilde;
                      inntektFraAOrdningen: Array<{
                          __typename: 'InntektFraAOrdningen';
                          maned: string;
                          sum: number;
                      }> | null;
                  } | null;
                  skjonnsmessigFastsatt: {
                      __typename: 'OmregnetArsinntekt';
                      belop: number;
                      manedsbelop: number;
                      kilde: Inntektskilde;
                      inntektFraAOrdningen: Array<{
                          __typename: 'InntektFraAOrdningen';
                          maned: string;
                          sum: number;
                      }> | null;
                  } | null;
              }>;
              arbeidsgiverrefusjoner: Array<{
                  __typename: 'Arbeidsgiverrefusjon';
                  arbeidsgiver: string;
                  refusjonsopplysninger: Array<{
                      __typename: 'Refusjonselement';
                      fom: string;
                      tom: string | null;
                      belop: number;
                      meldingsreferanseId: string;
                  }>;
              }>;
          }
        | {
              __typename: 'VilkarsgrunnlagSpleisV2';
              skjonnsmessigFastsattAarlig: number | null;
              vurderingAvKravOmMedlemskap: VilkarsgrunnlagVurdering;
              oppfyllerKravOmMinstelonn: boolean;
              oppfyllerKravOmOpptjening: boolean;
              antallOpptjeningsdagerErMinst: number;
              grunnbelop: number;
              opptjeningFra: string;
              beregningsgrunnlag: string;
              id: string;
              sykepengegrunnlag: number;
              skjaeringstidspunkt: string;
              sykepengegrunnlagsgrense: {
                  __typename: 'Sykepengegrunnlagsgrense';
                  grunnbelop: number;
                  grense: number;
                  virkningstidspunkt: string;
              };
              avviksvurdering: {
                  __typename: 'VilkarsgrunnlagAvviksvurdering';
                  avviksprosent: string;
                  beregningsgrunnlag: string;
                  sammenligningsgrunnlag: string;
              } | null;
              inntekter: Array<{
                  __typename: 'Arbeidsgiverinntekt';
                  arbeidsgiver: string;
                  deaktivert: boolean | null;
                  fom: string | null;
                  tom: string | null;
                  sammenligningsgrunnlag: {
                      __typename: 'Sammenligningsgrunnlag';
                      belop: number;
                      inntektFraAOrdningen: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
                  } | null;
                  omregnetArsinntekt: {
                      __typename: 'OmregnetArsinntekt';
                      belop: number;
                      manedsbelop: number;
                      kilde: Inntektskilde;
                      inntektFraAOrdningen: Array<{
                          __typename: 'InntektFraAOrdningen';
                          maned: string;
                          sum: number;
                      }> | null;
                  } | null;
                  skjonnsmessigFastsatt: {
                      __typename: 'OmregnetArsinntekt';
                      belop: number;
                      manedsbelop: number;
                      kilde: Inntektskilde;
                      inntektFraAOrdningen: Array<{
                          __typename: 'InntektFraAOrdningen';
                          maned: string;
                          sum: number;
                      }> | null;
                  } | null;
              }>;
              arbeidsgiverrefusjoner: Array<{
                  __typename: 'Arbeidsgiverrefusjon';
                  arbeidsgiver: string;
                  refusjonsopplysninger: Array<{
                      __typename: 'Refusjonselement';
                      fom: string;
                      tom: string | null;
                      belop: number;
                      meldingsreferanseId: string;
                  }>;
              }>;
          }
    >;
    arbeidsgivere: Array<{
        __typename: 'Arbeidsgiver';
        navn: string;
        organisasjonsnummer: string;
        arbeidsforhold: Array<{
            __typename: 'Arbeidsforhold';
            sluttdato: string | null;
            startdato: string;
            stillingsprosent: number;
            stillingstittel: string;
        }>;
        ghostPerioder: Array<{
            __typename: 'GhostPeriode';
            id: string;
            deaktivert: boolean;
            vilkarsgrunnlagId: string | null;
            skjaeringstidspunkt: string;
            fom: string;
            tom: string;
            organisasjonsnummer: string;
        }>;
        generasjoner: Array<{
            __typename: 'Generasjon';
            id: string;
            perioder: Array<
                | {
                      __typename: 'BeregnetPeriode';
                      id: string;
                      beregningId: string;
                      forbrukteSykedager: number | null;
                      gjenstaendeSykedager: number | null;
                      vedtaksperiodeId: string;
                      maksdato: string;
                      vilkarsgrunnlagId: string | null;
                      behandlingId: string;
                      fom: string;
                      tom: string;
                      erForkastet: boolean;
                      inntektstype: Inntektstype;
                      opprettet: string;
                      periodetype: Periodetype;
                      periodetilstand: Periodetilstand;
                      skjaeringstidspunkt: string;
                      handlinger: Array<{
                          __typename: 'Handling';
                          type: Periodehandling;
                          tillatt: boolean;
                          begrunnelse: string | null;
                      }>;
                      notater: Array<{
                          __typename: 'Notat';
                          id: number;
                          dialogRef: number;
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
                              __typename: 'Kommentar';
                              id: number;
                              tekst: string;
                              opprettet: string;
                              saksbehandlerident: string;
                              feilregistrert_tidspunkt: string | null;
                          }>;
                      }>;
                      historikkinnslag: Array<
                          | {
                                __typename: 'EndrePaVent';
                                frist: string | null;
                                arsaker: Array<string>;
                                notattekst: string | null;
                                id: number;
                                type: PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'FjernetFraPaVent';
                                id: number;
                                type: PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                            }
                          | {
                                __typename: 'LagtPaVent';
                                frist: string | null;
                                arsaker: Array<string>;
                                notattekst: string | null;
                                id: number;
                                type: PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                                notattekst: string | null;
                                id: number;
                                type: PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'PeriodeHistorikkElementNy';
                                id: number;
                                type: PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                            }
                          | {
                                __typename: 'StansAutomatiskBehandlingSaksbehandler';
                                notattekst: string | null;
                                id: number;
                                type: PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                          | {
                                __typename: 'TotrinnsvurderingRetur';
                                notattekst: string | null;
                                id: number;
                                type: PeriodehistorikkType;
                                timestamp: string;
                                saksbehandlerIdent: string | null;
                                dialogRef: number | null;
                                kommentarer: Array<{
                                    __typename: 'Kommentar';
                                    id: number;
                                    tekst: string;
                                    opprettet: string;
                                    saksbehandlerident: string;
                                    feilregistrert_tidspunkt: string | null;
                                }>;
                            }
                      >;
                      periodevilkar: {
                          __typename: 'Periodevilkar';
                          alder: { __typename: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
                          sykepengedager: {
                              __typename: 'Sykepengedager';
                              forbrukteSykedager: number | null;
                              gjenstaendeSykedager: number | null;
                              maksdato: string;
                              oppfylt: boolean;
                              skjaeringstidspunkt: string;
                          };
                      };
                      risikovurdering: {
                          __typename: 'Risikovurdering';
                          funn: Array<{
                              __typename: 'Faresignal';
                              beskrivelse: string;
                              kategori: Array<string>;
                          }> | null;
                          kontrollertOk: Array<{
                              __typename: 'Faresignal';
                              beskrivelse: string;
                              kategori: Array<string>;
                          }>;
                      } | null;
                      utbetaling: {
                          __typename: 'Utbetaling';
                          id: string;
                          arbeidsgiverFagsystemId: string;
                          arbeidsgiverNettoBelop: number;
                          personFagsystemId: string;
                          personNettoBelop: number;
                          status: Utbetalingstatus;
                          type: Utbetalingtype;
                          vurdering: {
                              __typename: 'Vurdering';
                              automatisk: boolean;
                              godkjent: boolean;
                              ident: string;
                              tidsstempel: string;
                          } | null;
                          arbeidsgiversimulering: {
                              __typename: 'Simulering';
                              fagsystemId: string;
                              totalbelop: number | null;
                              tidsstempel: string;
                              utbetalingslinjer: Array<{
                                  __typename: 'Simuleringslinje';
                                  fom: string;
                                  tom: string;
                                  dagsats: number;
                                  grad: number;
                              }>;
                              perioder: Array<{
                                  __typename: 'Simuleringsperiode';
                                  fom: string;
                                  tom: string;
                                  utbetalinger: Array<{
                                      __typename: 'Simuleringsutbetaling';
                                      mottakerId: string;
                                      mottakerNavn: string;
                                      forfall: string;
                                      feilkonto: boolean;
                                      detaljer: Array<{
                                          __typename: 'Simuleringsdetaljer';
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
                          personsimulering: {
                              __typename: 'Simulering';
                              fagsystemId: string;
                              totalbelop: number | null;
                              tidsstempel: string;
                              utbetalingslinjer: Array<{
                                  __typename: 'Simuleringslinje';
                                  fom: string;
                                  tom: string;
                                  dagsats: number;
                                  grad: number;
                              }>;
                              perioder: Array<{
                                  __typename: 'Simuleringsperiode';
                                  fom: string;
                                  tom: string;
                                  utbetalinger: Array<{
                                      __typename: 'Simuleringsutbetaling';
                                      mottakerId: string;
                                      mottakerNavn: string;
                                      forfall: string;
                                      feilkonto: boolean;
                                      detaljer: Array<{
                                          __typename: 'Simuleringsdetaljer';
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
                      oppgave: { __typename: 'OppgaveForPeriodevisning'; id: string } | null;
                      paVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
                      totrinnsvurdering: {
                          __typename: 'Totrinnsvurdering';
                          erBeslutteroppgave: boolean;
                          erRetur: boolean;
                          saksbehandler: string | null;
                          beslutter: string | null;
                      } | null;
                      egenskaper: Array<{ __typename: 'Oppgaveegenskap'; egenskap: Egenskap; kategori: Kategori }>;
                      avslag: Array<{
                          __typename: 'Avslag';
                          type: Avslagstype;
                          begrunnelse: string;
                          opprettet: string;
                          saksbehandlerIdent: string;
                          invalidert: boolean;
                      }>;
                      vedtakBegrunnelser: Array<{
                          __typename: 'VedtakBegrunnelse';
                          utfall: VedtakUtfall;
                          begrunnelse: string | null;
                          opprettet: string;
                          saksbehandlerIdent: string;
                      }>;
                      annullering: {
                          __typename: 'Annullering';
                          saksbehandlerIdent: string;
                          arbeidsgiverFagsystemId: string | null;
                          personFagsystemId: string | null;
                          tidspunkt: string;
                          arsaker: Array<string>;
                          begrunnelse: string | null;
                      } | null;
                      pensjonsgivendeInntekter: Array<{
                          __typename: 'PensjonsgivendeInntekt';
                          arligBelop: string;
                          inntektsar: number;
                      }>;
                      annulleringskandidater: Array<{
                          __typename: 'Annulleringskandidat';
                          fom: string;
                          organisasjonsnummer: string;
                          tom: string;
                          vedtaksperiodeId: string;
                      }>;
                      tidslinje: Array<{
                          __typename: 'Dag';
                          dato: string;
                          grad: number | null;
                          sykdomsdagtype: Sykdomsdagtype;
                          utbetalingsdagtype: Utbetalingsdagtype;
                          begrunnelser: Array<Begrunnelse> | null;
                          kilde: { __typename: 'Kilde'; id: string; type: Kildetype };
                          utbetalingsinfo: {
                              __typename: 'Utbetalingsinfo';
                              arbeidsgiverbelop: number | null;
                              inntekt: number | null;
                              personbelop: number | null;
                              refusjonsbelop: number | null;
                              totalGrad: number | null;
                              utbetaling: number | null;
                          } | null;
                      }>;
                      varsler: Array<{
                          __typename: 'VarselDTO';
                          generasjonId: string;
                          definisjonId: string;
                          opprettet: string;
                          kode: string;
                          tittel: string;
                          forklaring: string | null;
                          handling: string | null;
                          vurdering: {
                              __typename: 'VarselvurderingDTO';
                              ident: string;
                              status: Varselstatus;
                              tidsstempel: string;
                          } | null;
                      }>;
                      hendelser: Array<
                          | {
                                __typename: 'InntektHentetFraAOrdningen';
                                mottattDato: string;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'Inntektsmelding';
                                beregnetInntekt: number;
                                mottattDato: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsgiver';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtArbeidsgiver: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsledig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadFrilans';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadNav';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadSelvstendig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'Sykmelding';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                id: string;
                                type: Hendelsetype;
                            }
                      >;
                  }
                | {
                      __typename: 'UberegnetPeriode';
                      id: string;
                      behandlingId: string;
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
                          __typename: 'Notat';
                          id: number;
                          dialogRef: number;
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
                              __typename: 'Kommentar';
                              id: number;
                              tekst: string;
                              opprettet: string;
                              saksbehandlerident: string;
                              feilregistrert_tidspunkt: string | null;
                          }>;
                      }>;
                      tidslinje: Array<{
                          __typename: 'Dag';
                          dato: string;
                          grad: number | null;
                          sykdomsdagtype: Sykdomsdagtype;
                          utbetalingsdagtype: Utbetalingsdagtype;
                          begrunnelser: Array<Begrunnelse> | null;
                          kilde: { __typename: 'Kilde'; id: string; type: Kildetype };
                          utbetalingsinfo: {
                              __typename: 'Utbetalingsinfo';
                              arbeidsgiverbelop: number | null;
                              inntekt: number | null;
                              personbelop: number | null;
                              refusjonsbelop: number | null;
                              totalGrad: number | null;
                              utbetaling: number | null;
                          } | null;
                      }>;
                      varsler: Array<{
                          __typename: 'VarselDTO';
                          generasjonId: string;
                          definisjonId: string;
                          opprettet: string;
                          kode: string;
                          tittel: string;
                          forklaring: string | null;
                          handling: string | null;
                          vurdering: {
                              __typename: 'VarselvurderingDTO';
                              ident: string;
                              status: Varselstatus;
                              tidsstempel: string;
                          } | null;
                      }>;
                      hendelser: Array<
                          | {
                                __typename: 'InntektHentetFraAOrdningen';
                                mottattDato: string;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'Inntektsmelding';
                                beregnetInntekt: number;
                                mottattDato: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsgiver';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtArbeidsgiver: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadArbeidsledig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadFrilans';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadNav';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'SoknadSelvstendig';
                                fom: string;
                                tom: string;
                                rapportertDato: string;
                                sendtNav: string;
                                eksternDokumentId: string | null;
                                id: string;
                                type: Hendelsetype;
                            }
                          | {
                                __typename: 'Sykmelding';
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
                  vedtaksperiodeId: string;
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'Dagoverstyring';
                  begrunnelse: string;
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  dager: Array<{
                      __typename: 'OverstyrtDag';
                      grad: number | null;
                      fraGrad: number | null;
                      dato: string;
                      type: Dagtype;
                      fraType: Dagtype | null;
                  }>;
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'Inntektoverstyring';
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  inntekt: {
                      __typename: 'OverstyrtInntekt';
                      skjaeringstidspunkt: string;
                      forklaring: string;
                      begrunnelse: string;
                      manedligInntekt: number;
                      fraManedligInntekt: number | null;
                      refusjonsopplysninger: Array<{
                          __typename: 'Refusjonsopplysning';
                          fom: string;
                          tom: string | null;
                          belop: number;
                      }> | null;
                      fraRefusjonsopplysninger: Array<{
                          __typename: 'Refusjonsopplysning';
                          fom: string;
                          tom: string | null;
                          belop: number;
                      }> | null;
                  };
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'MinimumSykdomsgradOverstyring';
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  minimumSykdomsgrad: {
                      __typename: 'OverstyrtMinimumSykdomsgrad';
                      begrunnelse: string;
                      initierendeVedtaksperiodeId: string;
                      perioderVurdertOk: Array<{
                          __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                          fom: string;
                          tom: string;
                      }>;
                      perioderVurdertIkkeOk: Array<{
                          __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                          fom: string;
                          tom: string;
                      }>;
                  };
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
            | {
                  __typename: 'Sykepengegrunnlagskjonnsfastsetting';
                  hendelseId: string;
                  timestamp: string;
                  ferdigstilt: boolean;
                  vedtaksperiodeId: string;
                  skjonnsfastsatt: {
                      __typename: 'SkjonnsfastsattSykepengegrunnlag';
                      arsak: string;
                      type: Skjonnsfastsettingstype | null;
                      begrunnelse: string | null;
                      begrunnelseMal: string | null;
                      begrunnelseFritekst: string | null;
                      begrunnelseKonklusjon: string | null;
                      arlig: number;
                      fraArlig: number | null;
                      skjaeringstidspunkt: string;
                  };
                  saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
              }
        >;
        inntekterFraAordningen: Array<{
            __typename: 'ArbeidsgiverInntekterFraAOrdningen';
            skjaeringstidspunkt: string;
            inntekter: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
        }>;
    }>;
    tilleggsinfoForInntektskilder: Array<{
        __typename: 'TilleggsinfoForInntektskilde';
        orgnummer: string;
        navn: string;
    }>;
};

export type FetchPersonQueryVariables = Exact<{
    fnr?: InputMaybe<Scalars['String']['input']>;
    aktorId?: InputMaybe<Scalars['String']['input']>;
}>;

export type FetchPersonQuery = {
    __typename: 'Query';
    person: {
        __typename: 'Person';
        fodselsnummer: string;
        dodsdato: string | null;
        versjon: number;
        aktorId: string;
        enhet: { __typename: 'Enhet'; id: string; navn: string };
        infotrygdutbetalinger: Array<{
            __typename: 'Infotrygdutbetaling';
            organisasjonsnummer: string;
            dagsats: number;
            fom: string;
            tom: string;
            grad: string;
            typetekst: string;
        }> | null;
        personinfo: {
            __typename: 'Personinfo';
            fornavn: string;
            mellomnavn: string | null;
            etternavn: string;
            adressebeskyttelse: Adressebeskyttelse;
            fodselsdato: string;
            kjonn: Kjonn;
            fullmakt: boolean | null;
            automatiskBehandlingStansetAvSaksbehandler: boolean | null;
            reservasjon: { __typename: 'Reservasjon'; kanVarsles: boolean; reservert: boolean } | null;
            unntattFraAutomatisering: {
                __typename: 'UnntattFraAutomatiskGodkjenning';
                erUnntatt: boolean;
                arsaker: Array<string>;
                tidspunkt: string | null;
            } | null;
        };
        tildeling: { __typename: 'Tildeling'; navn: string; epost: string; oid: string } | null;
        vilkarsgrunnlagV2: Array<
            | {
                  __typename: 'VilkarsgrunnlagInfotrygdV2';
                  omregnetArsinntekt: number;
                  id: string;
                  sykepengegrunnlag: number;
                  skjaeringstidspunkt: string;
                  inntekter: Array<{
                      __typename: 'Arbeidsgiverinntekt';
                      arbeidsgiver: string;
                      deaktivert: boolean | null;
                      fom: string | null;
                      tom: string | null;
                      sammenligningsgrunnlag: {
                          __typename: 'Sammenligningsgrunnlag';
                          belop: number;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }>;
                      } | null;
                      omregnetArsinntekt: {
                          __typename: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Inntektskilde;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                      skjonnsmessigFastsatt: {
                          __typename: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Inntektskilde;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                  }>;
                  arbeidsgiverrefusjoner: Array<{
                      __typename: 'Arbeidsgiverrefusjon';
                      arbeidsgiver: string;
                      refusjonsopplysninger: Array<{
                          __typename: 'Refusjonselement';
                          fom: string;
                          tom: string | null;
                          belop: number;
                          meldingsreferanseId: string;
                      }>;
                  }>;
              }
            | {
                  __typename: 'VilkarsgrunnlagSpleisV2';
                  skjonnsmessigFastsattAarlig: number | null;
                  vurderingAvKravOmMedlemskap: VilkarsgrunnlagVurdering;
                  oppfyllerKravOmMinstelonn: boolean;
                  oppfyllerKravOmOpptjening: boolean;
                  antallOpptjeningsdagerErMinst: number;
                  grunnbelop: number;
                  opptjeningFra: string;
                  beregningsgrunnlag: string;
                  id: string;
                  sykepengegrunnlag: number;
                  skjaeringstidspunkt: string;
                  sykepengegrunnlagsgrense: {
                      __typename: 'Sykepengegrunnlagsgrense';
                      grunnbelop: number;
                      grense: number;
                      virkningstidspunkt: string;
                  };
                  avviksvurdering: {
                      __typename: 'VilkarsgrunnlagAvviksvurdering';
                      avviksprosent: string;
                      beregningsgrunnlag: string;
                      sammenligningsgrunnlag: string;
                  } | null;
                  inntekter: Array<{
                      __typename: 'Arbeidsgiverinntekt';
                      arbeidsgiver: string;
                      deaktivert: boolean | null;
                      fom: string | null;
                      tom: string | null;
                      sammenligningsgrunnlag: {
                          __typename: 'Sammenligningsgrunnlag';
                          belop: number;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }>;
                      } | null;
                      omregnetArsinntekt: {
                          __typename: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Inntektskilde;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                      skjonnsmessigFastsatt: {
                          __typename: 'OmregnetArsinntekt';
                          belop: number;
                          manedsbelop: number;
                          kilde: Inntektskilde;
                          inntektFraAOrdningen: Array<{
                              __typename: 'InntektFraAOrdningen';
                              maned: string;
                              sum: number;
                          }> | null;
                      } | null;
                  }>;
                  arbeidsgiverrefusjoner: Array<{
                      __typename: 'Arbeidsgiverrefusjon';
                      arbeidsgiver: string;
                      refusjonsopplysninger: Array<{
                          __typename: 'Refusjonselement';
                          fom: string;
                          tom: string | null;
                          belop: number;
                          meldingsreferanseId: string;
                      }>;
                  }>;
              }
        >;
        arbeidsgivere: Array<{
            __typename: 'Arbeidsgiver';
            navn: string;
            organisasjonsnummer: string;
            arbeidsforhold: Array<{
                __typename: 'Arbeidsforhold';
                sluttdato: string | null;
                startdato: string;
                stillingsprosent: number;
                stillingstittel: string;
            }>;
            ghostPerioder: Array<{
                __typename: 'GhostPeriode';
                id: string;
                deaktivert: boolean;
                vilkarsgrunnlagId: string | null;
                skjaeringstidspunkt: string;
                fom: string;
                tom: string;
                organisasjonsnummer: string;
            }>;
            generasjoner: Array<{
                __typename: 'Generasjon';
                id: string;
                perioder: Array<
                    | {
                          __typename: 'BeregnetPeriode';
                          id: string;
                          beregningId: string;
                          forbrukteSykedager: number | null;
                          gjenstaendeSykedager: number | null;
                          vedtaksperiodeId: string;
                          maksdato: string;
                          vilkarsgrunnlagId: string | null;
                          behandlingId: string;
                          fom: string;
                          tom: string;
                          erForkastet: boolean;
                          inntektstype: Inntektstype;
                          opprettet: string;
                          periodetype: Periodetype;
                          periodetilstand: Periodetilstand;
                          skjaeringstidspunkt: string;
                          handlinger: Array<{
                              __typename: 'Handling';
                              type: Periodehandling;
                              tillatt: boolean;
                              begrunnelse: string | null;
                          }>;
                          notater: Array<{
                              __typename: 'Notat';
                              id: number;
                              dialogRef: number;
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
                                  __typename: 'Kommentar';
                                  id: number;
                                  tekst: string;
                                  opprettet: string;
                                  saksbehandlerident: string;
                                  feilregistrert_tidspunkt: string | null;
                              }>;
                          }>;
                          historikkinnslag: Array<
                              | {
                                    __typename: 'EndrePaVent';
                                    frist: string | null;
                                    arsaker: Array<string>;
                                    notattekst: string | null;
                                    id: number;
                                    type: PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'FjernetFraPaVent';
                                    id: number;
                                    type: PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                }
                              | {
                                    __typename: 'LagtPaVent';
                                    frist: string | null;
                                    arsaker: Array<string>;
                                    notattekst: string | null;
                                    id: number;
                                    type: PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'OpphevStansAutomatiskBehandlingSaksbehandler';
                                    notattekst: string | null;
                                    id: number;
                                    type: PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'PeriodeHistorikkElementNy';
                                    id: number;
                                    type: PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                }
                              | {
                                    __typename: 'StansAutomatiskBehandlingSaksbehandler';
                                    notattekst: string | null;
                                    id: number;
                                    type: PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                              | {
                                    __typename: 'TotrinnsvurderingRetur';
                                    notattekst: string | null;
                                    id: number;
                                    type: PeriodehistorikkType;
                                    timestamp: string;
                                    saksbehandlerIdent: string | null;
                                    dialogRef: number | null;
                                    kommentarer: Array<{
                                        __typename: 'Kommentar';
                                        id: number;
                                        tekst: string;
                                        opprettet: string;
                                        saksbehandlerident: string;
                                        feilregistrert_tidspunkt: string | null;
                                    }>;
                                }
                          >;
                          periodevilkar: {
                              __typename: 'Periodevilkar';
                              alder: { __typename: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
                              sykepengedager: {
                                  __typename: 'Sykepengedager';
                                  forbrukteSykedager: number | null;
                                  gjenstaendeSykedager: number | null;
                                  maksdato: string;
                                  oppfylt: boolean;
                                  skjaeringstidspunkt: string;
                              };
                          };
                          risikovurdering: {
                              __typename: 'Risikovurdering';
                              funn: Array<{
                                  __typename: 'Faresignal';
                                  beskrivelse: string;
                                  kategori: Array<string>;
                              }> | null;
                              kontrollertOk: Array<{
                                  __typename: 'Faresignal';
                                  beskrivelse: string;
                                  kategori: Array<string>;
                              }>;
                          } | null;
                          utbetaling: {
                              __typename: 'Utbetaling';
                              id: string;
                              arbeidsgiverFagsystemId: string;
                              arbeidsgiverNettoBelop: number;
                              personFagsystemId: string;
                              personNettoBelop: number;
                              status: Utbetalingstatus;
                              type: Utbetalingtype;
                              vurdering: {
                                  __typename: 'Vurdering';
                                  automatisk: boolean;
                                  godkjent: boolean;
                                  ident: string;
                                  tidsstempel: string;
                              } | null;
                              arbeidsgiversimulering: {
                                  __typename: 'Simulering';
                                  fagsystemId: string;
                                  totalbelop: number | null;
                                  tidsstempel: string;
                                  utbetalingslinjer: Array<{
                                      __typename: 'Simuleringslinje';
                                      fom: string;
                                      tom: string;
                                      dagsats: number;
                                      grad: number;
                                  }>;
                                  perioder: Array<{
                                      __typename: 'Simuleringsperiode';
                                      fom: string;
                                      tom: string;
                                      utbetalinger: Array<{
                                          __typename: 'Simuleringsutbetaling';
                                          mottakerId: string;
                                          mottakerNavn: string;
                                          forfall: string;
                                          feilkonto: boolean;
                                          detaljer: Array<{
                                              __typename: 'Simuleringsdetaljer';
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
                              personsimulering: {
                                  __typename: 'Simulering';
                                  fagsystemId: string;
                                  totalbelop: number | null;
                                  tidsstempel: string;
                                  utbetalingslinjer: Array<{
                                      __typename: 'Simuleringslinje';
                                      fom: string;
                                      tom: string;
                                      dagsats: number;
                                      grad: number;
                                  }>;
                                  perioder: Array<{
                                      __typename: 'Simuleringsperiode';
                                      fom: string;
                                      tom: string;
                                      utbetalinger: Array<{
                                          __typename: 'Simuleringsutbetaling';
                                          mottakerId: string;
                                          mottakerNavn: string;
                                          forfall: string;
                                          feilkonto: boolean;
                                          detaljer: Array<{
                                              __typename: 'Simuleringsdetaljer';
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
                          oppgave: { __typename: 'OppgaveForPeriodevisning'; id: string } | null;
                          paVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
                          totrinnsvurdering: {
                              __typename: 'Totrinnsvurdering';
                              erBeslutteroppgave: boolean;
                              erRetur: boolean;
                              saksbehandler: string | null;
                              beslutter: string | null;
                          } | null;
                          egenskaper: Array<{ __typename: 'Oppgaveegenskap'; egenskap: Egenskap; kategori: Kategori }>;
                          avslag: Array<{
                              __typename: 'Avslag';
                              type: Avslagstype;
                              begrunnelse: string;
                              opprettet: string;
                              saksbehandlerIdent: string;
                              invalidert: boolean;
                          }>;
                          vedtakBegrunnelser: Array<{
                              __typename: 'VedtakBegrunnelse';
                              utfall: VedtakUtfall;
                              begrunnelse: string | null;
                              opprettet: string;
                              saksbehandlerIdent: string;
                          }>;
                          annullering: {
                              __typename: 'Annullering';
                              saksbehandlerIdent: string;
                              arbeidsgiverFagsystemId: string | null;
                              personFagsystemId: string | null;
                              tidspunkt: string;
                              arsaker: Array<string>;
                              begrunnelse: string | null;
                          } | null;
                          pensjonsgivendeInntekter: Array<{
                              __typename: 'PensjonsgivendeInntekt';
                              arligBelop: string;
                              inntektsar: number;
                          }>;
                          annulleringskandidater: Array<{
                              __typename: 'Annulleringskandidat';
                              fom: string;
                              organisasjonsnummer: string;
                              tom: string;
                              vedtaksperiodeId: string;
                          }>;
                          tidslinje: Array<{
                              __typename: 'Dag';
                              dato: string;
                              grad: number | null;
                              sykdomsdagtype: Sykdomsdagtype;
                              utbetalingsdagtype: Utbetalingsdagtype;
                              begrunnelser: Array<Begrunnelse> | null;
                              kilde: { __typename: 'Kilde'; id: string; type: Kildetype };
                              utbetalingsinfo: {
                                  __typename: 'Utbetalingsinfo';
                                  arbeidsgiverbelop: number | null;
                                  inntekt: number | null;
                                  personbelop: number | null;
                                  refusjonsbelop: number | null;
                                  totalGrad: number | null;
                                  utbetaling: number | null;
                              } | null;
                          }>;
                          varsler: Array<{
                              __typename: 'VarselDTO';
                              generasjonId: string;
                              definisjonId: string;
                              opprettet: string;
                              kode: string;
                              tittel: string;
                              forklaring: string | null;
                              handling: string | null;
                              vurdering: {
                                  __typename: 'VarselvurderingDTO';
                                  ident: string;
                                  status: Varselstatus;
                                  tidsstempel: string;
                              } | null;
                          }>;
                          hendelser: Array<
                              | {
                                    __typename: 'InntektHentetFraAOrdningen';
                                    mottattDato: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'Inntektsmelding';
                                    beregnetInntekt: number;
                                    mottattDato: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsgiver';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtArbeidsgiver: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsledig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadFrilans';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadNav';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadSelvstendig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'Sykmelding';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                          >;
                      }
                    | {
                          __typename: 'UberegnetPeriode';
                          id: string;
                          behandlingId: string;
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
                              __typename: 'Notat';
                              id: number;
                              dialogRef: number;
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
                                  __typename: 'Kommentar';
                                  id: number;
                                  tekst: string;
                                  opprettet: string;
                                  saksbehandlerident: string;
                                  feilregistrert_tidspunkt: string | null;
                              }>;
                          }>;
                          tidslinje: Array<{
                              __typename: 'Dag';
                              dato: string;
                              grad: number | null;
                              sykdomsdagtype: Sykdomsdagtype;
                              utbetalingsdagtype: Utbetalingsdagtype;
                              begrunnelser: Array<Begrunnelse> | null;
                              kilde: { __typename: 'Kilde'; id: string; type: Kildetype };
                              utbetalingsinfo: {
                                  __typename: 'Utbetalingsinfo';
                                  arbeidsgiverbelop: number | null;
                                  inntekt: number | null;
                                  personbelop: number | null;
                                  refusjonsbelop: number | null;
                                  totalGrad: number | null;
                                  utbetaling: number | null;
                              } | null;
                          }>;
                          varsler: Array<{
                              __typename: 'VarselDTO';
                              generasjonId: string;
                              definisjonId: string;
                              opprettet: string;
                              kode: string;
                              tittel: string;
                              forklaring: string | null;
                              handling: string | null;
                              vurdering: {
                                  __typename: 'VarselvurderingDTO';
                                  ident: string;
                                  status: Varselstatus;
                                  tidsstempel: string;
                              } | null;
                          }>;
                          hendelser: Array<
                              | {
                                    __typename: 'InntektHentetFraAOrdningen';
                                    mottattDato: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'Inntektsmelding';
                                    beregnetInntekt: number;
                                    mottattDato: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsgiver';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtArbeidsgiver: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadArbeidsledig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadFrilans';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadNav';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'SoknadSelvstendig';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    eksternDokumentId: string | null;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename: 'Sykmelding';
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
                      vedtaksperiodeId: string;
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'Dagoverstyring';
                      begrunnelse: string;
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      dager: Array<{
                          __typename: 'OverstyrtDag';
                          grad: number | null;
                          fraGrad: number | null;
                          dato: string;
                          type: Dagtype;
                          fraType: Dagtype | null;
                      }>;
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'Inntektoverstyring';
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      inntekt: {
                          __typename: 'OverstyrtInntekt';
                          skjaeringstidspunkt: string;
                          forklaring: string;
                          begrunnelse: string;
                          manedligInntekt: number;
                          fraManedligInntekt: number | null;
                          refusjonsopplysninger: Array<{
                              __typename: 'Refusjonsopplysning';
                              fom: string;
                              tom: string | null;
                              belop: number;
                          }> | null;
                          fraRefusjonsopplysninger: Array<{
                              __typename: 'Refusjonsopplysning';
                              fom: string;
                              tom: string | null;
                              belop: number;
                          }> | null;
                      };
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'MinimumSykdomsgradOverstyring';
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      minimumSykdomsgrad: {
                          __typename: 'OverstyrtMinimumSykdomsgrad';
                          begrunnelse: string;
                          initierendeVedtaksperiodeId: string;
                          perioderVurdertOk: Array<{
                              __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                              fom: string;
                              tom: string;
                          }>;
                          perioderVurdertIkkeOk: Array<{
                              __typename: 'OverstyrtMinimumSykdomsgradPeriode';
                              fom: string;
                              tom: string;
                          }>;
                      };
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
                | {
                      __typename: 'Sykepengegrunnlagskjonnsfastsetting';
                      hendelseId: string;
                      timestamp: string;
                      ferdigstilt: boolean;
                      vedtaksperiodeId: string;
                      skjonnsfastsatt: {
                          __typename: 'SkjonnsfastsattSykepengegrunnlag';
                          arsak: string;
                          type: Skjonnsfastsettingstype | null;
                          begrunnelse: string | null;
                          begrunnelseMal: string | null;
                          begrunnelseFritekst: string | null;
                          begrunnelseKonklusjon: string | null;
                          arlig: number;
                          fraArlig: number | null;
                          skjaeringstidspunkt: string;
                      };
                      saksbehandler: { __typename: 'Saksbehandler'; ident: string | null; navn: string };
                  }
            >;
            inntekterFraAordningen: Array<{
                __typename: 'ArbeidsgiverInntekterFraAOrdningen';
                skjaeringstidspunkt: string;
                inntekter: Array<{ __typename: 'InntektFraAOrdningen'; maned: string; sum: number }>;
            }>;
        }>;
        tilleggsinfoForInntektskilder: Array<{
            __typename: 'TilleggsinfoForInntektskilde';
            orgnummer: string;
            navn: string;
        }>;
    } | null;
};

export type OppdaterPersonMutationVariables = Exact<{
    fodselsnummer: Scalars['String']['input'];
}>;

export type OppdaterPersonMutation = { __typename: 'Mutation'; oppdaterPerson: boolean };

export type EndrePaVentMutationVariables = Exact<{
    oppgaveId: Scalars['String']['input'];
    frist: Scalars['LocalDate']['input'];
    tildeling: Scalars['Boolean']['input'];
    notatTekst?: InputMaybe<Scalars['String']['input']>;
    arsaker: Array<PaVentArsakInput> | PaVentArsakInput;
}>;

export type EndrePaVentMutation = {
    __typename: 'Mutation';
    endrePaVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
};

export type FjernPaVentMutationVariables = Exact<{
    oppgaveId: Scalars['String']['input'];
}>;

export type FjernPaVentMutation = { __typename: 'Mutation'; fjernPaVent: boolean | null };

export type LeggPaVentMutationVariables = Exact<{
    oppgaveId: Scalars['String']['input'];
    frist: Scalars['LocalDate']['input'];
    tildeling: Scalars['Boolean']['input'];
    notatTekst?: InputMaybe<Scalars['String']['input']>;
    arsaker?: InputMaybe<Array<PaVentArsakInput> | PaVentArsakInput>;
}>;

export type LeggPaVentMutation = {
    __typename: 'Mutation';
    leggPaVent: { __typename: 'PaVent'; frist: string | null; oid: string } | null;
};

export type PaventFragment = { __typename: 'PaVent'; frist: string | null; oid: string };

export type SkjonnsfastsettelseMutationMutationVariables = Exact<{
    skjonnsfastsettelse: SkjonnsfastsettelseInput;
}>;

export type SkjonnsfastsettelseMutationMutation = {
    __typename: 'Mutation';
    skjonnsfastsettSykepengegrunnlag: boolean | null;
};

export type OpphevStansAutomatiskBehandlingMutationVariables = Exact<{
    fodselsnummer: Scalars['String']['input'];
    begrunnelse: Scalars['String']['input'];
}>;

export type OpphevStansAutomatiskBehandlingMutation = {
    __typename: 'Mutation';
    opphevStansAutomatiskBehandling: boolean;
};

export type StansAutomatiskBehandlingMutationVariables = Exact<{
    fodselsnummer: Scalars['String']['input'];
    begrunnelse: Scalars['String']['input'];
}>;

export type StansAutomatiskBehandlingMutation = { __typename: 'Mutation'; stansAutomatiskBehandling: boolean };

export type FjernTildelingMutationVariables = Exact<{
    oppgaveId: Scalars['String']['input'];
}>;

export type FjernTildelingMutation = { __typename: 'Mutation'; fjernTildeling: boolean };

export type OpprettTildelingMutationVariables = Exact<{
    oppgaveId: Scalars['String']['input'];
}>;

export type OpprettTildelingMutation = {
    __typename: 'Mutation';
    opprettTildeling: { __typename: 'Tildeling'; navn: string; oid: string; epost: string } | null;
};

export type TildelingFragment = { __typename: 'Tildeling'; navn: string; oid: string; epost: string };

export type TildelteOppgaverFeedQueryVariables = Exact<{
    limit: Scalars['Int']['input'];
    offset: Scalars['Int']['input'];
    oppslattSaksbehandler: SaksbehandlerInput;
}>;

export type TildelteOppgaverFeedQuery = {
    __typename: 'Query';
    tildelteOppgaverFeed: {
        __typename: 'OppgaverTilBehandling';
        totaltAntallOppgaver: number;
        oppgaver: Array<{
            __typename: 'OppgaveTilBehandling';
            aktorId: string;
            id: string;
            opprettet: string;
            opprinneligSoknadsdato: string;
            tidsfrist: string | null;
            vedtaksperiodeId: string;
            oppgavetype: Oppgavetype;
            periodetype: Periodetype;
            mottaker: Mottaker;
            antallArbeidsforhold: AntallArbeidsforhold;
            egenskaper: Array<{ __typename: 'Oppgaveegenskap'; egenskap: Egenskap; kategori: Kategori }>;
            navn: { __typename: 'Personnavn'; fornavn: string; etternavn: string; mellomnavn: string | null };
            paVentInfo: {
                __typename: 'PaVentInfo';
                tidsfrist: string;
                opprettet: string;
                saksbehandler: string;
                dialogRef: number;
                arsaker: Array<string>;
                tekst: string | null;
                kommentarer: Array<{
                    __typename: 'Kommentar';
                    id: number;
                    opprettet: string;
                    saksbehandlerident: string;
                    tekst: string;
                    feilregistrert_tidspunkt: string | null;
                }>;
            } | null;
            tildeling: { __typename: 'Tildeling'; epost: string; navn: string; oid: string } | null;
        }>;
    };
};

export type EndreTilkommenInntektMutationVariables = Exact<{
    endretTil: TilkommenInntektInput;
    notatTilBeslutter: Scalars['String']['input'];
    tilkommenInntektId: Scalars['UUID']['input'];
}>;

export type EndreTilkommenInntektMutation = { __typename: 'Mutation'; endreTilkommenInntekt: boolean };

export type FjernTilkommenInntektMutationVariables = Exact<{
    notatTilBeslutter: Scalars['String']['input'];
    tilkommenInntektId: Scalars['UUID']['input'];
}>;

export type FjernTilkommenInntektMutation = { __typename: 'Mutation'; fjernTilkommenInntekt: boolean };

export type GjenopprettTilkommenInntektMutationVariables = Exact<{
    endretTil: TilkommenInntektInput;
    notatTilBeslutter: Scalars['String']['input'];
    tilkommenInntektId: Scalars['UUID']['input'];
}>;

export type GjenopprettTilkommenInntektMutation = { __typename: 'Mutation'; gjenopprettTilkommenInntekt: boolean };

export type LeggTilTilkommenInntektMutationVariables = Exact<{
    fodselsnummer: Scalars['String']['input'];
    notatTilBeslutter: Scalars['String']['input'];
    tilkommenInntekt: TilkommenInntektInput;
}>;

export type LeggTilTilkommenInntektMutation = {
    __typename: 'Mutation';
    leggTilTilkommenInntekt: { __typename: 'LeggTilTilkommenInntektResponse'; tilkommenInntektId: string };
};

export type HentTilkommenInntektV2QueryVariables = Exact<{
    fodselsnummer: Scalars['String']['input'];
}>;

export type HentTilkommenInntektV2Query = {
    __typename: 'Query';
    tilkomneInntektskilderV2: Array<{
        __typename: 'TilkommenInntektskilde';
        organisasjonsnummer: string;
        inntekter: Array<{
            __typename: 'TilkommenInntekt';
            tilkommenInntektId: string;
            periodebelop: string;
            ekskluderteUkedager: Array<string>;
            fjernet: boolean;
            erDelAvAktivTotrinnsvurdering: boolean;
            periode: { __typename: 'DatoPeriode'; fom: string; tom: string };
            events: Array<
                | {
                      __typename: 'TilkommenInntektEndretEvent';
                      endringer: {
                          __typename: 'TilkommenInntektEventEndringer';
                          organisasjonsnummer: {
                              __typename: 'TilkommenInntektEventStringEndring';
                              fra: string;
                              til: string;
                          } | null;
                          periode: {
                              __typename: 'TilkommenInntektEventDatoPeriodeEndring';
                              fra: { __typename: 'DatoPeriode'; fom: string; tom: string };
                              til: { __typename: 'DatoPeriode'; fom: string; tom: string };
                          } | null;
                          periodebelop: {
                              __typename: 'TilkommenInntektEventBigDecimalEndring';
                              fra: string;
                              til: string;
                          } | null;
                          ekskluderteUkedager: {
                              __typename: 'TilkommenInntektEventListLocalDateEndring';
                              fra: Array<string>;
                              til: Array<string>;
                          } | null;
                      };
                      metadata: {
                          __typename: 'TilkommenInntektEventMetadata';
                          sekvensnummer: number;
                          tidspunkt: string;
                          utfortAvSaksbehandlerIdent: string;
                          notatTilBeslutter: string;
                      };
                  }
                | {
                      __typename: 'TilkommenInntektFjernetEvent';
                      metadata: {
                          __typename: 'TilkommenInntektEventMetadata';
                          sekvensnummer: number;
                          tidspunkt: string;
                          utfortAvSaksbehandlerIdent: string;
                          notatTilBeslutter: string;
                      };
                  }
                | {
                      __typename: 'TilkommenInntektGjenopprettetEvent';
                      endringer: {
                          __typename: 'TilkommenInntektEventEndringer';
                          organisasjonsnummer: {
                              __typename: 'TilkommenInntektEventStringEndring';
                              fra: string;
                              til: string;
                          } | null;
                          periode: {
                              __typename: 'TilkommenInntektEventDatoPeriodeEndring';
                              fra: { __typename: 'DatoPeriode'; fom: string; tom: string };
                              til: { __typename: 'DatoPeriode'; fom: string; tom: string };
                          } | null;
                          periodebelop: {
                              __typename: 'TilkommenInntektEventBigDecimalEndring';
                              fra: string;
                              til: string;
                          } | null;
                          ekskluderteUkedager: {
                              __typename: 'TilkommenInntektEventListLocalDateEndring';
                              fra: Array<string>;
                              til: Array<string>;
                          } | null;
                      };
                      metadata: {
                          __typename: 'TilkommenInntektEventMetadata';
                          sekvensnummer: number;
                          tidspunkt: string;
                          utfortAvSaksbehandlerIdent: string;
                          notatTilBeslutter: string;
                      };
                  }
                | {
                      __typename: 'TilkommenInntektOpprettetEvent';
                      organisasjonsnummer: string;
                      periodebelop: string;
                      ekskluderteUkedager: Array<string>;
                      periode: { __typename: 'DatoPeriode'; fom: string; tom: string };
                      metadata: {
                          __typename: 'TilkommenInntektEventMetadata';
                          sekvensnummer: number;
                          tidspunkt: string;
                          utfortAvSaksbehandlerIdent: string;
                          notatTilBeslutter: string;
                      };
                  }
            >;
        }>;
    }>;
};

export type SendIReturMutationVariables = Exact<{
    oppgavereferanse: Scalars['String']['input'];
    notatTekst: Scalars['String']['input'];
}>;

export type SendIReturMutation = { __typename: 'Mutation'; sendIRetur: boolean | null };

export type SendTilGodkjenningV2MutationVariables = Exact<{
    oppgavereferanse: Scalars['String']['input'];
    vedtakBegrunnelse?: InputMaybe<Scalars['String']['input']>;
}>;

export type SendTilGodkjenningV2Mutation = { __typename: 'Mutation'; sendTilGodkjenningV2: boolean | null };

export type SettVarselStatusMutationVariables = Exact<{
    generasjonIdString: Scalars['String']['input'];
    ident: Scalars['String']['input'];
    varselkode: Scalars['String']['input'];
    definisjonIdString?: InputMaybe<Scalars['String']['input']>;
}>;

export type SettVarselStatusMutation = {
    __typename: 'Mutation';
    settVarselstatus: {
        __typename: 'VarselDTO';
        forklaring: string | null;
        definisjonId: string;
        generasjonId: string;
        handling: string | null;
        kode: string;
        tittel: string;
        vurdering: {
            __typename: 'VarselvurderingDTO';
            ident: string;
            status: Varselstatus;
            tidsstempel: string;
        } | null;
    } | null;
};

export type FattVedtakMutationVariables = Exact<{
    oppgavereferanse: Scalars['String']['input'];
    begrunnelse?: InputMaybe<Scalars['String']['input']>;
}>;

export type FattVedtakMutation = { __typename: 'Mutation'; fattVedtak: boolean };

export type TilInfoTrygdMutationVariables = Exact<{
    oppgavereferanse: Scalars['String']['input'];
    arsak: Scalars['String']['input'];
    begrunnelser: Array<Scalars['String']['input']> | Scalars['String']['input'];
    kommentar?: InputMaybe<Scalars['String']['input']>;
}>;

export type TilInfoTrygdMutation = { __typename: 'Mutation'; sendTilInfotrygd: boolean };

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
                    { kind: 'Field', name: { kind: 'Name', value: 'manuelt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tilgjengelig' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AntallFragment, unknown>;
export const SporsmalFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'sporsmal' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sporsmal' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'sporsmalstekst' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'svar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'verdi' } }],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'svartype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tag' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SporsmalFragment, unknown>;
export const VilkarsgrunnlagV2FragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'vilkarsgrunnlagV2' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagV2' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sykepengegrunnlag' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
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
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
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
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
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
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgiverrefusjoner' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'meldingsreferanseId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagSpleisV2' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjonnsmessigFastsattAarlig' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vurderingAvKravOmMedlemskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmMinstelonn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmOpptjening' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'antallOpptjeningsdagerErMinst' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningFra' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengegrunnlagsgrense' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'grense' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'virkningstidspunkt' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avviksvurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'avviksprosent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sammenligningsgrunnlag' } },
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
                            name: { kind: 'Name', value: 'VilkarsgrunnlagInfotrygdV2' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'omregnetArsinntekt' } }],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<VilkarsgrunnlagV2Fragment, unknown>;
export const GhostPeriodeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ghostPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GhostPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GhostPeriodeFragment, unknown>;
export const KommentarFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<KommentarFragment, unknown>;
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
                    { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerOid' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerEpost' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'kommentarer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'kommentar' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<NotatFragment, unknown>;
export const PeriodeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'generasjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
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
} as unknown as DocumentNode<PeriodeFragment, unknown>;
export const UberegnetPeriodeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'uberegnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UberegnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'notater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'notat' } }],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerOid' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerEpost' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'kommentarer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'kommentar' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'generasjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
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
} as unknown as DocumentNode<UberegnetPeriodeFragment, unknown>;
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
                    { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerNavn' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'feilkonto' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'uforegrad' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'typeSats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'konto' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'klassekode' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'antallSats' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
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
export const BeregnetPeriodeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'beregnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'BeregnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'beregningId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'handlinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tillatt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'notater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'notat' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'periodevilkar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'alderSisteSykedag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengedager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'risikovurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'funn' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kontrollertOk' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetaling' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'automatisk' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'godkjent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiversimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'personsimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppgave' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paVent' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totrinnsvurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'erBeslutteroppgave' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'erRetur' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandler' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'beslutter' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'egenskaper' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'egenskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'invalidert' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vedtakBegrunnelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'utfall' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annullering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pensjonsgivendeInntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arligBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'inntektsar' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annulleringskandidater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerOid' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerEpost' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'kommentarer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'kommentar' } }],
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
                    { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerNavn' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'feilkonto' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'uforegrad' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'typeSats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'konto' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'klassekode' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'antallSats' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
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
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'generasjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
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
} as unknown as DocumentNode<BeregnetPeriodeFragment, unknown>;
export const OverstyringFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'overstyring' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Overstyring' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'hendelseId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'ferdigstilt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Dagoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraType' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Inntektoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedligInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraManedligInntekt' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fraRefusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
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
                            name: { kind: 'Name', value: 'Arbeidsforholdoverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Sykepengegrunnlagskjonnsfastsetting' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsfastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsak' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseMal' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseFritekst' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseKonklusjon' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraArlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
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
                            name: { kind: 'Name', value: 'MinimumSykdomsgradOverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'minimumSykdomsgrad' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertIkkeOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'initierendeVedtaksperiodeId' },
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
} as unknown as DocumentNode<OverstyringFragment, unknown>;
export const ArbeidsgiverFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'arbeidsgiver' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Arbeidsgiver' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsforhold' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'sluttdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'startdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingsprosent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingstittel' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'ghostPerioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ghostPeriode' } }],
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
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'UberegnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'uberegnetPeriode' },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'BeregnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'beregnetPeriode' },
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
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'overstyring' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inntekterFraAordningen' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekter' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
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
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerOid' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerEpost' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'kommentarer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'kommentar' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'generasjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
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
            name: { kind: 'Name', value: 'simulering' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Simulering' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fagsystemId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerNavn' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'feilkonto' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'uforegrad' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'typeSats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'konto' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'klassekode' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'antallSats' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
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
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ghostPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GhostPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'uberegnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UberegnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'notater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'notat' } }],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'beregnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'BeregnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'beregningId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'handlinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tillatt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'notater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'notat' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'periodevilkar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'alderSisteSykedag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengedager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'risikovurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'funn' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kontrollertOk' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetaling' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'automatisk' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'godkjent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiversimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'personsimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppgave' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paVent' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totrinnsvurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'erBeslutteroppgave' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'erRetur' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandler' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'beslutter' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'egenskaper' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'egenskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'invalidert' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vedtakBegrunnelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'utfall' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annullering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pensjonsgivendeInntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arligBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'inntektsar' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annulleringskandidater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'overstyring' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Overstyring' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'hendelseId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'ferdigstilt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Dagoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraType' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Inntektoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedligInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraManedligInntekt' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fraRefusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
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
                            name: { kind: 'Name', value: 'Arbeidsforholdoverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Sykepengegrunnlagskjonnsfastsetting' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsfastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsak' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseMal' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseFritekst' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseKonklusjon' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraArlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
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
                            name: { kind: 'Name', value: 'MinimumSykdomsgradOverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'minimumSykdomsgrad' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertIkkeOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'initierendeVedtaksperiodeId' },
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
} as unknown as DocumentNode<ArbeidsgiverFragment, unknown>;
export const TilleggsinfoForInntektskildeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'tilleggsinfoForInntektskilde' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TilleggsinfoForInntektskilde' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'orgnummer' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<TilleggsinfoForInntektskildeFragment, unknown>;
export const PersonFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'person' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Person' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fodselsnummer' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'dodsdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'enhet' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'fornavn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'mellomnavn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'etternavn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'adressebeskyttelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fodselsdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kjonn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fullmakt' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'reservasjon' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'kanVarsles' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'reservert' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'unntattFraAutomatisering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'erUnntatt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidspunkt' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'automatiskBehandlingStansetAvSaksbehandler' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'versjon' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vilkarsgrunnlagV2' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'vilkarsgrunnlagV2' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'aktorId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgivere' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'arbeidsgiver' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tilleggsinfoForInntektskilder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'tilleggsinfoForInntektskilde' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ghostPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GhostPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerOid' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerEpost' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'kommentarer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'kommentar' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'generasjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
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
            name: { kind: 'Name', value: 'uberegnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UberegnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'notater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'notat' } }],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerNavn' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'feilkonto' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'uforegrad' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'typeSats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'konto' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'klassekode' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'antallSats' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
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
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'beregnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'BeregnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'beregningId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'handlinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tillatt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'notater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'notat' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'periodevilkar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'alderSisteSykedag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengedager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'risikovurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'funn' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kontrollertOk' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetaling' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'automatisk' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'godkjent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiversimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'personsimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppgave' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paVent' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totrinnsvurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'erBeslutteroppgave' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'erRetur' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandler' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'beslutter' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'egenskaper' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'egenskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'invalidert' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vedtakBegrunnelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'utfall' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annullering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pensjonsgivendeInntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arligBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'inntektsar' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annulleringskandidater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'overstyring' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Overstyring' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'hendelseId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'ferdigstilt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Dagoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraType' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Inntektoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedligInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraManedligInntekt' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fraRefusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
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
                            name: { kind: 'Name', value: 'Arbeidsforholdoverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Sykepengegrunnlagskjonnsfastsetting' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsfastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsak' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseMal' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseFritekst' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseKonklusjon' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraArlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
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
                            name: { kind: 'Name', value: 'MinimumSykdomsgradOverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'minimumSykdomsgrad' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertIkkeOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'initierendeVedtaksperiodeId' },
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
            name: { kind: 'Name', value: 'vilkarsgrunnlagV2' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagV2' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sykepengegrunnlag' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
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
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
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
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
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
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgiverrefusjoner' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'meldingsreferanseId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagSpleisV2' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjonnsmessigFastsattAarlig' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vurderingAvKravOmMedlemskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmMinstelonn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmOpptjening' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'antallOpptjeningsdagerErMinst' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningFra' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengegrunnlagsgrense' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'grense' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'virkningstidspunkt' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avviksvurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'avviksprosent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sammenligningsgrunnlag' } },
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
                            name: { kind: 'Name', value: 'VilkarsgrunnlagInfotrygdV2' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'omregnetArsinntekt' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'arbeidsgiver' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Arbeidsgiver' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsforhold' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'sluttdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'startdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingsprosent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingstittel' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'ghostPerioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ghostPeriode' } }],
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
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'UberegnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'uberegnetPeriode' },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'BeregnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'beregnetPeriode' },
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
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'overstyring' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inntekterFraAordningen' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekter' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
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
            name: { kind: 'Name', value: 'tilleggsinfoForInntektskilde' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TilleggsinfoForInntektskilde' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'orgnummer' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PersonFragment, unknown>;
export const PaventFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'pavent' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PaVent' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PaventFragment, unknown>;
export const TildelingFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'tildeling' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Tildeling' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<TildelingFragment, unknown>;
export const AnnullerDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'Annuller' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'annullering' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'AnnulleringDataInput' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annuller' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'annullering' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'annullering' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AnnullerMutation, AnnullerMutationVariables>;
export const AntallOppgaverDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'AntallOppgaver' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'antallOppgaver' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'antallMineSaker' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'antallMineSakerPaVent' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AntallOppgaverQuery, AntallOppgaverQueryVariables>;
export const BehandledeOppgaverFeedDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'BehandledeOppgaverFeed' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fom' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'LocalDate' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tom' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'LocalDate' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'behandledeOppgaverFeed' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'offset' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'limit' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fom' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fom' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'tom' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'tom' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oppgaver' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'aktorId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'ferdigstiltAv' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'beslutter' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'saksbehandler' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'ferdigstiltTidspunkt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'antallArbeidsforhold' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppgavetype' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'personnavn' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fornavn' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'mellomnavn' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'etternavn' } },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'totaltAntallOppgaver' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<BehandledeOppgaverFeedQuery, BehandledeOppgaverFeedQueryVariables>;
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
                                    name: { kind: 'Name', value: 'egenAnsatt' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'antallAvvisninger' } },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'manuelt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tilgjengelig' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<HentBehandlingsstatistikkQuery, HentBehandlingsstatistikkQueryVariables>;
export const FetchInntektsmeldingDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'FetchInntektsmelding' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fnr' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'dokumentId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hentInntektsmelding' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fnr' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fnr' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'dokumentId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'dokumentId' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsforholdId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'virksomhetsnummer' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'begrunnelseForReduksjonEllerIkkeUtbetalt' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'bruttoUtbetalt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'refusjon' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beloepPrMnd' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'opphoersdato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'endringIRefusjoner' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'endringsdato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'beloep' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'opphoerAvNaturalytelser' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'naturalytelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'beloepPrMnd' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'gjenopptakelseNaturalytelser' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'naturalytelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'beloepPrMnd' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiverperioder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'ferieperioder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'foersteFravaersdag' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'naerRelasjon' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'innsenderFulltNavn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'innsenderTelefon' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntektEndringAarsaker' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'aarsak' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioder' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'gjelderFra' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'bleKjent' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avsenderSystem' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'navn' } }],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FetchInntektsmeldingQuery, FetchInntektsmeldingQueryVariables>;
export const FetchSoknadDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'FetchSoknad' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fnr' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'dokumentId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hentSoknad' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fnr' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fnr' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'dokumentId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'dokumentId' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidGjenopptatt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykmeldingSkrevet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'egenmeldingsdagerFraSykmelding' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'soknadsperioder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'faktiskGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sykmeldingsgrad' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sporsmal' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'sporsmal' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'undersporsmal' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'sporsmal' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'undersporsmal' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'FragmentSpread',
                                                                        name: { kind: 'Name', value: 'sporsmal' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'undersporsmal' },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'FragmentSpread',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'sporsmal',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'undersporsmal',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'FragmentSpread',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'sporsmal',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'undersporsmal',
                                                                                                },
                                                                                                selectionSet: {
                                                                                                    kind: 'SelectionSet',
                                                                                                    selections: [
                                                                                                        {
                                                                                                            kind: 'FragmentSpread',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'sporsmal',
                                                                                                            },
                                                                                                        },
                                                                                                        {
                                                                                                            kind: 'Field',
                                                                                                            name: {
                                                                                                                kind: 'Name',
                                                                                                                value: 'undersporsmal',
                                                                                                            },
                                                                                                            selectionSet:
                                                                                                                {
                                                                                                                    kind: 'SelectionSet',
                                                                                                                    selections:
                                                                                                                        [
                                                                                                                            {
                                                                                                                                kind: 'FragmentSpread',
                                                                                                                                name: {
                                                                                                                                    kind: 'Name',
                                                                                                                                    value: 'sporsmal',
                                                                                                                                },
                                                                                                                            },
                                                                                                                            {
                                                                                                                                kind: 'Field',
                                                                                                                                name: {
                                                                                                                                    kind: 'Name',
                                                                                                                                    value: 'undersporsmal',
                                                                                                                                },
                                                                                                                                selectionSet:
                                                                                                                                    {
                                                                                                                                        kind: 'SelectionSet',
                                                                                                                                        selections:
                                                                                                                                            [
                                                                                                                                                {
                                                                                                                                                    kind: 'FragmentSpread',
                                                                                                                                                    name: {
                                                                                                                                                        kind: 'Name',
                                                                                                                                                        value: 'sporsmal',
                                                                                                                                                    },
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                    kind: 'Field',
                                                                                                                                                    name: {
                                                                                                                                                        kind: 'Name',
                                                                                                                                                        value: 'undersporsmal',
                                                                                                                                                    },
                                                                                                                                                    selectionSet:
                                                                                                                                                        {
                                                                                                                                                            kind: 'SelectionSet',
                                                                                                                                                            selections:
                                                                                                                                                                [
                                                                                                                                                                    {
                                                                                                                                                                        kind: 'FragmentSpread',
                                                                                                                                                                        name: {
                                                                                                                                                                            kind: 'Name',
                                                                                                                                                                            value: 'sporsmal',
                                                                                                                                                                        },
                                                                                                                                                                    },
                                                                                                                                                                    {
                                                                                                                                                                        kind: 'Field',
                                                                                                                                                                        name: {
                                                                                                                                                                            kind: 'Name',
                                                                                                                                                                            value: 'undersporsmal',
                                                                                                                                                                        },
                                                                                                                                                                        selectionSet:
                                                                                                                                                                            {
                                                                                                                                                                                kind: 'SelectionSet',
                                                                                                                                                                                selections:
                                                                                                                                                                                    [
                                                                                                                                                                                        {
                                                                                                                                                                                            kind: 'FragmentSpread',
                                                                                                                                                                                            name: {
                                                                                                                                                                                                kind: 'Name',
                                                                                                                                                                                                value: 'sporsmal',
                                                                                                                                                                                            },
                                                                                                                                                                                        },
                                                                                                                                                                                        {
                                                                                                                                                                                            kind: 'Field',
                                                                                                                                                                                            name: {
                                                                                                                                                                                                kind: 'Name',
                                                                                                                                                                                                value: 'undersporsmal',
                                                                                                                                                                                            },
                                                                                                                                                                                            selectionSet:
                                                                                                                                                                                                {
                                                                                                                                                                                                    kind: 'SelectionSet',
                                                                                                                                                                                                    selections:
                                                                                                                                                                                                        [
                                                                                                                                                                                                            {
                                                                                                                                                                                                                kind: 'FragmentSpread',
                                                                                                                                                                                                                name: {
                                                                                                                                                                                                                    kind: 'Name',
                                                                                                                                                                                                                    value: 'sporsmal',
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
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'sporsmal' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sporsmal' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'sporsmalstekst' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'svar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'verdi' } }],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'svartype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tag' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FetchSoknadQuery, FetchSoknadQueryVariables>;
export const HentSaksbehandlereDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'HentSaksbehandlere' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hentSaksbehandlere' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<HentSaksbehandlereQuery, HentSaksbehandlereQueryVariables>;
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
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
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
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'dialogRef' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
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
                                name: { kind: 'Name', value: 'dialogRef' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'dialogRef' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
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
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerOid' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerEpost' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kommentarer' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
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
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tekst' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerOid' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerEpost' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kommentarer' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
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
export const OppgaveFeedDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'OppgaveFeed' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'sortering' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: { kind: 'NamedType', name: { kind: 'Name', value: 'OppgavesorteringInput' } },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'filtrering' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'FiltreringInput' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppgaveFeed' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'offset' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'limit' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'sortering' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'sortering' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'filtrering' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'filtrering' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oppgaver' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'aktorId' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'egenskaper' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'egenskap' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'navn' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fornavn' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'etternavn' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'mellomnavn' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'opprinneligSoknadsdato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsfrist' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'paVentInfo' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tidsfrist' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'saksbehandler' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
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
                                                                        name: { kind: 'Name', value: 'opprettet' },
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
                                                                        name: { kind: 'Name', value: 'tekst' },
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
                                                name: { kind: 'Name', value: 'tildeling' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppgavetype' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'antallArbeidsforhold' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'totaltAntallOppgaver' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OppgaveFeedQuery, OppgaveFeedQueryVariables>;
export const OpphevStansDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'OpphevStans' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'begrunnelse' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'opphevStans' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fodselsnummer' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'begrunnelse' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'begrunnelse' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OpphevStansMutation, OpphevStansMutationVariables>;
export const OpprettAbonnementDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'OpprettAbonnement' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'personidentifikator' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'opprettAbonnement' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'personidentifikator' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'personidentifikator' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OpprettAbonnementMutation, OpprettAbonnementMutationVariables>;
export const OpptegnelserDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'Opptegnelser' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'sekvensId' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'opptegnelser' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'sekvensId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'sekvensId' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'aktorId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'sekvensnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'payload' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OpptegnelserQuery, OpptegnelserQueryVariables>;
export const HentOrganisasjonDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'HentOrganisasjon' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'organisasjon' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'organisasjonsnummer' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                            },
                        ],
                        directives: [
                            {
                                kind: 'Directive',
                                name: { kind: 'Name', value: 'rest' },
                                arguments: [
                                    {
                                        kind: 'Argument',
                                        name: { kind: 'Name', value: 'type' },
                                        value: { kind: 'StringValue', value: 'Organisasjon', block: false },
                                    },
                                    {
                                        kind: 'Argument',
                                        name: { kind: 'Name', value: 'endpoint' },
                                        value: { kind: 'StringValue', value: 'sparkelAareg', block: false },
                                    },
                                    {
                                        kind: 'Argument',
                                        name: { kind: 'Name', value: 'path' },
                                        value: {
                                            kind: 'StringValue',
                                            value: '/organisasjoner/{args.organisasjonsnummer}',
                                            block: false,
                                        },
                                    },
                                    {
                                        kind: 'Argument',
                                        name: { kind: 'Name', value: 'method' },
                                        value: { kind: 'StringValue', value: 'GET', block: false },
                                    },
                                ],
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<HentOrganisasjonQuery, HentOrganisasjonQueryVariables>;
export const OverstyrArbeidsforholdMutationDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'OverstyrArbeidsforholdMutation' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'overstyring' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ArbeidsforholdOverstyringHandlingInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'overstyrArbeidsforhold' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'overstyring' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'overstyring' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OverstyrArbeidsforholdMutationMutation, OverstyrArbeidsforholdMutationMutationVariables>;
export const OverstyrDagerMutationDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'OverstyrDagerMutation' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'overstyring' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'TidslinjeOverstyringInput' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'overstyrDager' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'overstyring' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'overstyring' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OverstyrDagerMutationMutation, OverstyrDagerMutationMutationVariables>;
export const OverstyrInntektOgRefusjonMutationDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'OverstyrInntektOgRefusjonMutation' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'overstyring' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'InntektOgRefusjonOverstyringInput' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'overstyrInntektOgRefusjon' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'overstyring' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'overstyring' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    OverstyrInntektOgRefusjonMutationMutation,
    OverstyrInntektOgRefusjonMutationMutationVariables
>;
export const MinimumSykdomsgradMutationDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'MinimumSykdomsgradMutation' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'minimumSykdomsgrad' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'MinimumSykdomsgradInput' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'minimumSykdomsgrad' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'minimumSykdomsgrad' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'minimumSykdomsgrad' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<MinimumSykdomsgradMutationMutation, MinimumSykdomsgradMutationMutationVariables>;
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
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'person' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'vilkarsgrunnlagV2' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagV2' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sykepengegrunnlag' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
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
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'inntektFraAOrdningen' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
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
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
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
                                                        { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kilde' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgiverrefusjoner' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiver' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'meldingsreferanseId' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'VilkarsgrunnlagSpleisV2' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjonnsmessigFastsattAarlig' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vurderingAvKravOmMedlemskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmMinstelonn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oppfyllerKravOmOpptjening' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'antallOpptjeningsdagerErMinst' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opptjeningFra' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengegrunnlagsgrense' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grunnbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'grense' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'virkningstidspunkt' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'avviksvurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'avviksprosent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregningsgrunnlag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sammenligningsgrunnlag' } },
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
                            name: { kind: 'Name', value: 'VilkarsgrunnlagInfotrygdV2' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'omregnetArsinntekt' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ghostPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GhostPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'kommentar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Kommentar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerident' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert_tidspunkt' } },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerOid' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerNavn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerEpost' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'feilregistrert' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'kommentarer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'kommentar' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'periode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'behandlingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'erForkastet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'inntektstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tidslinje' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kilde' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykdomsdagtype' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'utbetalingsdagtype' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalingsinfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'inntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'personbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'refusjonsbelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'totalGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'utbetaling' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelser' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'periodetilstand' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'varsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'generasjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'Inntektsmelding' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beregnetInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadNav' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsgiver' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtArbeidsgiver' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadArbeidsledig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadFrilans' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'InntektHentetFraAOrdningen' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'mottattDato' } }],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                        kind: 'NamedType',
                                        name: { kind: 'Name', value: 'SoknadSelvstendig' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'rapportertDato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sendtNav' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'eksternDokumentId' } },
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
            name: { kind: 'Name', value: 'uberegnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UberegnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'notater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'notat' } }],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'totalbelop' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetalingslinjer' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'utbetalinger' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottakerNavn' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forfall' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'feilkonto' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'detaljer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'utbetalingstype' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'uforegrad' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'typeSats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tilbakeforing' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'sats' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'refunderesOrgNr' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'konto' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'klassekode' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'antallSats' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
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
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'beregnetPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'BeregnetPeriode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'beregningId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'handlinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tillatt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'notater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'notat' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'historikkinnslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LagtPaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'InlineFragment',
                                    typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'EndrePaVent' } },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'TotrinnsvurderingRetur' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'StansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                                        name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandlingSaksbehandler' },
                                    },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'notattekst' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'kommentarer' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'kommentar' },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'periodevilkar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'alderSisteSykedag' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sykepengedager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'forbrukteSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'gjenstaendeSykedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'maksdato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppfylt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'risikovurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'funn' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'kontrollertOk' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'utbetaling' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personNettoBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'automatisk' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'godkjent' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsgiversimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'personsimulering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'simulering' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'vilkarsgrunnlagId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppgave' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paVent' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totrinnsvurdering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'erBeslutteroppgave' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'erRetur' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandler' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'beslutter' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'egenskaper' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'egenskap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avslag' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'invalidert' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vedtakBegrunnelser' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'utfall' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annullering' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'saksbehandlerIdent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arbeidsgiverFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'personFagsystemId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pensjonsgivendeInntekter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'arligBelop' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'inntektsar' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'annulleringskandidater' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                            ],
                        },
                    },
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'periode' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'overstyring' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Overstyring' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'hendelseId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saksbehandler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'ferdigstilt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Dagoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dager' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraGrad' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'dato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraType' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Inntektoverstyring' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'manedligInntekt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraManedligInntekt' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'refusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fraRefusjonsopplysninger' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'belop' } },
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
                            name: { kind: 'Name', value: 'Arbeidsforholdoverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'deaktivert' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Sykepengegrunnlagskjonnsfastsetting' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'skjonnsfastsatt' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsak' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseMal' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseFritekst' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelseKonklusjon' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fraArlig' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
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
                            name: { kind: 'Name', value: 'MinimumSykdomsgradOverstyring' },
                        },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'minimumSykdomsgrad' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'perioderVurdertIkkeOk' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'begrunnelse' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'initierendeVedtaksperiodeId' },
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
            name: { kind: 'Name', value: 'arbeidsgiver' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Arbeidsgiver' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsforhold' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'sluttdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'startdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingsprosent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'stillingstittel' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'ghostPerioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ghostPeriode' } }],
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
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'UberegnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'uberegnetPeriode' },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'InlineFragment',
                                                typeCondition: {
                                                    kind: 'NamedType',
                                                    name: { kind: 'Name', value: 'BeregnetPeriode' },
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'beregnetPeriode' },
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
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'overstyring' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inntekterFraAordningen' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'skjaeringstidspunkt' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekter' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'maned' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
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
            name: { kind: 'Name', value: 'tilleggsinfoForInntektskilde' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TilleggsinfoForInntektskilde' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'orgnummer' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'person' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Person' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fodselsnummer' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'dodsdato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'enhet' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dagsats' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'fornavn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'mellomnavn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'etternavn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'adressebeskyttelse' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fodselsdato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kjonn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fullmakt' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'reservasjon' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'kanVarsles' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'reservert' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'unntattFraAutomatisering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'erUnntatt' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidspunkt' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'automatiskBehandlingStansetAvSaksbehandler' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'versjon' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'vilkarsgrunnlagV2' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'vilkarsgrunnlagV2' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'aktorId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgivere' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'arbeidsgiver' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tilleggsinfoForInntektskilder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'tilleggsinfoForInntektskilde' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FetchPersonQuery, FetchPersonQueryVariables>;
export const OppdaterPersonDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'OppdaterPerson' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppdaterPerson' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fodselsnummer' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OppdaterPersonMutation, OppdaterPersonMutationVariables>;
export const EndrePaVentDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'EndrePaVent' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'frist' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'LocalDate' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tildeling' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'notatTekst' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'arsaker' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaVentArsakInput' } },
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
                        name: { kind: 'Name', value: 'endrePaVent' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'oppgaveId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'frist' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'frist' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'tildeling' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'tildeling' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'notatTekst' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'notatTekst' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'arsaker' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'arsaker' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'pavent' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'pavent' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PaVent' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<EndrePaVentMutation, EndrePaVentMutationVariables>;
export const FjernPaVentDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'FjernPaVent' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fjernPaVent' },
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
} as unknown as DocumentNode<FjernPaVentMutation, FjernPaVentMutationVariables>;
export const LeggPaVentDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'LeggPaVent' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'frist' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'LocalDate' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tildeling' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'notatTekst' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'arsaker' } },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaVentArsakInput' } },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'leggPaVent' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'oppgaveId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oppgaveId' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'frist' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'frist' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'tildeling' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'tildeling' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'notatTekst' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'notatTekst' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'arsaker' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'arsaker' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'pavent' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'pavent' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PaVent' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'frist' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LeggPaVentMutation, LeggPaVentMutationVariables>;
export const SkjonnsfastsettelseMutationDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'SkjonnsfastsettelseMutation' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skjonnsfastsettelse' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'SkjonnsfastsettelseInput' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'skjonnsfastsettSykepengegrunnlag' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skjonnsfastsettelse' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'skjonnsfastsettelse' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SkjonnsfastsettelseMutationMutation, SkjonnsfastsettelseMutationMutationVariables>;
export const OpphevStansAutomatiskBehandlingDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'OpphevStansAutomatiskBehandling' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'begrunnelse' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'opphevStansAutomatiskBehandling' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fodselsnummer' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'begrunnelse' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'begrunnelse' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OpphevStansAutomatiskBehandlingMutation, OpphevStansAutomatiskBehandlingMutationVariables>;
export const StansAutomatiskBehandlingDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'StansAutomatiskBehandling' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'begrunnelse' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stansAutomatiskBehandling' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fodselsnummer' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'begrunnelse' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'begrunnelse' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<StansAutomatiskBehandlingMutation, StansAutomatiskBehandlingMutationVariables>;
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
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
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
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
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
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'tildeling' } }],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'tildeling' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Tildeling' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OpprettTildelingMutation, OpprettTildelingMutationVariables>;
export const TildelteOppgaverFeedDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'TildelteOppgaverFeed' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppslattSaksbehandler' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'SaksbehandlerInput' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tildelteOppgaverFeed' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'limit' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'offset' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'oppslattSaksbehandler' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oppslattSaksbehandler' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'oppgaver' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'aktorId' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'egenskaper' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'egenskap' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'kategori' } },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'navn' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fornavn' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'etternavn' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'mellomnavn' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'opprinneligSoknadsdato' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsfrist' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'paVentInfo' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tidsfrist' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'opprettet' } },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'saksbehandler' },
                                                        },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'dialogRef' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'arsaker' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
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
                                                                        name: { kind: 'Name', value: 'opprettet' },
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
                                                                        name: { kind: 'Name', value: 'tekst' },
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
                                                name: { kind: 'Name', value: 'tildeling' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'epost' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'oid' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'vedtaksperiodeId' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'oppgavetype' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'periodetype' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'mottaker' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'antallArbeidsforhold' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'totaltAntallOppgaver' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<TildelteOppgaverFeedQuery, TildelteOppgaverFeedQueryVariables>;
export const EndreTilkommenInntektDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'EndreTilkommenInntekt' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'endretTil' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'TilkommenInntektInput' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'notatTilBeslutter' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tilkommenInntektId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UUID' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endreTilkommenInntekt' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'endretTil' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'endretTil' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'notatTilBeslutter' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'notatTilBeslutter' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'tilkommenInntektId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'tilkommenInntektId' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<EndreTilkommenInntektMutation, EndreTilkommenInntektMutationVariables>;
export const FjernTilkommenInntektDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'FjernTilkommenInntekt' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'notatTilBeslutter' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tilkommenInntektId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UUID' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fjernTilkommenInntekt' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'notatTilBeslutter' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'notatTilBeslutter' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'tilkommenInntektId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'tilkommenInntektId' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FjernTilkommenInntektMutation, FjernTilkommenInntektMutationVariables>;
export const GjenopprettTilkommenInntektDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'GjenopprettTilkommenInntekt' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'endretTil' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'TilkommenInntektInput' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'notatTilBeslutter' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tilkommenInntektId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UUID' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'gjenopprettTilkommenInntekt' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'endretTil' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'endretTil' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'notatTilBeslutter' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'notatTilBeslutter' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'tilkommenInntektId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'tilkommenInntektId' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GjenopprettTilkommenInntektMutation, GjenopprettTilkommenInntektMutationVariables>;
export const LeggTilTilkommenInntektDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'LeggTilTilkommenInntekt' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'notatTilBeslutter' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tilkommenInntekt' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'TilkommenInntektInput' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'leggTilTilkommenInntekt' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fodselsnummer' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'notatTilBeslutter' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'notatTilBeslutter' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'verdier' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'tilkommenInntekt' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'tilkommenInntektId' } }],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LeggTilTilkommenInntektMutation, LeggTilTilkommenInntektMutationVariables>;
export const HentTilkommenInntektV2Document = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'HentTilkommenInntektV2' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tilkomneInntektskilderV2' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fodselsnummer' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'fodselsnummer' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'organisasjonsnummer' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'inntekter' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'tilkommenInntektId' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'periode' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                                        { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'periodebelop' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'ekskluderteUkedager' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'fjernet' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'erDelAvAktivTotrinnsvurdering' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'events' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'metadata' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'sekvensnummer' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'tidspunkt' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'utfortAvSaksbehandlerIdent',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'notatTilBeslutter',
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
                                                                    value: 'TilkommenInntektOpprettetEvent',
                                                                },
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'organisasjonsnummer',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'periode' },
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
                                                                            ],
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'periodebelop' },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'ekskluderteUkedager',
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
                                                                    value: 'TilkommenInntektEndretEvent',
                                                                },
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'endringer' },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'organisasjonsnummer',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fra',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'til',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'periode',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fra',
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
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'til',
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
                                                                                        value: 'periodebelop',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fra',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'til',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'ekskluderteUkedager',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fra',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'til',
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
                                                                    value: 'TilkommenInntektGjenopprettetEvent',
                                                                },
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'endringer' },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'organisasjonsnummer',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fra',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'til',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'periode',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fra',
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
                                                                                                    ],
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'til',
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
                                                                                        value: 'periodebelop',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fra',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'til',
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'ekskluderteUkedager',
                                                                                    },
                                                                                    selectionSet: {
                                                                                        kind: 'SelectionSet',
                                                                                        selections: [
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'fra',
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                kind: 'Field',
                                                                                                name: {
                                                                                                    kind: 'Name',
                                                                                                    value: 'til',
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
                ],
            },
        },
    ],
} as unknown as DocumentNode<HentTilkommenInntektV2Query, HentTilkommenInntektV2QueryVariables>;
export const SendIReturDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'SendIRetur' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppgavereferanse' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'notatTekst' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sendIRetur' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'oppgavereferanse' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oppgavereferanse' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'notatTekst' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'notatTekst' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SendIReturMutation, SendIReturMutationVariables>;
export const SendTilGodkjenningV2Document = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'SendTilGodkjenningV2' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppgavereferanse' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'vedtakBegrunnelse' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sendTilGodkjenningV2' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'oppgavereferanse' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oppgavereferanse' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'vedtakBegrunnelse' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'vedtakBegrunnelse' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SendTilGodkjenningV2Mutation, SendTilGodkjenningV2MutationVariables>;
export const SettVarselStatusDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'SettVarselStatus' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'generasjonIdString' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'ident' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'varselkode' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'definisjonIdString' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'settVarselstatus' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'generasjonIdString' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'generasjonIdString' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'ident' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'ident' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'varselkode' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'varselkode' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'definisjonIdString' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'definisjonIdString' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'forklaring' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'definisjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'generasjonId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'handling' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'kode' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tittel' } },
                                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vurdering' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'ident' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'tidsstempel' } },
                                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
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
} as unknown as DocumentNode<SettVarselStatusMutation, SettVarselStatusMutationVariables>;
export const FattVedtakDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'FattVedtak' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppgavereferanse' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'begrunnelse' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fattVedtak' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'oppgavereferanse' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oppgavereferanse' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'begrunnelse' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'begrunnelse' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<FattVedtakMutation, FattVedtakMutationVariables>;
export const TilInfoTrygdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'TilInfoTrygd' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'oppgavereferanse' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'arsak' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'begrunnelser' } },
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
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'kommentar' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sendTilInfotrygd' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'oppgavereferanse' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'oppgavereferanse' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'arsak' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'arsak' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'begrunnelser' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'begrunnelser' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'kommentar' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'kommentar' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<TilInfoTrygdMutation, TilInfoTrygdMutationVariables>;
