import { PersonNavn } from '../../../types';

export interface Utbetalingsdetalj {
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
}

export interface Utbetaling {
    forfall: string;
    detaljer: Utbetalingsdetalj[];
    feilkonto: boolean;
    utbetalesTilId: string;
    utbetalesTilNavn: string;
}

export interface SpleisUtbetalingslinje {
    fom: string;
    tom: string;
    dagsats: number;
    grad: number;
}

export interface Utbetalingsperiode {
    fom: string;
    tom: string;
    utbetalinger: Utbetaling[];
}

export enum SpleisUtbetalingsdagtype {
    ARBEIDSGIVERPERIODE = 'ArbeidsgiverperiodeDag',
    NAVDAG = 'NavDag',
    NAVHELG = 'NavHelgDag',
    ARBEIDSDAG = 'Arbeidsdag',
    FERIEDAG = 'Feriedag',
    HELGEDAG = 'Helgedag',
    UKJENTDAG = 'UkjentDag',
    AVVISTDAG = 'AvvistDag',
    FORELDETDAG = 'ForeldetDag'
}

export interface SpleisUtbetalingsdag {
    type: SpleisUtbetalingsdagtype;
    inntekt: number;
    dato: string;
    utbetaling?: number;
    grad?: number;
    begrunnelse?: string;
}

export enum SpleisSykdomsdagtype {
    ARBEIDSDAG = 'ARBEIDSDAG',
    ARBEIDSGIVERDAG = 'ARBEIDSGIVERDAG',
    FERIEDAG = 'FERIEDAG',
    FORELDET_SYKEDAG = 'FORELDET_SYKEDAG',
    FRISK_HELGEDAG = 'FRISK_HELGEDAG',
    IMPLISITT_DAG = 'IMPLISITT_DAG',
    PERMISJONSDAG = 'PERMISJONSDAG',
    STUDIEDAG = 'STUDIEDAG',
    SYKEDAG = 'SYKEDAG',
    SYK_HELGEDAG = 'SYK_HELGEDAG',
    UBESTEMTDAG = 'UBESTEMTDAG',
    UTENLANDSDAG = 'UTENLANDSDAG',

    ARBEIDSDAG_INNTEKTSMELDING = 'ARBEIDSDAG_INNTEKTSMELDING',
    ARBEIDSDAG_SØKNAD = 'ARBEIDSDAG_SØKNAD',
    EGENMELDINGSDAG_INNTEKTSMELDING = 'EGENMELDINGSDAG_INNTEKTSMELDING',
    EGENMELDINGSDAG_SØKNAD = 'EGENMELDINGSDAG_SØKNAD',
    FERIEDAG_INNTEKTSMELDING = 'FERIEDAG_INNTEKTSMELDING',
    FERIEDAG_SØKNAD = 'FERIEDAG_SØKNAD',
    FRISK_HELGEDAG_INNTEKTSMELDING = 'FRISK_HELGEDAG_INNTEKTSMELDING',
    FRISK_HELGEDAG_SØKNAD = 'FRISK_HELGEDAG_SØKNAD',
    PERMISJONSDAG_SØKNAD = 'PERMISJONSDAG_SØKNAD',
    PERMISJONSDAG_AAREG = 'PERMISJONSDAG_AAREG',
    SYKEDAG_SYKMELDING = 'SYKEDAG_SYKMELDING',
    SYKEDAG_SØKNAD = 'SYKEDAG_SØKNAD',
    SYK_HELGEDAG_SYKMELDING = 'SYK_HELGEDAG_SYKMELDING',
    SYK_HELGEDAG_SØKNAD = 'SYK_HELGEDAG_SØKNAD'
}

export interface SpleisSykdomsdag {
    dagen: string;
    type: SpleisSykdomsdagtype;
    kilde?: SpleisSykdomsdagkilde;
    grad?: number;
}

export interface SpleisSykdomsdagkilde {
    type: SpleisSykdomsdagkildeType;
}

export enum SpleisSykdomsdagkildeType {
    INNTEKTSMELDING = 'Inntektsmelding',
    SYKMELDING = 'Sykmelding',
    SØKNAD = 'Søknad'
}

export enum SpleisHendelsetype {
    INNTEKTSMELDING = 'INNTEKTSMELDING',
    SYKMELDING = 'NY_SØKNAD',
    SØKNAD_NAV = 'SENDT_SØKNAD_NAV',
    SØKNAD_ARBEIDSGIVER = 'SENDT_SØKNAD_ARBEIDSGIVER'
}

export interface SpleisHendelse {
    id: string;
    type: SpleisHendelsetype;
}

export interface SpleisSøknad extends SpleisHendelse {
    fom: string;
    tom: string;
    rapportertdato: string; // date time
    sendtNav: string; // date time
}

export interface SpleisSykmelding extends SpleisHendelse {
    fom: string;
    tom: string;
    rapportertdato: string; // date time
}

export interface SpleisInntektsmelding extends SpleisHendelse {
    mottattDato: string; // date time
    beregnetInntekt: number;
}

