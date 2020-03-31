export type Kildelabel = 'IM' | 'SØ' | 'SM';

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
    fagSystemId: string;
    utbetalesTilId: string;
    utbetalesTilNavn: string;
}

export interface Utbetalingslinje {
    fom: string;
    tom: string;
    dagsats: number;
    grad: number;
}

export interface Utbetalingsperiode {
    fom: string;
    tom: string;
    utbetaling: Utbetaling[];
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
    ARBEIDSDAG_INNTEKTSMELDING = 'ARBEIDSDAG_INNTEKTSMELDING',
    ARBEIDSDAG_SØKNAD = 'ARBEIDSDAG_SØKNAD',
    EGENMELDINGSDAG_INNTEKTSMELDING = 'EGENMELDINGSDAG_INNTEKTSMELDING',
    EGENMELDINGSDAG_SØKNAD = 'EGENMELDINGSDAG_SØKNAD',
    FERIEDAG_INNTEKTSMELDING = 'FERIEDAG_INNTEKTSMELDING',
    FERIEDAG_SØKNAD = 'FERIEDAG_SØKNAD',
    IMPLISITT_DAG = 'IMPLISITT_DAG',
    PERMISJONSDAG_SØKNAD = 'PERMISJONSDAG_SØKNAD',
    PERMISJONSDAG_AAREG = 'PERMISJONSDAG_AAREG',
    STUDIEDAG = 'STUDIEDAG',
    SYKEDAG_SYKMELDING = 'SYKEDAG_SYKMELDING',
    SYKEDAG_SØKNAD = 'SYKEDAG_SØKNAD',
    SYK_HELGEDAG_SYKMELDING = 'SYK_HELGEDAG_SYKMELDING',
    SYK_HELGEDAG_SØKNAD = 'SYK_HELGEDAG_SØKNAD',
    UBESTEMTDAG = 'UBESTEMTDAG',
    UTENLANDSDAG = 'UTENLANDSDAG',
    KUN_ARBEIDSGIVER_SYKEDAG = 'KUN_ARBEIDSGIVER_SYKEDAG'
}

export interface SpleisSykdomsdag {
    dagen: string;
    type: SpleisSykdomsdagtype;
    grad?: number;
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
    vedtaksperioder: SpleisVedtaksperiode[];
}

export interface SpleisPerson {
    aktørId: string;
    fødselsnummer: string;
    arbeidsgivere: SpleisArbeidsgiver[];
}

export interface SpleisDataForVilkårsvurdering {
    erEgenAnsatt: boolean;
    beregnetÅrsinntektFraInntektskomponenten: number;
    avviksprosent: number;
    antallOpptjeningsdagerErMinst: number;
    harOpptjening: boolean;
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
    oppfylt?: boolean;
}

interface SpleisAlder {
    alderSisteSykedag: number;
    oppfylt?: boolean;
}

interface SpleisOpptjening {
    antallKjenteOpptjeningsdager?: number;
    fom?: string;
    oppfylt?: boolean;
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

export interface SpleisVedtaksperiode {
    id: string;
    fom: string;
    tom: string;
    gruppeId: string;
    tilstand: SpleisVedtaksperiodetilstand;
    fullstendig: boolean;
    utbetalingsreferanse?: string;
    utbetalingstidslinje: SpleisUtbetalingsdag[];
    sykdomstidslinje: SpleisSykdomsdag[];
    godkjentAv?: string;
    godkjenttidspunkt?: string;
    vilkår: SpleisVilkår;
    førsteFraværsdag: string;
    inntektFraInntektsmelding: number;
    totalbeløpArbeidstaker: number;
    dataForVilkårsvurdering: SpleisDataForVilkårsvurdering;
    hendelser: SpleisHendelse[];
    utbetalingslinjer?: Utbetalingslinje[];
}
