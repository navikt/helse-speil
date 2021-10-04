declare type ExternalUtbetalingslinje = {
    fom: string;
    tom: string;
    dagsats: number;
    grad: number;
};

declare type ExternalUtbetaling = {
    fagsystemId: string;
    linjer: ExternalUtbetalingslinje[];
};

declare type ExternalUtbetalingsdagtype =
    | 'ArbeidsgiverperiodeDag'
    | 'NavDag'
    | 'NavHelgDag'
    | 'Arbeidsdag'
    | 'Feriedag'
    | 'Helgedag'
    | 'UkjentDag'
    | 'AvvistDag'
    | 'ForeldetDag';

declare type ExternalUtbetalingsdag = {
    type: ExternalUtbetalingsdagtype;
    inntekt: number;
    dato: string;
    utbetaling?: number;
    grad?: number;
    totalGrad?: number;
    begrunnelser?: string[];
};

declare type ExternalSykdomsdagtype =
    | 'ARBEIDSDAG'
    | 'ARBEIDSGIVERDAG'
    | 'FERIEDAG'
    | 'FORELDET_SYKEDAG'
    | 'FRISK_HELGEDAG'
    | 'IMPLISITT_DAG'
    | 'PERMISJONSDAG'
    | 'STUDIEDAG'
    | 'SYKEDAG'
    | 'SYK_HELGEDAG'
    | 'UBESTEMTDAG'
    | 'UTENLANDSDAG'
    | 'ARBEIDSDAG_INNTEKTSMELDING'
    | 'ARBEIDSDAG_SØKNAD'
    | 'EGENMELDINGSDAG_INNTEKTSMELDING'
    | 'EGENMELDINGSDAG_SØKNAD'
    | 'FERIEDAG_INNTEKTSMELDING'
    | 'FERIEDAG_SØKNAD'
    | 'FRISK_HELGEDAG_INNTEKTSMELDING'
    | 'FRISK_HELGEDAG_SØKNAD'
    | 'PERMISJONSDAG_SØKNAD'
    | 'SYKEDAG_SYKMELDING'
    | 'SYKEDAG_SØKNAD'
    | 'SYK_HELGEDAG_SYKMELDING'
    | 'SYK_HELGEDAG_SØKNAD'
    | 'ANNULLERT_DAG';

declare type ExternalSykdomsdagkilde = 'Inntektsmelding' | 'Sykmelding' | 'Søknad' | 'Saksbehandler';

declare type ExternalSykdomsdag = {
    dagen: string;
    type: ExternalSykdomsdagtype;
    kilde?: {
        type: ExternalSykdomsdagkilde;
        kildeId: string | null;
    };
    grad?: number;
};

declare type ExternalVedtaksperiodetilstand =
    | 'TilUtbetaling'
    | 'Utbetalt'
    | 'Oppgaver'
    | 'Venter'
    | 'VenterPåKiling'
    | 'IngenUtbetaling'
    | 'Feilet'
    | 'TilInfotrygd';

declare type ExternalVedtaksperiodetype =
    | 'FØRSTEGANGSBEHANDLING'
    | 'FORLENGELSE'
    | 'INFOTRYGDFORLENGELSE'
    | 'OVERGANG_FRA_IT'
    | 'STIKKPRØVE'
    | 'RISK_QA';

declare type ExternalSimuleringsdetaljer = {
    antallSats: number;
    beløp: number;
    faktiskFom: string;
    faktiskTom: string;
    klassekode: string;
    klassekodeBeskrivelse: string;
    konto: string;
    refunderesOrgNr: string;
    sats: number;
    tilbakeføring: boolean;
    typeSats: string;
    uføregrad: number;
    utbetalingstype: string;
};

declare type ExternalSimuleringsutbetaling = {
    detaljer: ExternalSimuleringsdetaljer[];
    feilkonto: boolean;
    forfall: string;
    utbetalesTilId: string;
    utbetalesTilNavn: string;
};

declare type ExternalSimuleringsperiode = {
    fom: string;
    tom: string;
    utbetalinger: ExternalSimuleringsutbetaling[];
};

declare type ExternalHendelse = {
    id: string;
    type: 'INNTEKTSMELDING' | 'NY_SØKNAD' | 'SENDT_SØKNAD_NAV' | 'SENDT_SØKNAD_ARBEIDSGIVER';
};