export interface SpleisArbeidsgiver {
    id: string;
    organisasjonsnummer: string;
    vedtaksperioder: SpesialistVedtaksperiode[];
}

export interface SpleisPerson {
    aktørId: string;
    fødselsnummer: string;
    arbeidsgivere: SpleisArbeidsgiver[];
}

export interface SpesialistPerson {
    aktørId: string;
    fødselsnummer: string;
    arbeidsgivere: SpesialistArbeidsgiver[];
    navn: PersonNavn;
    infotrygdutbetalinger?: SpesialistInfotrygdutbetaling[];
}

export interface SpesialistArbeidsgiver {
    id: string;
    organisasjonsnummer: string;
    vedtaksperioder: SpesialistVedtaksperiode[];
    navn: string;
}

export interface SpleisDataForVilkårsvurdering {
    erEgenAnsatt: boolean;
    beregnetÅrsinntektFraInntektskomponenten: number;
    avviksprosent: number;
    antallOpptjeningsdagerErMinst: number;
    harOpptjening: boolean;
}

export interface SpleisDataForSimulering {
    totalbeløp: number;
    perioder: SpleisSimuleringperiode[];
}

export interface SpleisSimuleringperiode {
    fom: string;
    tom: string;
    utbetalinger: SpleisSimuleringutbetaling[];
}

export interface SpleisSimuleringutbetaling {
    detaljer: SpleisSimuleringutbetalingDetaljer[];
    feilkonto: boolean;
    forfall: string;
    utbetalesTilId: string;
    utbetalesTilNavn: string;
}

export interface SpleisSimuleringutbetalingDetaljer {
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
}

export enum SpleisVedtaksperiodetilstand {
    TilUtbetaling = 'TilUtbetaling',
    Utbetalt = 'Utbetalt',
    Oppgaver = 'Oppgaver',
    Venter = 'Venter',
    IngenUtbetaling = 'IngenUtbetaling',
    Feilet = 'Feilet',
    TilInfotrygd = 'TilInfotrygd'
}

export interface SpleisVilkår {
    sykepengedager: SpleisSykepengedager;
    alder: SpleisAlder;
    opptjening: SpleisOpptjening;
    søknadsfrist: SpleisSøknadsfrist;
    sykepengegrunnlag: SpleisSykepengegrunnlag;
}

export interface SpleisSykepengedager {
    forbrukteSykedager?: number;
    førsteFraværsdag: string;
    førsteSykepengedag?: string;
    maksdato?: string;
    gjenståendeDager?: number;
    oppfylt?: boolean;
}

interface SpleisAlder {
    alderSisteSykedag: number;
    oppfylt: boolean;
}

interface SpleisOpptjening {
    antallKjenteOpptjeningsdager: number;
    fom: string;
    oppfylt: boolean;
}

interface SpleisSøknadsfrist {
    sendtNav: string; // date time
    søknadFom: string;
    søknadTom: string;
    oppfylt?: boolean;
}

interface SpleisSykepengegrunnlag {
    sykepengegrunnlag?: number;
    grunnbeløp: number;
    oppfylt?: boolean;
}

export type SpleisAlvorlighetsgrad = 'W';

export interface SpleisAktivitet {
    vedtaksperiodeId: string;
    alvorlighetsgrad: SpleisAlvorlighetsgrad;
    melding: string;
    tidsstempel: string;
}

interface SpleisUtbetalinger {
    arbeidsgiverUtbetaling?: SpleisUtbetaling;
    personUtbetaling?: SpleisUtbetaling;
}

interface SpleisUtbetaling {
    fagsystemId: string;
    linjer: SpleisUtbetalingslinje[];
}

export interface SpesialistVedtaksperiode {
    id: string;
    fom: string;
    tom: string;
    gruppeId: string;
    tilstand: SpleisVedtaksperiodetilstand;
    oppgavereferanse: string;
    fullstendig: boolean;
    utbetalingsreferanse?: string;
    utbetalingstidslinje: SpleisUtbetalingsdag[];
    utbetalinger?: SpleisUtbetalinger;
    sykdomstidslinje: SpleisSykdomsdag[];
    godkjentAv?: string;
    godkjenttidspunkt?: string;
    vilkår: SpleisVilkår | null;
    førsteFraværsdag: string;
    inntektFraInntektsmelding: number;
    totalbeløpArbeidstaker: number;
    dataForVilkårsvurdering: SpleisDataForVilkårsvurdering;
    forlengelseFraInfotrygd: SpleisForlengelseFraInfotrygd;
    simuleringsdata?: SpleisDataForSimulering;
    hendelser: SpleisHendelse[];
    utbetalingslinjer?: SpleisUtbetalingslinje[];
    aktivitetslogg: SpleisAktivitet[];
}

export interface SpesialistInfotrygdutbetaling {
    fom: string;
    tom: string;
    grad: string;
    dagsats: number;
    typetekst: string;
    organisasjonsnummer: string;
}

export enum SpleisForlengelseFraInfotrygd {
    IKKE_ETTERSPURT = 'IKKE_ETTERSPURT',
    JA = 'JA',
    NEI = 'NEI'
}
