import { ReactChild } from 'react';
import { Personinfo, VedtaksperiodeTilstand } from '../../types';

export type Optional<T> = T | undefined | null;

export enum Hendelsetype {
    INNTEKTSMELDING = 'Inntektsmelding',
    SYKMELDING = 'Sykmelding',
    SØKNAD = 'Søknad'
}

export enum Dagtype {
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
    UTENLANDSDAG = 'UTENLANDSDAG'
}

export enum Utbetalingsdagtype {
    ARBEIDSGIVERPERIODE = 'ArbeidsgiverperiodeDag',
    NAVDAG = 'NavDag',
    NAVHELG = 'NavHelgDag',
    ARBEIDSDAG = 'Arbeidsdag',
    FRIDAG = 'Fridag',
    UKJENTDAG = 'UkjentDag',
    AVVISTDAG = 'AvvistDag'
}

export interface Periode {
    fom: string;
    tom: string;
}

export interface Inntektsmelding extends Hendelse {
    beregnetInntekt: number;
    førsteFraværsdag: string;
}

export interface SpleisArbeidsgiver {
    id: string;
    organisasjonsnummer: string;
    vedtaksperioder: SpleisVedtaksperiode[];
}

export interface Utbetalingsdag {
    type: Utbetalingsdagtype;
    dato: string;
    utbetaling: number;
    grad?: number;
}

export interface Søknad extends Hendelse {
    fom: string;
    tom: string;
    rapportertdato: string;
}

export interface SendtSøknad extends Søknad {
    sendtNav: string;
}

export interface NySøknad extends Søknad {}

export type Kildelabel = 'IM' | 'SØ' | 'SM';

export interface Dag {
    dagen: string;
    type: string;
    kilde: { label: Kildelabel; link: string };
    grad?: number;
}

export interface Hendelse {
    fom: string;
    tom: string;
    type: string;
    rapportertdato?: string;
}

export interface Utbetalingslinje extends Periode {
    dagsats: number;
}

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

export interface DataForVilkårsvurdering {
    erEgenAnsatt: boolean;
    beregnetÅrsinntektFraInntektskomponenten: number;
    avviksprosent: number;
    antallOpptjeningsdagerErMinst: number;
    harOpptjening: boolean;
}

export interface SpleisVedtaksperiode {
    id: string;
    maksdato: string;
    forbrukteSykedager: number;
    godkjentAv?: string;
    godkjentTidspunkt?: string;
    tilstand: string;
    sykdomstidslinje: Dag[];
    utbetalingslinjer?: Utbetalingslinje[];
    utbetalingsreferanse: string;
    dataForVilkårsvurdering?: DataForVilkårsvurdering;
    førsteFraværsdag: string;
    inntektFraInntektsmelding: number;
    utbetalingstidslinje: Utbetalingsdag[];
}

export interface Utbetalingsperiode {
    fom: string;
    tom: string;
    utbetaling: Utbetaling[];
}

interface Inngangsvilkår {
    dagerIgjen: {
        dagerBrukt: number;
        førsteFraværsdag: string;
        førsteSykepengedag: Optional<string>;
        maksdato: string;
        tidligerePerioder: Periode[];
    };
    søknadsfrist: {
        innen3Mnd: boolean;
        søknadTom?: string;
        sendtNav?: string;
    };
    opptjening?: {
        antallOpptjeningsdagerErMinst: number;
        opptjeningFra: string;
        harOpptjening: boolean;
    };
    alderISykmeldingsperioden: Optional<number>;
}

export interface Sykepengegrunnlag {
    dagsats?: number;
    avviksprosent?: number;
    årsinntektFraAording?: number;
    årsinntektFraInntektsmelding: Optional<number>;
}

export interface Inntektskilde {
    organisasjonsnummer?: string;
    forskuttering: string;
    refusjon: string;
    årsinntekt: Optional<number>;
    månedsinntekt: Optional<number>;
}

interface Oppsummering {
    antallUtbetalingsdager: number;
    totaltTilUtbetaling: number;
}

export interface Vedtaksperiode {
    id: string;
    fom: string;
    tom: string;
    tilstand: VedtaksperiodeTilstand;
    inngangsvilkår: Inngangsvilkår;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Dag[];
    sykepengegrunnlag: Sykepengegrunnlag;
    inntektskilder: Inntektskilde[];
    oppsummering: Oppsummering;
    utbetalingsreferanse: string;
    rawData: SpleisVedtaksperiode;
    godkjentAv?: string;
    godkjentTidspunkt?: string;
}

export interface SpleisPerson {
    aktørId: string;
    fødselsnummer: string;
    arbeidsgivere: SpleisArbeidsgiver[];
    hendelser: Hendelse[];
}

export interface Arbeidsgiver {
    id: string;
    organisasjonsnummer: string;
    vedtaksperioder: Vedtaksperiode[];
}

export interface Person {
    aktørId: string;
    arbeidsgivere: Arbeidsgiver[];
    personinfo: Personinfo;
    fødselsnummer: string;
    hendelser: Hendelse[];
}

export interface ProviderProps {
    children: ReactChild;
}

export interface Tildeling {
    behovId: string;
    userId: string;
}