declare type ExternalSøknadNav = ExternalHendelse & {
    fom: string;
    tom: string;
    rapportertdato: string;
    sendtNav: string;
    type: 'SENDT_SØKNAD_NAV';
};

declare type ExternalSøknadArbeidsgiver = ExternalHendelse & {
    fom: string;
    tom: string;
    rapportertdato: string;
    sendtArbeidsgiver: string;
    type: 'SENDT_SØKNAD_ARBEIDSGIVER';
};

declare type ExternalSykmelding = ExternalHendelse & {
    fom: string;
    tom: string;
    rapportertdato: string;
    type: 'NY_SØKNAD';
};

declare type ExternalInntektsmelding = ExternalHendelse & {
    mottattDato: string;
    beregnetInntekt: number;
    type: 'INNTEKTSMELDING';
};

declare type ExternalAktivitet = {
    vedtaksperiodeId: UUID;
    alvorlighetsgrad: 'W';
    melding: string;
    tidsstempel: TimestampString;
};

interface ExternalFaresignal {
    kreverSupersaksbehandler: boolean;
    beskrivelse: string;
    kategori: string[];
}

declare type ExternalVedtaksperiode = {
    id: string;
    fom: string;
    tom: string;
    gruppeId: string;
    tilstand: ExternalVedtaksperiodetilstand;
    oppgavereferanse: string | null;
    fullstendig: boolean;
    erForkastet: boolean;
    utbetalingsreferanse?: string;
    utbetalingstidslinje: ExternalUtbetalingsdag[];
    utbetalinger: {
        arbeidsgiverUtbetaling?: ExternalUtbetaling;
        personUtbetaling?: ExternalUtbetaling;
    };
    sykdomstidslinje: ExternalSykdomsdag[];
    automatiskBehandlet: boolean;
    godkjentAv?: string;
    godkjenttidspunkt?: string;
    vilkår: {
        sykepengedager: {
            forbrukteSykedager?: number;
            skjæringstidspunkt: string;
            førsteSykepengedag?: string;
            maksdato?: string;
            gjenståendeDager?: number;
            oppfylt?: boolean;
        };
        alder: {
            alderSisteSykedag: number;
            oppfylt: boolean;
        };
        opptjening: {
            antallKjenteOpptjeningsdager: number;
            fom: string;
            oppfylt: boolean;
        };
        søknadsfrist: {
            sendtNav: string;
            søknadFom: string;
            søknadTom: string;
            oppfylt?: boolean;
        };
        sykepengegrunnlag: {
            sykepengegrunnlag?: number;
            grunnbeløp: number;
            oppfylt?: boolean;
        };
        medlemskapstatus: 'JA' | 'NEI' | 'VET_IKKE';
    };
    inntektFraInntektsmelding?: number;
    totalbeløpArbeidstaker: number;
    dataForVilkårsvurdering: {
        erEgenAnsatt: boolean;
        beregnetÅrsinntektFraInntektskomponenten: number;
        avviksprosent: number;
        antallOpptjeningsdagerErMinst: number;
        harOpptjening: boolean;
        medlemskapstatus: 'JA' | 'NEI' | 'VET_IKKE';
    };
    forlengelseFraInfotrygd: 'IKKE_ETTERSPURT' | 'JA' | 'NEI';
    periodetype: ExternalVedtaksperiodetype;
    simuleringsdata?: {
        totalbeløp: number;
        perioder: ExternalSimuleringsperiode[];
    };
    hendelser: ExternalHendelse[];
    utbetalingslinjer?: ExternalUtbetalingslinje[];
    aktivitetslogg: ExternalAktivitet[];
    risikovurdering: null | {
        funn: ExternalFaresignal[];
        kontrollertOk: ExternalFaresignal[];
    };
    varsler: string[];
    beregningIder?: string[];
    inntektskilde: 'EN_ARBEIDSGIVER' | 'FLERE_ARBEIDSGIVERE';
};

declare type ExternalUfullstendigVedtaksperiode = {
    id: string;
    fom: string;
    tom: string;
    gruppeId: string;
    tilstand: ExternalVedtaksperiodetilstand;
    fullstendig: boolean;
    utbetalingstidslinje?: ExternalUtbetalingsdag[];
};

declare type ExternalOverstyringsdag = {
    dato: string;
    dagtype: ExternalSykdomsdagtype;
    grad?: number;
};

