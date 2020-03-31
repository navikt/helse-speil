import { ReactChild } from 'react';
import { Dayjs } from 'dayjs';
import { SpleisVedtaksperiode } from './mapping/external.types';

export interface Periode {
    fom: Dayjs;
    tom: Dayjs;
}

export interface DagerIgjen {
    dagerBrukt: number;
    førsteFraværsdag: Dayjs;
    førsteSykepengedag?: Dayjs;
    maksdato: Dayjs;
    tidligerePerioder: Periode[];
}

export interface Søknadsfrist {
    innen3Mnd: boolean;
    søknadTom?: Dayjs;
    sendtNav?: Dayjs;
}

export interface Opptjening {
    antallOpptjeningsdagerErMinst: number;
    opptjeningFra: Dayjs;
    harOpptjening: boolean;
}

export interface Vilkår {
    dagerIgjen?: DagerIgjen;
    søknadsfrist?: Søknadsfrist;
    opptjening?: Opptjening;
    alderISykmeldingsperioden?: number;
}

export interface Sykepengegrunnlag {
    avviksprosent?: number;
    årsinntektFraAording?: number;
    årsinntektFraInntektsmelding?: number;
}

export interface Inntektskilde {
    organisasjonsnummer?: string;
    forskuttering: boolean;
    refusjon: boolean;
    årsinntekt?: number;
    månedsinntekt?: number;
}

export interface Oppsummering {
    antallUtbetalingsdager: number;
    totaltTilUtbetaling: number;
}

export enum Hendelsestype {
    Sykmelding = 'Sykmelding',
    Søknad = 'Søknad',
    Inntektsmelding = 'Inntektsmelding'
}

export interface Søknad {
    id: string;
    type: Hendelsestype.Søknad;
    fom: Dayjs;
    tom: Dayjs;
    rapportertDato?: Dayjs;
    sendtNav: Dayjs;
}

export interface Sykmelding {
    id: string;
    type: Hendelsestype.Sykmelding;
    fom: Dayjs;
    tom: Dayjs;
    rapportertDato?: Dayjs;
}

export interface Inntektsmelding {
    id: string;
    type: Hendelsestype.Inntektsmelding;
    beregnetInntekt: number;
    mottattTidspunkt: Dayjs;
}

export type Hendelse = Søknad | Sykmelding | Inntektsmelding;

export enum Dagtype {
    Syk = 'Syk',
    Helg = 'Helg',
    Ferie = 'Ferie',
    Avvist = 'Avvist',
    Ubestemt = 'Ubestemt',
    Arbeidsdag = 'Arbeidsdag',
    Egenmelding = 'Egenmelding',
    Foreldet = 'Foreldet sykedag',
    Arbeidsgiverperiode = 'Arbeidsgiverperiode'
}

export enum Kildetype {
    Søknad = 'SØ',
    Sykmelding = 'SM',
    Inntektsmelding = 'IM'
}

export interface Sykdomsdag {
    dato: Dayjs;
    type: Dagtype;
    kilde?: Kildetype;
    gradering?: number;
}

export interface Utbetalingsdag {
    dato: Dayjs;
    type: Dagtype;
    gradering?: number;
    utbetaling?: number;
}

export enum Vedtaksperiodetilstand {
    TilUtbetaling = 'tilUtbetaling',
    Utbetalt = 'utbetalt',
    Oppgaver = 'oppgaver',
    Venter = 'venter',
    Avslag = 'avslag',
    IngenUtbetaling = 'ingenUtbetaling',
    Feilet = 'feilet',
    Ukjent = 'ukjent',
    TilInfotrygd = 'tilInfotrygd'
}

export interface UferdigVedtaksperiode {
    id: string;
    fom: Dayjs;
    tom: Dayjs;
    kanVelges: boolean;
    tilstand: Vedtaksperiodetilstand;
}

export interface Vedtaksperiode {
    id: string;
    fom: Dayjs;
    tom: Dayjs;
    tilstand: Vedtaksperiodetilstand;
    kanVelges: boolean;
    utbetalingsreferanse: string;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    godkjentAv?: string;
    godkjenttidspunkt?: Dayjs;
    vilkår: Vilkår;
    sykepengegrunnlag: Sykepengegrunnlag;
    inntektskilder: Inntektskilde[];
    oppsummering: Oppsummering;
    hendelser: Hendelse[];
    rawData: SpleisVedtaksperiode;
}

export interface Arbeidsgiver {
    organisasjonsnummer: string;
    id: string;
    vedtaksperioder: (Vedtaksperiode | UferdigVedtaksperiode)[];
}

export type Kjønn = 'Mann' | 'Kvinne' | 'Ukjent';

export interface Personinfo {
    navn: string;
    kjønn: Kjønn;
    fødselsdato: Dayjs;
    fnr?: string;
}

export interface Person {
    aktørId: string;
    arbeidsgivere: Arbeidsgiver[];
    personinfo: Personinfo;
    fødselsnummer: string;
}

export interface ProviderProps {
    children: ReactChild;
}

export interface Tildeling {
    behovId: string;
    userId: string;
}
