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
    __typename?: 'Alder';
    alderSisteSykedag: Scalars['Int']['output'];
    oppfylt: Scalars['Boolean']['output'];
};

export type Annullering = {
    __typename?: 'Annullering';
    arbeidsgiverFagsystemId?: Maybe<Scalars['String']['output']>;
    arsaker: Array<Scalars['String']['output']>;
    begrunnelse?: Maybe<Scalars['String']['output']>;
    personFagsystemId?: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent: Scalars['String']['output'];
    tidspunkt: Scalars['LocalDateTime']['output'];
    vedtaksperiodeId?: Maybe<Scalars['UUID']['output']>;
};

export type AnnulleringArsakInput = {
    _key: Scalars['String']['input'];
    arsak: Scalars['String']['input'];
};

export type AnnulleringDataInput = {
    aktorId: Scalars['String']['input'];
    annulleringskandidater?: InputMaybe<Array<Scalars['UUID']['input']>>;
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
    __typename?: 'Annulleringskandidat';
    fom: Scalars['LocalDate']['output'];
    organisasjonsnummer: Scalars['String']['output'];
    tom: Scalars['LocalDate']['output'];
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export type Antall = {
    __typename?: 'Antall';
    automatisk: Scalars['Int']['output'];
    manuelt: Scalars['Int']['output'];
    tilgjengelig: Scalars['Int']['output'];
};

export enum AntallArbeidsforhold {
    EtArbeidsforhold = 'ET_ARBEIDSFORHOLD',
    FlereArbeidsforhold = 'FLERE_ARBEIDSFORHOLD',
}

export type AntallOppgaver = {
    __typename?: 'AntallOppgaver';
    antallMineSaker: Scalars['Int']['output'];
    antallMineSakerPaVent: Scalars['Int']['output'];
};

export type Arbeidsforhold = {
    __typename?: 'Arbeidsforhold';
    sluttdato?: Maybe<Scalars['LocalDate']['output']>;
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
    __typename?: 'Arbeidsforholdoverstyring';
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
    __typename?: 'Arbeidsgiver';
    arbeidsforhold: Array<Arbeidsforhold>;
    generasjoner: Array<Generasjon>;
    ghostPerioder: Array<GhostPeriode>;
    inntekterFraAordningen: Array<ArbeidsgiverInntekterFraAOrdningen>;
    navn: Scalars['String']['output'];
    organisasjonsnummer: Scalars['String']['output'];
    overstyringer: Array<Overstyring>;
};

export type ArbeidsgiverInntekterFraAOrdningen = {
    __typename?: 'ArbeidsgiverInntekterFraAOrdningen';
    inntekter: Array<InntektFraAOrdningen>;
    skjaeringstidspunkt: Scalars['String']['output'];
};

export type ArbeidsgiverInput = {
    berortVedtaksperiodeId: Scalars['UUID']['input'];
    organisasjonsnummer: Scalars['String']['input'];
};

export type Arbeidsgiverinntekt = {
    __typename?: 'Arbeidsgiverinntekt';
    arbeidsgiver: Scalars['String']['output'];
    deaktivert?: Maybe<Scalars['Boolean']['output']>;
    fom?: Maybe<Scalars['LocalDate']['output']>;
    omregnetArsinntekt?: Maybe<OmregnetArsinntekt>;
    sammenligningsgrunnlag?: Maybe<Sammenligningsgrunnlag>;
    skjonnsmessigFastsatt?: Maybe<OmregnetArsinntekt>;
    tom?: Maybe<Scalars['LocalDate']['output']>;
};

export type Arbeidsgiverrefusjon = {
    __typename?: 'Arbeidsgiverrefusjon';
    arbeidsgiver: Scalars['String']['output'];
    refusjonsopplysninger: Array<Refusjonselement>;
};

export type AvsenderSystem = {
    __typename?: 'AvsenderSystem';
    navn?: Maybe<Scalars['String']['output']>;
    versjon?: Maybe<Scalars['String']['output']>;
};

export type Avslag = {
    __typename?: 'Avslag';
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
    __typename?: 'BehandledeOppgaver';
    oppgaver: Array<BehandletOppgave>;
    totaltAntallOppgaver: Scalars['Int']['output'];
};

export type BehandletOppgave = {
    __typename?: 'BehandletOppgave';
    aktorId: Scalars['String']['output'];
    antallArbeidsforhold: AntallArbeidsforhold;
    beslutter?: Maybe<Scalars['String']['output']>;
    ferdigstiltAv?: Maybe<Scalars['String']['output']>;
    ferdigstiltTidspunkt: Scalars['LocalDateTime']['output'];
    id: Scalars['String']['output'];
    oppgavetype: Oppgavetype;
    periodetype: Periodetype;
    personnavn: Personnavn;
    saksbehandler?: Maybe<Scalars['String']['output']>;
};

export type Behandlingsstatistikk = {
    __typename?: 'Behandlingsstatistikk';
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
    __typename?: 'BeregnetPeriode';
    annullering?: Maybe<Annullering>;
    annulleringskandidater: Array<Annulleringskandidat>;
    avslag: Array<Avslag>;
    behandlingId: Scalars['UUID']['output'];
    beregningId: Scalars['UUID']['output'];
    egenskaper: Array<Oppgaveegenskap>;
    erForkastet: Scalars['Boolean']['output'];
    fom: Scalars['LocalDate']['output'];
    forbrukteSykedager?: Maybe<Scalars['Int']['output']>;
    gjenstaendeSykedager?: Maybe<Scalars['Int']['output']>;
    handlinger: Array<Handling>;
    hendelser: Array<Hendelse>;
    historikkinnslag: Array<Historikkinnslag>;
    id: Scalars['UUID']['output'];
    inntektstype: Inntektstype;
    maksdato: Scalars['LocalDate']['output'];
    notater: Array<Notat>;
    oppgave?: Maybe<OppgaveForPeriodevisning>;
    opprettet: Scalars['LocalDateTime']['output'];
    paVent?: Maybe<PaVent>;
    pensjonsgivendeInntekter: Array<PensjonsgivendeInntekt>;
    periodetilstand: Periodetilstand;
    periodetype: Periodetype;
    periodevilkar: Periodevilkar;
    risikovurdering?: Maybe<Risikovurdering>;
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    tidslinje: Array<Dag>;
    tom: Scalars['LocalDate']['output'];
    totrinnsvurdering?: Maybe<Totrinnsvurdering>;
    utbetaling: Utbetaling;
    varsler: Array<VarselDto>;
    vedtakBegrunnelser: Array<VedtakBegrunnelse>;
    vedtaksperiodeId: Scalars['UUID']['output'];
    vilkarsgrunnlagId?: Maybe<Scalars['UUID']['output']>;
};

export type Dag = {
    __typename?: 'Dag';
    begrunnelser?: Maybe<Array<Begrunnelse>>;
    dato: Scalars['LocalDate']['output'];
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
    __typename?: 'DatoPeriode';
    fom: Scalars['LocalDate']['output'];
    tom: Scalars['LocalDate']['output'];
};

export type DatoPeriodeInput = {
    fom: Scalars['LocalDate']['input'];
    tom: Scalars['LocalDate']['input'];
};

export type DokumentInntektsmelding = {
    __typename?: 'DokumentInntektsmelding';
    arbeidsforholdId?: Maybe<Scalars['String']['output']>;
    arbeidsgiverperioder?: Maybe<Array<ImPeriode>>;
    avsenderSystem?: Maybe<AvsenderSystem>;
    begrunnelseForReduksjonEllerIkkeUtbetalt?: Maybe<Scalars['String']['output']>;
    beregnetInntekt?: Maybe<Scalars['Float']['output']>;
    bruttoUtbetalt?: Maybe<Scalars['Float']['output']>;
    endringIRefusjoner?: Maybe<Array<EndringIRefusjon>>;
    ferieperioder?: Maybe<Array<ImPeriode>>;
    foersteFravaersdag?: Maybe<Scalars['LocalDate']['output']>;
    gjenopptakelseNaturalytelser?: Maybe<Array<GjenopptakelseNaturalytelse>>;
    innsenderFulltNavn?: Maybe<Scalars['String']['output']>;
    innsenderTelefon?: Maybe<Scalars['String']['output']>;
    inntektEndringAarsaker?: Maybe<Array<InntektEndringAarsak>>;
    naerRelasjon?: Maybe<Scalars['Boolean']['output']>;
    opphoerAvNaturalytelser?: Maybe<Array<OpphoerAvNaturalytelse>>;
    refusjon?: Maybe<Refusjon>;
    virksomhetsnummer?: Maybe<Scalars['String']['output']>;
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
    __typename?: 'EndrePaVent';
    arsaker: Array<Scalars['String']['output']>;
    dialogRef?: Maybe<Scalars['Int']['output']>;
    frist?: Maybe<Scalars['LocalDate']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    notattekst?: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent?: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type EndringIRefusjon = {
    __typename?: 'EndringIRefusjon';
    beloep?: Maybe<Scalars['Float']['output']>;
    endringsdato?: Maybe<Scalars['LocalDate']['output']>;
};

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

export type FiltreringInput = {
    egenskaper: Array<OppgaveegenskapInput>;
    egneSaker: Scalars['Boolean']['input'];
    egneSakerPaVent: Scalars['Boolean']['input'];
    ekskluderteEgenskaper?: InputMaybe<Array<OppgaveegenskapInput>>;
    ingenUkategoriserteEgenskaper: Scalars['Boolean']['input'];
    tildelt?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FjernetFraPaVent = Historikkinnslag & {
    __typename?: 'FjernetFraPaVent';
    dialogRef?: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    saksbehandlerIdent?: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type Generasjon = {
    __typename?: 'Generasjon';
    id: Scalars['UUID']['output'];
    perioder: Array<Periode>;
};

export type GhostPeriode = {
    __typename?: 'GhostPeriode';
    deaktivert: Scalars['Boolean']['output'];
    fom: Scalars['LocalDate']['output'];
    id: Scalars['String']['output'];
    organisasjonsnummer: Scalars['String']['output'];
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    tom: Scalars['LocalDate']['output'];
    vilkarsgrunnlagId?: Maybe<Scalars['UUID']['output']>;
};

export type GjenopptakelseNaturalytelse = {
    __typename?: 'GjenopptakelseNaturalytelse';
    beloepPrMnd?: Maybe<Scalars['Float']['output']>;
    fom?: Maybe<Scalars['LocalDate']['output']>;
    naturalytelse?: Maybe<Naturalytelse>;
};

export type Handling = {
    __typename?: 'Handling';
    begrunnelse?: Maybe<Scalars['String']['output']>;
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
    dialogRef?: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    saksbehandlerIdent?: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type ImPeriode = {
    __typename?: 'IMPeriode';
    fom?: Maybe<Scalars['LocalDate']['output']>;
    tom?: Maybe<Scalars['LocalDate']['output']>;
};

export type Infotrygdutbetaling = {
    __typename?: 'Infotrygdutbetaling';
    dagsats: Scalars['Float']['output'];
    fom: Scalars['String']['output'];
    grad: Scalars['String']['output'];
    organisasjonsnummer: Scalars['String']['output'];
    tom: Scalars['String']['output'];
    typetekst: Scalars['String']['output'];
};

export type InntektEndringAarsak = {
    __typename?: 'InntektEndringAarsak';
    aarsak: Scalars['String']['output'];
    bleKjent?: Maybe<Scalars['LocalDate']['output']>;
    gjelderFra?: Maybe<Scalars['LocalDate']['output']>;
    perioder?: Maybe<Array<ImPeriode>>;
};

export type InntektFraAOrdningen = {
    __typename?: 'InntektFraAOrdningen';
    maned: Scalars['YearMonth']['output'];
    sum: Scalars['Float']['output'];
};

export type InntektHentetFraAOrdningen = Hendelse & {
    __typename?: 'InntektHentetFraAOrdningen';
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
    __typename?: 'Inntektoverstyring';
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
    __typename?: 'Inntektsmelding';
    beregnetInntekt: Scalars['Float']['output'];
    eksternDokumentId?: Maybe<Scalars['UUID']['output']>;
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
    __typename?: 'Kilde';
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
    __typename?: 'Kommentar';
    feilregistrert_tidspunkt?: Maybe<Scalars['LocalDateTime']['output']>;
    id: Scalars['Int']['output'];
    opprettet: Scalars['LocalDateTime']['output'];
    saksbehandlerident: Scalars['String']['output'];
    tekst: Scalars['String']['output'];
};

export type LagtPaVent = Historikkinnslag & {
    __typename?: 'LagtPaVent';
    arsaker: Array<Scalars['String']['output']>;
    dialogRef?: Maybe<Scalars['Int']['output']>;
    frist?: Maybe<Scalars['LocalDate']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    notattekst?: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent?: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type LeggTilTilkommenInntektResponse = {
    __typename?: 'LeggTilTilkommenInntektResponse';
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
    __typename?: 'MinimumSykdomsgradOverstyring';
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
    __typename?: 'Mutation';
    annuller: Scalars['Boolean']['output'];
    endrePaVent?: Maybe<PaVent>;
    endreTilkommenInntekt: Scalars['Boolean']['output'];
    fattVedtak: Scalars['Boolean']['output'];
    feilregistrerKommentar?: Maybe<Kommentar>;
    feilregistrerKommentarV2?: Maybe<Kommentar>;
    feilregistrerNotat?: Maybe<Notat>;
    fjernPaVent?: Maybe<Scalars['Boolean']['output']>;
    fjernTildeling: Scalars['Boolean']['output'];
    fjernTilkommenInntekt: Scalars['Boolean']['output'];
    gjenopprettTilkommenInntekt: Scalars['Boolean']['output'];
    leggPaVent?: Maybe<PaVent>;
    leggTilKommentar?: Maybe<Kommentar>;
    leggTilNotat?: Maybe<Notat>;
    leggTilTilkommenInntekt: LeggTilTilkommenInntektResponse;
    minimumSykdomsgrad?: Maybe<Scalars['Boolean']['output']>;
    oppdaterPerson: Scalars['Boolean']['output'];
    opphevStans: Scalars['Boolean']['output'];
    opphevStansAutomatiskBehandling: Scalars['Boolean']['output'];
    opprettAbonnement: Scalars['Boolean']['output'];
    opprettTildeling?: Maybe<Tildeling>;
    overstyrArbeidsforhold?: Maybe<Scalars['Boolean']['output']>;
    overstyrDager?: Maybe<Scalars['Boolean']['output']>;
    overstyrInntektOgRefusjon?: Maybe<Scalars['Boolean']['output']>;
    sendIRetur?: Maybe<Scalars['Boolean']['output']>;
    sendTilGodkjenningV2?: Maybe<Scalars['Boolean']['output']>;
    sendTilInfotrygd: Scalars['Boolean']['output'];
    settVarselstatus?: Maybe<VarselDto>;
    skjonnsfastsettSykepengegrunnlag?: Maybe<Scalars['Boolean']['output']>;
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
    __typename?: 'Notat';
    dialogRef: Scalars['Int']['output'];
    feilregistrert: Scalars['Boolean']['output'];
    feilregistrert_tidspunkt?: Maybe<Scalars['LocalDateTime']['output']>;
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
    __typename?: 'OmregnetArsinntekt';
    belop: Scalars['Float']['output'];
    inntektFraAOrdningen?: Maybe<Array<InntektFraAOrdningen>>;
    kilde: Inntektskilde;
    manedsbelop: Scalars['Float']['output'];
};

export type OppgaveForPeriodevisning = {
    __typename?: 'OppgaveForPeriodevisning';
    id: Scalars['String']['output'];
};

export type OppgaveTilBehandling = {
    __typename?: 'OppgaveTilBehandling';
    aktorId: Scalars['String']['output'];
    antallArbeidsforhold: AntallArbeidsforhold;
    egenskaper: Array<Oppgaveegenskap>;
    id: Scalars['String']['output'];
    mottaker: Mottaker;
    navn: Personnavn;
    oppgavetype: Oppgavetype;
    opprettet: Scalars['LocalDateTime']['output'];
    opprinneligSoknadsdato: Scalars['LocalDateTime']['output'];
    paVentInfo?: Maybe<PaVentInfo>;
    periodetype: Periodetype;
    tidsfrist?: Maybe<Scalars['LocalDate']['output']>;
    tildeling?: Maybe<Tildeling>;
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export type Oppgaveegenskap = {
    __typename?: 'Oppgaveegenskap';
    egenskap: Egenskap;
    kategori: Kategori;
};

export type OppgaveegenskapInput = {
    egenskap: Egenskap;
    kategori: Kategori;
};

export type OppgaverTilBehandling = {
    __typename?: 'OppgaverTilBehandling';
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
    __typename?: 'OpphevStansAutomatiskBehandlingSaksbehandler';
    dialogRef?: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    notattekst?: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent?: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type OpphoerAvNaturalytelse = {
    __typename?: 'OpphoerAvNaturalytelse';
    beloepPrMnd?: Maybe<Scalars['Float']['output']>;
    fom?: Maybe<Scalars['LocalDate']['output']>;
    naturalytelse?: Maybe<Naturalytelse>;
};

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
    PersonKlarTilBehandling = 'PERSON_KLAR_TIL_BEHANDLING',
    RevurderingAvvist = 'REVURDERING_AVVIST',
    RevurderingFerdigbehandlet = 'REVURDERING_FERDIGBEHANDLET',
    UtbetalingAnnulleringFeilet = 'UTBETALING_ANNULLERING_FEILET',
    UtbetalingAnnulleringOk = 'UTBETALING_ANNULLERING_OK',
}

export type Organisasjon = {
    __typename?: 'Organisasjon';
    navn?: Maybe<Scalars['String']['output']>;
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
    __typename?: 'OverstyrtDag';
    dato: Scalars['LocalDate']['output'];
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
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
};

export type OverstyrtMinimumSykdomsgrad = {
    __typename?: 'OverstyrtMinimumSykdomsgrad';
    begrunnelse: Scalars['String']['output'];
    /** @deprecated Bruk vedtaksperiodeId i stedet */
    initierendeVedtaksperiodeId: Scalars['UUID']['output'];
    perioderVurdertIkkeOk: Array<OverstyrtMinimumSykdomsgradPeriode>;
    perioderVurdertOk: Array<OverstyrtMinimumSykdomsgradPeriode>;
};

export type OverstyrtMinimumSykdomsgradPeriode = {
    __typename?: 'OverstyrtMinimumSykdomsgradPeriode';
    fom: Scalars['LocalDate']['output'];
    tom: Scalars['LocalDate']['output'];
};

export type PaVent = {
    __typename?: 'PaVent';
    frist?: Maybe<Scalars['LocalDate']['output']>;
    oid: Scalars['UUID']['output'];
};

export type PaVentArsakInput = {
    _key: Scalars['String']['input'];
    arsak: Scalars['String']['input'];
};

export type PaVentInfo = {
    __typename?: 'PaVentInfo';
    arsaker: Array<Scalars['String']['output']>;
    dialogRef: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    opprettet: Scalars['LocalDateTime']['output'];
    saksbehandler: Scalars['String']['output'];
    tekst?: Maybe<Scalars['String']['output']>;
    tidsfrist: Scalars['LocalDate']['output'];
};

export type PensjonsgivendeInntekt = {
    __typename?: 'PensjonsgivendeInntekt';
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
    __typename?: 'PeriodeHistorikkElementNy';
    dialogRef?: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    saksbehandlerIdent?: Maybe<Scalars['String']['output']>;
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
    AvventerAnnullering = 'AvventerAnnullering',
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
    __typename?: 'Periodevilkar';
    alder: Alder;
    sykepengedager: Sykepengedager;
};

export type Person = {
    __typename?: 'Person';
    aktorId: Scalars['String']['output'];
    arbeidsgivere: Array<Arbeidsgiver>;
    dodsdato?: Maybe<Scalars['LocalDate']['output']>;
    enhet: Enhet;
    fodselsnummer: Scalars['String']['output'];
    infotrygdutbetalinger?: Maybe<Array<Infotrygdutbetaling>>;
    personinfo: Personinfo;
    tildeling?: Maybe<Tildeling>;
    tilleggsinfoForInntektskilder: Array<TilleggsinfoForInntektskilde>;
    versjon: Scalars['Int']['output'];
    vilkarsgrunnlagV2: Array<VilkarsgrunnlagV2>;
};

export type Personinfo = {
    __typename?: 'Personinfo';
    adressebeskyttelse: Adressebeskyttelse;
    automatiskBehandlingStansetAvSaksbehandler?: Maybe<Scalars['Boolean']['output']>;
    etternavn: Scalars['String']['output'];
    fodselsdato: Scalars['LocalDate']['output'];
    fornavn: Scalars['String']['output'];
    fullmakt?: Maybe<Scalars['Boolean']['output']>;
    kjonn: Kjonn;
    mellomnavn?: Maybe<Scalars['String']['output']>;
    reservasjon?: Maybe<Reservasjon>;
    unntattFraAutomatisering?: Maybe<UnntattFraAutomatiskGodkjenning>;
};

export type Personnavn = {
    __typename?: 'Personnavn';
    etternavn: Scalars['String']['output'];
    fornavn: Scalars['String']['output'];
    mellomnavn?: Maybe<Scalars['String']['output']>;
};

export type Query = {
    __typename?: 'Query';
    antallOppgaver: AntallOppgaver;
    behandledeOppgaverFeed: BehandledeOppgaver;
    behandlingsstatistikk: Behandlingsstatistikk;
    hentInntektsmelding?: Maybe<DokumentInntektsmelding>;
    hentSaksbehandlere: Array<Saksbehandler>;
    hentSoknad?: Maybe<Soknad>;
    oppgaveFeed: OppgaverTilBehandling;
    opptegnelser: Array<Opptegnelse>;
    organisasjon?: Maybe<Organisasjon>;
    person?: Maybe<Person>;
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
    __typename?: 'Refusjon';
    beloepPrMnd?: Maybe<Scalars['Float']['output']>;
    opphoersdato?: Maybe<Scalars['LocalDate']['output']>;
};

export type Refusjonselement = {
    __typename?: 'Refusjonselement';
    belop: Scalars['Float']['output'];
    fom: Scalars['LocalDate']['output'];
    meldingsreferanseId: Scalars['UUID']['output'];
    tom?: Maybe<Scalars['LocalDate']['output']>;
};

export type Refusjonsopplysning = {
    __typename?: 'Refusjonsopplysning';
    belop: Scalars['Float']['output'];
    fom: Scalars['LocalDate']['output'];
    tom?: Maybe<Scalars['LocalDate']['output']>;
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

export type SaksbehandlerInput = {
    ident?: InputMaybe<Scalars['String']['input']>;
    navn: Scalars['String']['input'];
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
    tidsstempel: Scalars['LocalDateTime']['output'];
    totalbelop?: Maybe<Scalars['Int']['output']>;
    utbetalingslinjer: Array<Simuleringslinje>;
};

export type Simuleringsdetaljer = {
    __typename?: 'Simuleringsdetaljer';
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
    __typename?: 'Simuleringslinje';
    dagsats: Scalars['Int']['output'];
    fom: Scalars['LocalDate']['output'];
    grad: Scalars['Int']['output'];
    tom: Scalars['LocalDate']['output'];
};

export type Simuleringsperiode = {
    __typename?: 'Simuleringsperiode';
    fom: Scalars['LocalDate']['output'];
    tom: Scalars['LocalDate']['output'];
    utbetalinger: Array<Simuleringsutbetaling>;
};

export type Simuleringsutbetaling = {
    __typename?: 'Simuleringsutbetaling';
    detaljer: Array<Simuleringsdetaljer>;
    feilkonto: Scalars['Boolean']['output'];
    forfall: Scalars['LocalDate']['output'];
    mottakerId: Scalars['String']['output'];
    mottakerNavn: Scalars['String']['output'];
};

export type SkjonnsfastsattSykepengegrunnlag = {
    __typename?: 'SkjonnsfastsattSykepengegrunnlag';
    arlig: Scalars['Float']['output'];
    arsak: Scalars['String']['output'];
    begrunnelse?: Maybe<Scalars['String']['output']>;
    begrunnelseFritekst?: Maybe<Scalars['String']['output']>;
    begrunnelseKonklusjon?: Maybe<Scalars['String']['output']>;
    begrunnelseMal?: Maybe<Scalars['String']['output']>;
    fraArlig?: Maybe<Scalars['Float']['output']>;
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    type?: Maybe<Skjonnsfastsettingstype>;
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
    __typename?: 'Soknad';
    arbeidGjenopptatt?: Maybe<Scalars['LocalDate']['output']>;
    egenmeldingsdagerFraSykmelding?: Maybe<Array<Scalars['LocalDate']['output']>>;
    soknadsperioder?: Maybe<Array<Soknadsperioder>>;
    sporsmal?: Maybe<Array<Sporsmal>>;
    sykmeldingSkrevet?: Maybe<Scalars['LocalDateTime']['output']>;
    type?: Maybe<Soknadstype>;
};

export type SoknadArbeidsgiver = Hendelse & {
    __typename?: 'SoknadArbeidsgiver';
    eksternDokumentId?: Maybe<Scalars['UUID']['output']>;
    fom: Scalars['LocalDate']['output'];
    id: Scalars['UUID']['output'];
    rapportertDato: Scalars['LocalDateTime']['output'];
    sendtArbeidsgiver: Scalars['LocalDateTime']['output'];
    tom: Scalars['LocalDate']['output'];
    type: Hendelsetype;
};

export type SoknadArbeidsledig = Hendelse & {
    __typename?: 'SoknadArbeidsledig';
    eksternDokumentId?: Maybe<Scalars['UUID']['output']>;
    fom: Scalars['LocalDate']['output'];
    id: Scalars['UUID']['output'];
    rapportertDato: Scalars['LocalDateTime']['output'];
    sendtNav: Scalars['LocalDateTime']['output'];
    tom: Scalars['LocalDate']['output'];
    type: Hendelsetype;
};

export type SoknadFrilans = Hendelse & {
    __typename?: 'SoknadFrilans';
    eksternDokumentId?: Maybe<Scalars['UUID']['output']>;
    fom: Scalars['LocalDate']['output'];
    id: Scalars['UUID']['output'];
    rapportertDato: Scalars['LocalDateTime']['output'];
    sendtNav: Scalars['LocalDateTime']['output'];
    tom: Scalars['LocalDate']['output'];
    type: Hendelsetype;
};

export type SoknadNav = Hendelse & {
    __typename?: 'SoknadNav';
    eksternDokumentId?: Maybe<Scalars['UUID']['output']>;
    fom: Scalars['LocalDate']['output'];
    id: Scalars['UUID']['output'];
    rapportertDato: Scalars['LocalDateTime']['output'];
    sendtNav: Scalars['LocalDateTime']['output'];
    tom: Scalars['LocalDate']['output'];
    type: Hendelsetype;
};

export type SoknadSelvstendig = Hendelse & {
    __typename?: 'SoknadSelvstendig';
    eksternDokumentId?: Maybe<Scalars['UUID']['output']>;
    fom: Scalars['LocalDate']['output'];
    id: Scalars['UUID']['output'];
    rapportertDato: Scalars['LocalDateTime']['output'];
    sendtNav: Scalars['LocalDateTime']['output'];
    tom: Scalars['LocalDate']['output'];
    type: Hendelsetype;
};

export type Soknadsperioder = {
    __typename?: 'Soknadsperioder';
    faktiskGrad?: Maybe<Scalars['Int']['output']>;
    fom: Scalars['LocalDate']['output'];
    grad?: Maybe<Scalars['Int']['output']>;
    sykmeldingsgrad?: Maybe<Scalars['Int']['output']>;
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
    __typename?: 'Sporsmal';
    kriterieForVisningAvUndersporsmal?: Maybe<Visningskriterium>;
    sporsmalstekst?: Maybe<Scalars['String']['output']>;
    svar?: Maybe<Array<Svar>>;
    svartype?: Maybe<Svartype>;
    tag?: Maybe<Scalars['String']['output']>;
    undersporsmal?: Maybe<Array<Sporsmal>>;
    undertekst?: Maybe<Scalars['String']['output']>;
};

export type StansAutomatiskBehandlingSaksbehandler = Historikkinnslag & {
    __typename?: 'StansAutomatiskBehandlingSaksbehandler';
    dialogRef?: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    notattekst?: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent?: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type Svar = {
    __typename?: 'Svar';
    verdi?: Maybe<Scalars['String']['output']>;
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
    __typename?: 'Sykepengedager';
    forbrukteSykedager?: Maybe<Scalars['Int']['output']>;
    gjenstaendeSykedager?: Maybe<Scalars['Int']['output']>;
    maksdato: Scalars['LocalDate']['output'];
    oppfylt: Scalars['Boolean']['output'];
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
};

export type Sykepengegrunnlagsgrense = {
    __typename?: 'Sykepengegrunnlagsgrense';
    grense: Scalars['Int']['output'];
    grunnbelop: Scalars['Int']['output'];
    virkningstidspunkt: Scalars['LocalDate']['output'];
};

export type Sykepengegrunnlagskjonnsfastsetting = Overstyring & {
    __typename?: 'Sykepengegrunnlagskjonnsfastsetting';
    ferdigstilt: Scalars['Boolean']['output'];
    hendelseId: Scalars['UUID']['output'];
    saksbehandler: Saksbehandler;
    skjonnsfastsatt: SkjonnsfastsattSykepengegrunnlag;
    timestamp: Scalars['LocalDateTime']['output'];
    vedtaksperiodeId: Scalars['UUID']['output'];
};

export type Sykmelding = Hendelse & {
    __typename?: 'Sykmelding';
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
    __typename?: 'Tildeling';
    epost: Scalars['String']['output'];
    navn: Scalars['String']['output'];
    oid: Scalars['UUID']['output'];
};

export type TilkommenInntekt = {
    __typename?: 'TilkommenInntekt';
    ekskluderteUkedager: Array<Scalars['LocalDate']['output']>;
    erDelAvAktivTotrinnsvurdering: Scalars['Boolean']['output'];
    events: Array<TilkommenInntektEvent>;
    fjernet: Scalars['Boolean']['output'];
    periode: DatoPeriode;
    periodebelop: Scalars['BigDecimal']['output'];
    tilkommenInntektId: Scalars['UUID']['output'];
};

export type TilkommenInntektEndretEvent = TilkommenInntektEvent & {
    __typename?: 'TilkommenInntektEndretEvent';
    endringer: TilkommenInntektEventEndringer;
    metadata: TilkommenInntektEventMetadata;
};

export type TilkommenInntektEvent = {
    metadata: TilkommenInntektEventMetadata;
};

export type TilkommenInntektEventBigDecimalEndring = {
    __typename?: 'TilkommenInntektEventBigDecimalEndring';
    fra: Scalars['BigDecimal']['output'];
    til: Scalars['BigDecimal']['output'];
};

export type TilkommenInntektEventDatoPeriodeEndring = {
    __typename?: 'TilkommenInntektEventDatoPeriodeEndring';
    fra: DatoPeriode;
    til: DatoPeriode;
};

export type TilkommenInntektEventEndringer = {
    __typename?: 'TilkommenInntektEventEndringer';
    ekskluderteUkedager?: Maybe<TilkommenInntektEventListLocalDateEndring>;
    organisasjonsnummer?: Maybe<TilkommenInntektEventStringEndring>;
    periode?: Maybe<TilkommenInntektEventDatoPeriodeEndring>;
    periodebelop?: Maybe<TilkommenInntektEventBigDecimalEndring>;
};

export type TilkommenInntektEventListLocalDateEndring = {
    __typename?: 'TilkommenInntektEventListLocalDateEndring';
    fra: Array<Scalars['LocalDate']['output']>;
    til: Array<Scalars['LocalDate']['output']>;
};

export type TilkommenInntektEventMetadata = {
    __typename?: 'TilkommenInntektEventMetadata';
    notatTilBeslutter: Scalars['String']['output'];
    sekvensnummer: Scalars['Int']['output'];
    tidspunkt: Scalars['LocalDateTime']['output'];
    utfortAvSaksbehandlerIdent: Scalars['String']['output'];
};

export type TilkommenInntektEventStringEndring = {
    __typename?: 'TilkommenInntektEventStringEndring';
    fra: Scalars['String']['output'];
    til: Scalars['String']['output'];
};

export type TilkommenInntektFjernetEvent = TilkommenInntektEvent & {
    __typename?: 'TilkommenInntektFjernetEvent';
    metadata: TilkommenInntektEventMetadata;
};

export type TilkommenInntektGjenopprettetEvent = TilkommenInntektEvent & {
    __typename?: 'TilkommenInntektGjenopprettetEvent';
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
    __typename?: 'TilkommenInntektOpprettetEvent';
    ekskluderteUkedager: Array<Scalars['LocalDate']['output']>;
    metadata: TilkommenInntektEventMetadata;
    organisasjonsnummer: Scalars['String']['output'];
    periode: DatoPeriode;
    periodebelop: Scalars['BigDecimal']['output'];
};

export type TilkommenInntektskilde = {
    __typename?: 'TilkommenInntektskilde';
    inntekter: Array<TilkommenInntekt>;
    organisasjonsnummer: Scalars['String']['output'];
};

export type TilleggsinfoForInntektskilde = {
    __typename?: 'TilleggsinfoForInntektskilde';
    navn: Scalars['String']['output'];
    orgnummer: Scalars['String']['output'];
};

export type Totrinnsvurdering = {
    __typename?: 'Totrinnsvurdering';
    beslutter?: Maybe<Scalars['UUID']['output']>;
    erBeslutteroppgave: Scalars['Boolean']['output'];
    erRetur: Scalars['Boolean']['output'];
    saksbehandler?: Maybe<Scalars['UUID']['output']>;
};

export type TotrinnsvurderingRetur = Historikkinnslag & {
    __typename?: 'TotrinnsvurderingRetur';
    dialogRef?: Maybe<Scalars['Int']['output']>;
    id: Scalars['Int']['output'];
    kommentarer: Array<Kommentar>;
    notattekst?: Maybe<Scalars['String']['output']>;
    saksbehandlerIdent?: Maybe<Scalars['String']['output']>;
    timestamp: Scalars['LocalDateTime']['output'];
    type: PeriodehistorikkType;
};

export type UberegnetPeriode = Periode & {
    __typename?: 'UberegnetPeriode';
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
    __typename?: 'UnntattFraAutomatiskGodkjenning';
    arsaker: Array<Scalars['String']['output']>;
    erUnntatt: Scalars['Boolean']['output'];
    tidspunkt?: Maybe<Scalars['LocalDateTime']['output']>;
};

export type Utbetaling = {
    __typename?: 'Utbetaling';
    arbeidsgiverFagsystemId: Scalars['String']['output'];
    arbeidsgiverNettoBelop: Scalars['Int']['output'];
    arbeidsgiversimulering?: Maybe<Simulering>;
    id: Scalars['UUID']['output'];
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
    definisjonId: Scalars['UUID']['output'];
    forklaring?: Maybe<Scalars['String']['output']>;
    generasjonId: Scalars['UUID']['output'];
    handling?: Maybe<Scalars['String']['output']>;
    kode: Scalars['String']['output'];
    opprettet: Scalars['LocalDateTime']['output'];
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
    tidsstempel: Scalars['LocalDateTime']['output'];
};

export type VedtakBegrunnelse = {
    __typename?: 'VedtakBegrunnelse';
    begrunnelse?: Maybe<Scalars['String']['output']>;
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
    __typename?: 'VilkarsgrunnlagAvviksvurdering';
    avviksprosent: Scalars['BigDecimal']['output'];
    beregningsgrunnlag: Scalars['BigDecimal']['output'];
    sammenligningsgrunnlag: Scalars['BigDecimal']['output'];
};

export type VilkarsgrunnlagInfotrygdV2 = VilkarsgrunnlagV2 & {
    __typename?: 'VilkarsgrunnlagInfotrygdV2';
    arbeidsgiverrefusjoner: Array<Arbeidsgiverrefusjon>;
    id: Scalars['UUID']['output'];
    inntekter: Array<Arbeidsgiverinntekt>;
    omregnetArsinntekt: Scalars['Float']['output'];
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    sykepengegrunnlag: Scalars['Float']['output'];
};

export type VilkarsgrunnlagSpleisV2 = VilkarsgrunnlagV2 & {
    __typename?: 'VilkarsgrunnlagSpleisV2';
    antallOpptjeningsdagerErMinst: Scalars['Int']['output'];
    arbeidsgiverrefusjoner: Array<Arbeidsgiverrefusjon>;
    avviksvurdering?: Maybe<VilkarsgrunnlagAvviksvurdering>;
    beregningsgrunnlag: Scalars['BigDecimal']['output'];
    grunnbelop: Scalars['Int']['output'];
    id: Scalars['UUID']['output'];
    inntekter: Array<Arbeidsgiverinntekt>;
    oppfyllerKravOmMinstelonn: Scalars['Boolean']['output'];
    oppfyllerKravOmOpptjening: Scalars['Boolean']['output'];
    opptjeningFra: Scalars['LocalDate']['output'];
    skjaeringstidspunkt: Scalars['LocalDate']['output'];
    skjonnsmessigFastsattAarlig?: Maybe<Scalars['Float']['output']>;
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
    __typename?: 'Vurdering';
    automatisk: Scalars['Boolean']['output'];
    godkjent: Scalars['Boolean']['output'];
    ident: Scalars['String']['output'];
    tidsstempel: Scalars['LocalDateTime']['output'];
};