declare type ExternalOverstyring = {
    hendelseId: string;
    begrunnelse: string;
    saksbehandlerNavn: string;
    saksbehandlerIdent?: string;
    timestamp: string;
    overstyrteDager: ExternalOverstyringsdag[];
};

declare type ExternalUtbetalingshistorikkElement = {
    status: string;
    type: string;
    utbetalingstidslinje: ExternalUtbetalingsdag[];
    maksdato: string;
    gjenståendeSykedager: number;
    arbeidsgiverNettoBeløp: number;
    personNettoBeløp: number;
    arbeidsgiverFagsystemId: string;
    personFagsystemId: string;
    forbrukteSykedager: number;
    vurdering?: {
        godkjent: boolean;
        tidsstempel: string;
        automatisk: boolean;
        ident: string;
    };
};

declare type ExternalHistorikkElement = {
    beregningId: string;
    beregnettidslinje: ExternalSykdomsdag[];
    hendelsetidslinje: ExternalSykdomsdag[];
    utbetaling: ExternalUtbetalingshistorikkElement;
    tidsstempel: string;
};

declare type ExternalSykdomstidslinjedagtype =
    | 'ARBEIDSDAG'
    | 'ARBEIDSGIVERDAG'
    | 'FERIEDAG'
    | 'FORELDET_SYKEDAG'
    | 'FRISK_HELGEDAG'
    | 'PERMISJONSDAG'
    | 'SYKEDAG'
    | 'SYK_HELGEDAG'
    | 'UBESTEMTDAG'
    | 'AVSLÅTT';

declare type ExternalUtbetalingstidslinjedagtype =
    | 'ArbeidsgiverperiodeDag'
    | 'NavDag'
    | 'NavHelgDag'
    | 'Helgedag'
    | 'Arbeidsdag'
    | 'Feriedag'
    | 'AvvistDag'
    | 'UkjentDag'
    | 'ForeldetDag';

declare type ExternalUtbetalingsinfo = {
    inntekt?: number;
    utbetaling?: number;
    totalGrad?: number;
};

declare type ExternalBegrunnelser =
    | 'SykepengedagerOppbrukt'
    | 'MinimumInntekt'
    | 'EgenmeldingUtenforArbeidsgiverperiode'
    | 'MinimumSykdomsgrad'
    | 'EtterDødsdato'
    | 'ManglerMedlemskap'
    | 'ManglerOpptjening';

declare type ExternalTidslinjedag = {
    dagen: string;
    sykdomstidslinjedagtype: ExternalSykdomstidslinjedagtype;
    utbetalingstidslinjedagtype: ExternalUtbetalingstidslinjedagtype;
    kilde: {
        id: string;
        type: string;
    };
    grad: number | null;
    utbetalingsinfo: ExternalUtbetalingsinfo | null;
    begrunnelser: ExternalBegrunnelser[] | null;
};

declare type ExternalBehandlingstype = 'UBEREGNET' | 'BEHANDLET' | 'VENTER';

declare type ExternalTidslinjeperiodetype =
    | 'FØRSTEGANGSBEHANDLING'
    | 'FORLENGELSE'
    | 'OVERGANG_FRA_IT'
    | 'INFOTRYGDFORLENGELSE';

declare type ExternalInntektskilde = 'EN_ARBEIDSGIVER' | 'FLERE_ARBEIDSGIVERE';

declare type TimestampString = string;

declare type DateString = string;

declare type UUID = string;

declare type ExternalPeriodeUtbetalingStatus =
    | 'Annullert'
    | 'Forkastet'
    | 'Godkjent'
    | 'GodkjentUtenUtbetaling'
    | 'IkkeGodkjent'
    | 'Overført'
    | 'Sendt'
    | 'Utbetalt'
    | 'UtbetalingFeilet'
    | 'Ubetalt';

declare type ExternalPeriodeUtbetaling = {
    type: 'REVURDERING' | 'UTBETALING' | 'ANNULLERING';
    status: ExternalPeriodeUtbetalingStatus;
    arbeidsgiverNettoBeløp: number;
    personNettoBeløp: number;
    arbeidsgiverFagsystemId: string;
    personFagsystemId: string;
    vurdering: null | {
        godkjent: boolean;
        tidsstempel: TimestampString;
        automatisk: boolean;
        ident: string;
    };
};

