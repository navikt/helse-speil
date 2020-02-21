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
    SYK_HELGEDAG = 'SYK_HELGEDAG',
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

export interface Arbeidsgiver {
    id: string;
    organisasjonsnummer: string;
    vedtaksperioder: Vedtaksperiode[];
}

export interface Utbetalingsdag {
    type: Utbetalingsdagtype;
    dato: string;
    utbetaling: number;
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

export type kildeLabel = 'IM' | 'SØ' | 'SM';

export interface Dag {
    dagen: string;
    type: string;
    kilde: { label: kildeLabel; link: string };
}

export interface Hendelse {
    type: string;
}

export interface Utbetalingslinje extends Periode {
    dagsats: number;
}

interface Utbetalingsdetaljer {
    sats: number;
    konto: string;
    belop: number;
    typeSats: string;
    uforegrad: number;
    antallSats: number;
    faktiskFom: Utbetalingsdato;
    faktiskTom: Utbetalingsdato;
    klassekode: string;
    tilbakeforing: boolean;
    refunderesOrgNr: string;
    utbetalingsType: string;
    klassekodeBeskrivelse: string;
}

interface Utbetaling {
    forfall: Utbetalingsdato;
    detaljer: Utbetalingsdetaljer[];
    feilkonto: boolean;
    fagsystemId: string;
    utbetalesTilId: string;
    utbetalesTilNavn: string;
}

export interface Utbetalingsdato {
    era: string;
    year: number;
    month: string;
    learYear: boolean;
    dayOfWeek: string;
    dayOfYear: number;
    monthValue: number;
    dayOfMonth: number;
    chronology: { id: string; calendarType: string };
}

export interface DataForVilkårsvurdering {
    erEgenAnsatt: boolean;
    beregnetÅrsinntektFraInntektskomponenten: number;
    avviksprosent: number;
    antallOpptjeningsdagerErMinst: number;
    harOpptjening: boolean;
}

export interface Vedtaksperiode {
    id: string;
    maksdato: string;
    godkjentAv?: string;
    tilstand: string;
    sykdomstidslinje: Dag[];
    utbetalingslinjer?: Utbetalingslinje[];
    utbetalingsreferanse?: string;
    dataForVilkårsvurdering?: DataForVilkårsvurdering;
    førsteFraværsdag: string;
    inntektFraInntektsmelding: number;
    utbetalingstidslinje: Utbetalingsdag[];
}

export interface Utbetalingsperiode {
    fom: Utbetalingsdato;
    tom: Utbetalingsdato;
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
    opptjening: {
        antallOpptjeningsdagerErMinst?: number;
        opptjeningFra?: string;
        harOpptjening?: boolean;
    };
    alderISykmeldingsperioden: Optional<number>;
}

export interface Sykepengegrunnlag {
    dagsats?: number;
    avviksprosent?: number;
    årsinntektFraAording?: number;
    årsinntektFraInntektsmelding: Optional<number>;
}

interface Inntektskilder {
    forskuttering: string;
    refusjon: string;
    årsinntekt: Optional<number>;
    månedsinntekt: Optional<number>;
}

interface Oppsummering {
    antallUtbetalingsdager: number;
    totaltTilUtbetaling: number;
}

export interface MappedVedtaksperiode {
    id: string;
    fom: string;
    tom: string;
    tilstand: VedtaksperiodeTilstand;
    inngangsvilkår: Inngangsvilkår;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Dag[];
    sykepengegrunnlag: Sykepengegrunnlag;
    inntektskilder: Inntektskilder;
    oppsummering: Oppsummering;
    utbetalingsreferanse?: string;
    rawData: Vedtaksperiode;
}

export interface UnmappedPerson {
    aktørId: string;
    fødselsnummer: string;
    arbeidsgivere: Arbeidsgiver[];
    hendelser: Hendelse[];
}

export interface Person {
    aktørId: string;
    arbeidsgivere: {
        id: string;
        organisasjonsnummer: string;
        vedtaksperioder: MappedVedtaksperiode[];
    }[];
    personinfo: Personinfo;
    sendtSøknad?: SendtSøknad;
    inntektsmelding?: Inntektsmelding;
    fødselsnummer: string;
}

export interface ProviderProps {
    children: ReactChild;
}

export interface Tildeling {
    behovId: string;
    userId: string;
}
