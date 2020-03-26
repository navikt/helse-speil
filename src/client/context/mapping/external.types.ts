import { Vedtaksperiodetilstand } from '@navikt/helse-frontend-tidslinje';

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

export enum Utbetalingsdagtype {
    ARBEIDSGIVERPERIODE = 'ArbeidsgiverperiodeDag',
    NAVDAG = 'NavDag',
    NAVHELG = 'NavHelgDag',
    ARBEIDSDAG = 'Arbeidsdag',
    FRIDAG = 'Fridag',
    UKJENTDAG = 'UkjentDag',
    AVVISTDAG = 'AvvistDag',
    FORELDETDAG = 'ForeldetDag'
}

export interface SpleisUtbetalingsdag {
    type: Utbetalingsdagtype;
    dato: string;
    utbetaling: number;
    grad?: number;
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
    SØKNAD = 'SENDT_SØKNAD'
}

export interface SpleisHendelse {
    hendelseId: string;
    fom: string;
    tom: string;
    type: SpleisHendelsetype;
    rapportertdato?: string;
    mottattDato?: string;
}

export interface SpleisSøknad extends SpleisHendelse {
    rapportertdato: string;
}

export interface SpleisSendtSøknad extends SpleisSøknad {
    sendtNav: string;
}

export interface SpleisNySøknad extends SpleisSøknad {}

export interface SpleisInntektsmelding extends SpleisHendelse {
    beregnetInntekt: number;
    førsteFraværsdag: string;
    mottattDato: string;
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
    hendelser: SpleisHendelse[];
}

export interface SpleisDataForVilkårsvurdering {
    erEgenAnsatt: boolean;
    beregnetÅrsinntektFraInntektskomponenten: number;
    avviksprosent: number;
    antallOpptjeningsdagerErMinst: number;
    harOpptjening: boolean;
}

export enum VedtaksperiodetilstandDTO {
    TilUtbetaling = 'TilUtbetaling',
    Utbetalt = 'Utbetalt',
    Oppgaver = 'Oppgaver',
    Venter = 'Venter',
    IngenUtbetaling = 'IngenUtbetaling',
    Feilet = 'Feilet',
    TilInfotrygd = 'TilInfotrygd'
}

export interface SpleisVedtaksperiode {
    id: string;
    maksdato: string;
    forbrukteSykedager: number;
    godkjentAv?: string;
    godkjenttidspunkt?: string;
    tilstand: VedtaksperiodetilstandDTO;
    hendelser: string[];
    sykdomstidslinje: SpleisSykdomsdag[];
    utbetalingslinjer?: Utbetalingslinje[];
    utbetalingsreferanse: string;
    dataForVilkårsvurdering?: SpleisDataForVilkårsvurdering;
    førsteFraværsdag: string;
    inntektFraInntektsmelding: number;
    utbetalingstidslinje: SpleisUtbetalingsdag[];
}