declare type ExternalUberegnetPeriode = {
    vedtaksperiodeId: UUID;
    fom: DateString;
    tom: DateString;
    sammenslåttTidslinje: ExternalTidslinjedag[];
    behandlingstype: ExternalBehandlingstype;
    erForkastet: boolean;
    periodetype: ExternalTidslinjeperiodetype;
    inntektskilde: ExternalInntektskilde;
    opprettet: TimestampString;
    tidslinjeperiodeId: UUID;
};

declare type ExternalBeregnetPeriode = ExternalUberegnetPeriode & {
    beregningId: UUID;
    gjenståendeSykedager: number | null;
    forbrukteSykedager: number | null;
    skjæringstidspunkt: DateString;
    maksdato: DateString;
    utbetaling: ExternalPeriodeUtbetaling;
    hendelser: (ExternalSøknadNav | ExternalSøknadArbeidsgiver | ExternalSykmelding | ExternalInntektsmelding)[];
    simulering: null | {
        totalbeløp: number;
        perioder: ExternalSimuleringsperiode[];
    };
    vilkårsgrunnlagshistorikkId: UUID;
    periodevilkår: {
        sykepengedager: {
            skjæringstidspunkt: DateString;
            maksdato: DateString;
            forbrukteSykedager: number | null;
            gjenståendeDager: number | null;
            oppfylt: boolean;
        };
        alder: {
            alderSisteSykedag: number;
            oppfylt: boolean;
        };
        søknadsfrist: null | {
            sendtNav: TimestampString;
            søknadFom: DateString;
            søknadTom: DateString;
            oppfylt: boolean;
        };
    };
    aktivitetslogg: ExternalAktivitet[];
};

declare type ExternalGenerasjon = {
    id: string;
    perioder: ExternalBeregnetPeriode[];
};

declare type ExternalArbeidsgiver = {
    bransjer?: string[];
    id: string;
    organisasjonsnummer: string;
    navn: string;
    vedtaksperioder: (ExternalVedtaksperiode | ExternalUfullstendigVedtaksperiode)[];
    utbetalingshistorikk: ExternalHistorikkElement[];
    overstyringer: ExternalOverstyring[];
    generasjoner: ExternalGenerasjon[];
};

declare type ExternalInntektkilde = 'Saksbehandler' | 'Inntektsmelding' | 'Infotrygd' | 'AOrdningen';

declare type YearMonthString = string; // "yyyy-MM"

declare type ExternalInntekterFraAOrdningen = {
    måned: YearMonthString;
    sum: number;
};

declare type ExternalOmregnetÅrsinntekt = {
    kilde: ExternalInntektkilde;
    beløp: number;
    månedsbeløp: number;
    inntekterFraAOrdningen?: ExternalInntekterFraAOrdningen[];
};

declare type ExternalSammenligningsgrunnlag = {
    beløp: number;
    inntekterFraAOrdningen: ExternalInntekterFraAOrdningen[];
};

declare type ExternalPersoninfo = {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    fødselsdato: DateString | null;
    kjønn: string | null;
};

declare type ExternalArbeidsforhold = {
    organisasjonsnummer: string;
    stillingstittel: string;
    stillingsprosent: number;
    startdato: string;
    sluttdato?: string;
};

declare type ExternalInfotrygdutbetaling = {
    fom: string;
    tom: string;
    grad: string;
    dagsats: number;
    typetekst: 'Ferie' | 'Utbetaling' | 'ArbRef' | 'Ukjent..' | 'Tilbakeført';
    organisasjonsnummer: string;
};

declare type ExternalTildeling = {
    oid: string;
    epost: string;
    påVent: boolean;
    navn: string;
};

declare type ExternalPeriode = {
    fom: string;
    tom: string;
};

declare type ExternalArbeidsgiverOppdrag = {
    organisasjonsnummer: string;
    fagsystemId: string;
    utbetalingslinjer: ExternalPeriode[];
};

declare type ExternalUtbetalingElement = {
    status: string;
    type: string;
    arbeidsgiverOppdrag: ExternalArbeidsgiverOppdrag;
    annullertAvSaksbehandler?: null | {
        annullertTidspunkt: string;
        saksbehandlerNavn: string;
    };
    totalbeløp: number | null;
};

