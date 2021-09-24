declare type Dayjs = import('dayjs').Dayjs;

declare type Revurderingtilstand = 'revurderes' | 'revurdert' | 'ukjent';

declare type Infotrygdperiodetilstand = 'utbetaltIInfotrygd' | 'infotrygdferie' | 'infotrygdukjent';

declare type Periode = {
    fom: Dayjs;
    tom: Dayjs;
};

declare type Dag = {
    dato: Dayjs;
    type:
        | 'Syk'
        | 'Helg'
        | 'Ferie'
        | 'Avslått'
        | 'Ubestemt'
        | 'Arbeidsdag'
        | 'Egenmelding'
        | 'Foreldet'
        | 'Arbeidsgiverperiode'
        | 'Annullert'
        | 'Permisjon';
    gradering?: number;
};

declare type Sykdomsdag = Dag & {
    kildeId?: string;
    kilde?: 'Sykmelding' | 'Søknad' | 'Inntektsmelding' | 'Saksbehandler' | 'Aordningen' | 'Ainntekt' | 'Ukjent';
};

declare type Avvisning = {
    tekst:
        | 'EtterDødsdato'
        | 'EgenmeldingUtenforArbeidsgiverperiode'
        | 'MinimumSykdomsgrad'
        | 'MinimumInntekt'
        | 'ManglerOpptjening'
        | 'ManglerMedlemskap'
        | 'SykepengedagerOppbrukt';
    paragraf?: string;
};

declare type Utbetalingsdag = Dag & {
    totalGradering?: number;
    utbetaling?: number;
    avvistÅrsaker?: Avvisning[];
};

declare type UtbetalingshistorikkElement = {
    status:
        | 'IKKE_UTBETALT'
        | 'IKKE_GODKJENT'
        | 'GODKJENT'
        | 'SENDT'
        | 'OVERFØRT'
        | 'UTBETALT'
        | 'GODKJENT_UTEN_UTBETALING'
        | 'UTBETALING_FEILET'
        | 'ANNULLERT'
        | 'UKJENT';
    type: 'UTBETALING' | 'ANNULLERING' | 'ETTERUTBETALING' | 'REVURDERING' | 'UKJENT';
    utbetalingstidslinje: Utbetalingsdag[];
    maksdato: Dayjs;
    gjenståendeDager: number;
    forbrukteDager: number;
    arbeidsgiverNettobeløp: number;
    arbeidsgiverFagsystemId: string;
    personNettobeløp: number;
    personFagsystemId: string;
    vurdering?: {
        godkjent: boolean;
        tidsstempel: Dayjs;
        automatisk: boolean;
        ident: string;
    };
};

declare type HistorikkElement = {
    id: string;
    beregnettidslinje: Sykdomsdag[];
    hendelsetidslinje: Sykdomsdag[];
    utbetaling: UtbetalingshistorikkElement;
    kilde: string;
    tidsstempel: Dayjs;
};

declare type Inntektskilde = 'EN_ARBEIDSGIVER' | 'FLERE_ARBEIDSGIVERE' | 'UKJENT';

declare type Periodetype =
    | 'forlengelse'
    | 'førstegangsbehandling'
    | 'infotrygdforlengelse'
    | 'overgangFraIt'
    | 'stikkprøve'
    | 'riskQa'
    | 'revurdering';

declare type Periodetilstand =
    | 'tilUtbetaling'
    | 'utbetalt'
    | 'oppgaver'
    | 'venter'
    | 'venterPåKiling'
    | 'avslag'
    | 'ingenUtbetaling'
    | 'kunFerie'
    | 'kunPermisjon'
    | 'feilet'
    | 'ukjent'
    | 'tilInfotrygd'
    | 'annullert'
    | 'tilAnnullering'
    | 'annulleringFeilet'
    | 'utbetaltAutomatisk'
    | 'tilUtbetalingAutomatisk';

declare type Tidslinjetilstand = Periodetilstand | 'revurderes' | 'revurdert' | 'revurdertIngenUtbetaling';

declare type Tidslinjeperiode = {
    id: string;
    unique: string;
    beregningId: string;
    fom: Dayjs;
    tom: Dayjs;
    type: 'VEDTAKSPERIODE' | 'REVURDERING' | 'ANNULLERT_PERIODE' | 'UFULLSTENDIG';
    tilstand: Tidslinjetilstand;
    inntektskilde: Inntektskilde;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    organisasjonsnummer: string;
    fullstendig: boolean;
    opprettet: Dayjs;
    fagsystemId?: string;
    oppgavereferanse?: string;
};

declare type Basisvilkår = {
    oppfylt?: boolean;
};

