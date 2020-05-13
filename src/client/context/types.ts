import { ReactChild } from 'react';
import { Dayjs } from 'dayjs';
import { SpesialistVedtaksperiode, Utbetalingsperiode } from './mapping/external.types';
import { PersonNavn } from '../../types';

export interface Periode {
    fom: Dayjs;
    tom: Dayjs;
}

export interface DagerIgjen {
    dagerBrukt: number;
    førsteFraværsdag: Dayjs;
    førsteSykepengedag?: Dayjs;
    maksdato: Dayjs;
    oppfylt?: boolean;
    gjenståendeDager?: number;
    tidligerePerioder: Periode[];
}

export interface Søknadsfrist {
    oppfylt?: boolean;
    søknadTom?: Dayjs;
    sendtNav?: Dayjs;
}

export interface Opptjening {
    antallOpptjeningsdagerErMinst: number;
    opptjeningFra: Dayjs;
    oppfylt?: boolean;
}

export interface Alder {
    alderSisteSykedag: number;
    oppfylt: boolean;
}

export interface Vilkår {
    alder: Alder;
    dagerIgjen: DagerIgjen;
    sykepengegrunnlag: SykepengegrunnlagVilkår;
    opptjening?: Opptjening;
    søknadsfrist?: Søknadsfrist;
}

export interface SykepengegrunnlagVilkår {
    sykepengegrunnlag?: number;
    oppfylt?: boolean;
    grunnebeløp: number;
}

export interface Sykepengegrunnlag {
    avviksprosent?: number;
    årsinntektFraAording?: number;
    årsinntektFraInntektsmelding?: number;
}

export interface Inntektskilde {
    organisasjonsnummer: string;
    forskuttering: boolean;
    refusjon: boolean;
    årsinntekt?: number;
    månedsinntekt?: number;
}

export interface Oppsummering {
    antallUtbetalingsdager: number;
    totaltTilUtbetaling: number;
}

export enum Kildetype {
    Sykmelding = 'Sykmelding',
    Søknad = 'Søknad',
    Inntektsmelding = 'Inntektsmelding'
}

export interface Søknad {
    id: string;
    type: Kildetype.Søknad;
    fom: Dayjs;
    tom: Dayjs;
    rapportertDato?: Dayjs;
    sendtNav: Dayjs;
}

export interface Sykmelding {
    id: string;
    type: Kildetype.Sykmelding;
    fom: Dayjs;
    tom: Dayjs;
    rapportertDato?: Dayjs;
}

export interface Inntektsmelding {
    id: string;
    type: Kildetype.Inntektsmelding;
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
    Foreldet = 'Foreldet',
    Arbeidsgiverperiode = 'Arbeidsgiverperiode'
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
    gruppeId: string;
    forlengelseFraInfotrygd: ForlengelseFraInfotrygd;
    tilstand: Vedtaksperiodetilstand;
    kanVelges: boolean;
    utbetalingsreferanse?: string;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    godkjentAv?: string;
    godkjenttidspunkt?: Dayjs;
    vilkår?: Vilkår;
    sykepengegrunnlag: Sykepengegrunnlag;
    inntektskilder: Inntektskilde[];
    utbetalinger?: Utbetalinger;
    oppsummering: Oppsummering;
    simuleringsdata?: Simulering;
    hendelser: Hendelse[];
    aktivitetslog: Aktivitet[];
    rawData: SpesialistVedtaksperiode;
}

export enum ForlengelseFraInfotrygd {
    IKKE_ETTERSPURT = 'IKKE_ETTERSPURT',
    JA = 'JA',
    NEI = 'NEI'
}

export interface Utbetalinger {
    arbeidsgiverUtbetaling?: Utbetaling;
    personUtbetaling?: Utbetaling;
}

export interface Utbetaling {
    fagsystemId: string;
    linjer: Utbetalingslinje[];
}

export interface Utbetalingslinje {
    fom: Dayjs;
    tom: Dayjs;
    dagsats: number;
    grad: number;
}

export interface Simulering {
    totalbeløp: number;
    perioder: Utbetalingsperiode[];
}

export interface Aktivitet {
    melding: string;
    alvorlighetsgrad: Alvorlighetsgrad;
    tidsstempel: Dayjs;
}

type Alvorlighetsgrad = 'W';

export interface Arbeidsgiver {
    organisasjonsnummer: string;
    id: string;
    navn: string;
    vedtaksperioder: (Vedtaksperiode | UferdigVedtaksperiode)[];
}

export type Kjønn = 'Mann' | 'Kvinne' | 'Ukjent';

export interface Personinfo {
    kjønn: Kjønn;
    fødselsdato: Dayjs;
    fnr?: string;
}

export interface Person {
    aktørId: string;
    navn: PersonNavn;
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