declare type ExternalInntektsgrunnlag = {
    skjæringstidspunkt: string;
    sykepengegrunnlag?: number;
    omregnetÅrsinntekt?: number;
    sammenligningsgrunnlag?: number;
    avviksprosent?: number;
    maksUtbetalingPerDag?: number;
    inntekter: {
        arbeidsgiver: string;
        omregnetÅrsinntekt?: ExternalOmregnetÅrsinntekt;
        sammenligningsgrunnlag?: ExternalSammenligningsgrunnlag;
    }[];
    oppfyllerKravOmMinstelønn?: boolean;
    grunnbeløp?: number;
};

declare type ExternalArbeidsgiverinntekt = {
    organisasjonsnummer: string;
    omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt | null;
    sammenligningsgrunnlag: number | null;
};

declare type ExternalVilkårsgrunnlag = {
    vilkårsgrunnlagtype: 'SPLEIS' | 'INFOTRYGD';
    skjæringstidspunkt: DateString;
    omregnetÅrsinntekt: number | null;
    sammenligningsgrunnlag: number | null;
    sykepengegrunnlag: number;
    inntekter: ExternalArbeidsgiverinntekt[];
};

declare type ExternalSpleisVilkårsgrunnlag = ExternalVilkårsgrunnlag & {
    vilkårsgrunnlagtype: 'SPLEIS';
    avviksprosent: number | null;
    oppfyllerKravOmMinstelønn: boolean | null;
    grunnbeløp: number;
    medlemskapstatus: 'JA' | 'NEI' | 'VET_IKKE';
};

declare type ExternalInfotrygdVilkårsgrunnlag = ExternalVilkårsgrunnlag & {
    vilkårsgrunnlagtype: 'INFOTRYGD';
};

declare type ExternalPerson = {
    utbetalinger: ExternalUtbetalingElement[];
    aktørId: string;
    fødselsnummer: string;
    dødsdato: string | null;
    personinfo: ExternalPersoninfo;
    arbeidsgivere: ExternalArbeidsgiver[];
    infotrygdutbetalinger: ExternalInfotrygdutbetaling[] | null;
    enhet: {
        id: string;
        navn: string;
    };
    arbeidsforhold: ExternalArbeidsforhold[];
    inntektsgrunnlag: ExternalInntektsgrunnlag[] | null;
    vilkårsgrunnlagHistorikk: Record<UUID, Record<DateString, ExternalVilkårsgrunnlag>>;
    tildeling: ExternalTildeling | null;
};

declare type ExternalPeriodetype =
    | 'FORLENGELSE'
    | 'FØRSTEGANGSBEHANDLING'
    | 'INFOTRYGDFORLENGELSE'
    | 'OVERGANG_FRA_IT'
    | 'STIKKPRØVE'
    | 'RISK_QA';

declare type ExternalBehandlingstatistikk = {
    antallOppgaverTilGodkjenning: {
        totalt: number;
        perPeriodetype: [{ periodetypeForSpeil: ExternalPeriodetype; antall: number }];
    };
    antallTildelteOppgaver: {
        totalt: number;
        perPeriodetype: [{ periodetypeForSpeil: ExternalPeriodetype; antall: number }];
    };
    fullførteBehandlinger: {
        totalt: number;
        manuelt: number;
        automatisk: number;
        annulleringer: number;
    };
};

declare type ExternalOppgavetype = 'SØKNAD' | 'STIKKPRØVE' | 'RISK_QA' | 'REVURDERING';

declare type ExternalOppgave = {
    oppgavereferanse: string;
    opprettet: string;
    vedtaksperiodeId: string;
    personinfo: ExternalPersoninfo;
    fødselsnummer: string;
    aktørId: string;
    antallVarsler: number;
    type: ExternalPeriodetype;
    oppgavetype: ExternalOppgavetype;
    boenhet: {
        id: string;
        navn: string;
    };
    inntektskilde?: 'EN_ARBEIDSGIVER' | 'FLERE_ARBEIDSGIVERE';
    tildeling?: ExternalTildeling;
};

declare type ExternalNotat = {
    id: string;
    tekst: string;
    opprettet: string;
    saksbehandlerOid: string;
    saksbehandlerNavn: string;
    saksbehandlerEpost: string;
    vedtaksperiodeId: string;
    feilregistrert: boolean;
    saksbehandlerIdent?: string;
};