declare type DagerIgjen = Basisvilkår & {
    dagerBrukt?: number;
    skjæringstidspunkt: Dayjs;
    førsteSykepengedag?: Dayjs;
    maksdato?: Dayjs;
    gjenståendeDager?: number;
    tidligerePerioder: Periode[];
};

declare type Søknadsfrist = Basisvilkår & {
    søknadFom?: Dayjs;
    sendtNav?: Dayjs;
};

declare type Opptjening = Basisvilkår & {
    antallOpptjeningsdagerErMinst: number;
    opptjeningFra: Dayjs;
};

declare type Alder = Basisvilkår & {
    alderSisteSykedag: number;
};

declare type Vilkår = {
    alder: Alder;
    dagerIgjen: DagerIgjen;
    sykepengegrunnlag: SykepengegrunnlagVilkår;
    opptjening?: Opptjening | Basisvilkår;
    søknadsfrist?: Søknadsfrist;
    medlemskap?: Basisvilkår;
};

declare type SykepengegrunnlagVilkår = Basisvilkår & {
    sykepengegrunnlag?: number;
    grunnebeløp: number;
};

declare type Arbeidsforhold = {
    stillingstittel: string;
    stillingsprosent: number;
    startdato: Dayjs;
    sluttdato?: Dayjs;
};

declare type Søknad = {
    id: string;
    type: 'Søknad';
    fom: Dayjs;
    tom: Dayjs;
    rapportertDato?: Dayjs;
    sendtNav: Dayjs;
};

declare type Sykmelding = {
    id: string;
    type: 'Sykmelding';
    fom: Dayjs;
    tom: Dayjs;
    rapportertDato?: Dayjs;
};

declare type Inntektsmelding = {
    id: string;
    type: 'Inntektsmelding';
    beregnetInntekt: number;
    mottattTidspunkt: Dayjs;
};

declare type Dokument = Søknad | Sykmelding | Inntektsmelding;

declare type InntekterFraAOrdningen = {
    måned: string;
    sum: number;
};

declare type OmregnetÅrsinntekt = {
    kilde: 'Saksbehandler' | 'Inntektsmelding' | 'Infotrygd' | 'AOrdningen';
    beløp: number;
    månedsbeløp: number;
    inntekterFraAOrdningen?: InntekterFraAOrdningen[];
};

declare type Sammenligningsgrunnlag = {
    beløp: number;
    inntekterFraAOrdningen: InntekterFraAOrdningen[];
};

declare type Arbeidsgiverinntekt = {
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
    omregnetÅrsinntekt?: OmregnetÅrsinntekt;
    sammenligningsgrunnlag?: Sammenligningsgrunnlag;
    bransjer: string[];
    forskuttering: boolean;
    refusjon: boolean;
    arbeidsforhold: Arbeidsforhold[];
};

declare type Inntektsgrunnlag = {
    organisasjonsnummer: string;
    skjæringstidspunkt: Dayjs;
    sykepengegrunnlag?: number;
    omregnetÅrsinntekt?: number;
    sammenligningsgrunnlag?: number;
    avviksprosent?: number;
    maksUtbetalingPerDag?: number;
    inntekter: Arbeidsgiverinntekt[];
};

declare type Faresignal = {
    kreverSupersaksbehandler: boolean;
    beskrivelse: string;
    kategori: string[];
};

declare type OverstyrtDag = Dag & {
    grad?: number;
};

declare type Dagoverstyring = {
    begrunnelse: string;
    navn: string;
    timestamp: Dayjs;
    dato?: Dayjs;
    ident?: string;
    type?: Dag['type'];
    grad?: number;
};

declare type Overstyring = {
    hendelseId: string;
    begrunnelse: string;
    timestamp: Dayjs;
    overstyrteDager: OverstyrtDag[];
    saksbehandlerNavn: string;
    saksbehandlerIdent?: string;
};

declare type Simuleringsutbetalingdetalj = {
    sats: number;
    konto: string;
    belop: number;
    typeSats: string;
    uforegrad: number;
    antallSats: number;
    faktiskFom: string;
    faktiskTom: string;
    klassekode: string;
    tilbakeforing: boolean;
    refunderesOrgNr: string;
    utbetalingsType: string;
    klassekodeBeskrivelse: string;
};

declare type Simuleringsutbetaling = {
    forfall: string;
    detaljer: Simuleringsutbetalingdetalj[];
    feilkonto: boolean;
    utbetalesTilId: string;
    utbetalesTilNavn: string;
};

declare type Simuleringsperiode = {
    fom: string;
    tom: string;
    utbetalinger: Simuleringsutbetaling[];
};

declare type Utbetalingslinje = {
    fom: Dayjs;
    tom: Dayjs;
    dagsats: number;
    grad: number;
};

declare type Utbetaling = {
    fagsystemId: string;
    linjer: Utbetalingslinje[];
};

declare type Vedtaksperiode = {
    id: string;
    fom: Dayjs;
    tom: Dayjs;
    gruppeId: string;
    arbeidsgivernavn: string;
    forlengelseFraInfotrygd?: boolean;
    periodetype: Periodetype;
    behandlet: boolean;
    tilstand: Periodetilstand;
    oppgavereferanse?: string;
    fullstendig: boolean;
    erForkastet: boolean;
    utbetalingsreferanse?: string;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    automatiskBehandlet: boolean;
    godkjentAv?: string;
    godkjenttidspunkt?: Dayjs;
    vilkår?: Vilkår;
    inntektsgrunnlag: Inntektsgrunnlag;
    utbetalinger?: {
        arbeidsgiverUtbetaling?: Utbetaling;
        personUtbetaling?: Utbetaling;
    };
    oppsummering: {
        antallUtbetalingsdager: number;
        totaltTilUtbetaling: number;
    };
    simuleringsdata?: {
        totalbeløp: number;
        perioder: Simuleringsperiode[];
    };
    hendelser: Dokument[];
    aktivitetslog: string[];
    risikovurdering?: {
        funn: Faresignal[];
        kontrollertOk: Faresignal[];
    };
    overstyringer: Overstyring[];
    erNyeste: boolean;
    beregningIder: string[];
    inntektskilde: Inntektskilde;
};

declare type UfullstendigVedtaksperiode = {
    id: string;
    fom: Dayjs;
    tom: Dayjs;
    fullstendig: boolean;
    tilstand: Periodetilstand;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje?: Sykdomsdag[];
    erNyeste?: boolean;
    beregningIder?: string[];
};

declare type Arbeidsgiver = {
    organisasjonsnummer: string;
    id: string;
    navn: string;
    utbetalingshistorikk: HistorikkElement[];
    tidslinjeperioder: Tidslinjeperiode[][];
    vedtaksperioder: (Vedtaksperiode | UfullstendigVedtaksperiode)[];
    arbeidsforhold: Arbeidsforhold[];
};

declare type UtbetalingshistorikkUtbetaling = {
    status: string;
    type: string;
    arbeidsgiverOppdrag: {
        orgnummer: string;
        fagsystemId: string;
        utbetalingslinjer: Periode[];
    };
    annullering?: {
        annullertTidspunkt: Dayjs;
        saksbehandlerNavn: string;
    };
    totalbeløp: number | null;
};

declare type Infotrygdutbetaling = {
    fom: Dayjs;
    tom: Dayjs;
    grad?: number;
    dagsats?: number;
    typetekst: 'Ferie' | 'Utbetaling' | 'ArbRef' | 'Ukjent' | 'Tilbakeført';
    organisasjonsnummer: string;
};

declare type Saksbehandler = {
    oid: string;
    epost: string;
    navn: string;
};

declare type Boenhet = {
    id: string;
    navn: string;
};

declare type Personinfo = {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    fødselsdato: Dayjs | null;
    kjønn: 'mann' | 'kvinne' | 'ukjent';
    fnr?: string;
};

declare type Tildeling = {
    saksbehandler: Saksbehandler;
    påVent: boolean;
};

declare type Person = {
    aktørId: string;
    arbeidsgivere: Arbeidsgiver[];
    utbetalinger: UtbetalingshistorikkUtbetaling[];
    personinfo: Personinfo;
    fødselsnummer: string;
    infotrygdutbetalinger: Infotrygdutbetaling[];
    enhet: Boenhet;
    dødsdato?: Dayjs;
    tildeling?: Tildeling;
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
        manuelt: number;
        automatisk: number;
        annulleringer: number;
    };
};

declare type Notat = {
    id: string;
    tekst: string;
    saksbehandler: Saksbehandler;
    opprettet: Dayjs;
    vedtaksperiodeId: string;
    feilregistrert: boolean;
};

declare type SpeilError = {
    message: string;
    statusCode?: number;
    technical?: string;
};

declare type OpptegnelseType =
    | 'UTBETALING_ANNULLERING_FEILET'
    | 'UTBETALING_ANNULLERING_OK'
    | 'NY_SAKSBEHANDLEROPPGAVE';

declare type Opptegnelse = {
    aktørId: number;
    sekvensnummer: number;
    type: OpptegnelseType;
    payload: string;
};
