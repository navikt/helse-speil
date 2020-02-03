import { ReactChild } from 'react';
import { Personinfo } from '../../types';

export type Optional<T> = T | undefined | null;

export type Hendelsetype = 'Inntektsmelding' | 'SendtSøknad' | 'NySøknad';

export enum Dagtype {
    SYKEDAG = 'SYKEDAG',
    FERIEDAG = 'FERIEDAG',
    STUDIEDAG = 'STUDIEDAG',
    ARBEIDSDAG = 'ARBEIDSDAG',
    UBESTEMTDAG = 'UBESTEMTDAG',
    SYK_HELGEDAG = 'SYK_HELGEDAG',
    UTENLANDSDAG = 'UTENLANDSDAG',
    IMPLISITT_DAG = 'IMPLISITT_DAG',
    PERMISJONSDAG = 'PERMISJONSDAG',
    EGENMELDINGSDAG = 'EGENMELDINGSDAG'
}

export interface Periode {
    fom: string;
    tom: string;
}

export interface Sykeperiode extends Periode {
    sykdomsgrad: number;
}

interface Fravær extends Periode {
    type: string;
}

interface Søknadsperiode extends Periode {
    faktiskGrad: number;
    grad: number;
    type: string;
}

interface Refusjon {
    beløpPrMåned: Optional<number | string>;
    opphørsdato: Optional<string>;
    endringerIRefusjon?: string[];
}

export interface Inntektsmelding extends Hendelse {
    refusjon: Refusjon;
    mottattDato: string;
    ferieperioder: undefined[]; // TODO: Finn ut av hvordan denne ser ut.
    fødselsnummer: string;
    aktørId: string;
    beregnetInntekt: number;
    orgnummer: string;
    førsteFraværsdag: string;
    arbeidsgiverperioder: Periode[];
}

interface Arbeidsgiver {
    id: string;
    organisasjonsnummer: string;
    vedtaksperioder: Vedtaksperiode[];
}

interface ArbeidsgiverISøknad {
    orgnummer: string;
    navn: Optional<string>;
}

export interface Søknad extends Hendelse {
    fnr: string;
    aktørId: string;
    orgnummer: string;
    rapportertdato: string;
    sykeperioder: Sykeperiode[];
}

export interface SendtSøknad extends Søknad {
    fnr: string;
    aktørId: string;
    orgnummer: string;
    rapportertdato: string;
    perioder: Søknadsperiode[];
}

export interface NySøknad extends Søknad {
    fnr: string;
    aktørId: string;
    orgnummer: string;
    rapportertdato: string;
}

export interface Dag {
    dagen: string;
    type: string;
    erstatter: Dag[];
    hendelseId: string;
}

export interface Hendelse {
    type: string;
    hendelseId: string;
}

interface Sykdomstidslinje {
    dager: Dag[];
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
    beregnetÅrsinntekt: number;
    avviksprosent: number;
}

export interface Vedtaksperiode {
    id: string;
    aktørId: string;
    maksdato: string;
    godkjentAv?: string;
    tilstand: string;
    sykdomstidslinje: Sykdomstidslinje;
    utbetalingslinjer?: Utbetalingslinje[];
    organisasjonsnummer: string;
    utbetalingsreferanse?: string;
    dataForVilkårsvurdering?: DataForVilkårsvurdering;
    førsteFraværsdag: string;
    inntektFraInntektsmelding: number;
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
        yrkesstatus: Optional<string>;
    };
    søknadsfrist: {
        innen3Mnd: boolean;
        søknadTom: Optional<string>;
        sendtNav: Optional<string>;
    };
    sykepengegrunnlag: Optional<number>;
    alder: Optional<number>;
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
    antallDager: number;
    beløp: number;
    dagsats?: number;
    mottakerOrgnr: Optional<string>;
    sykepengegrunnlag: Optional<number>;
    utbetalingsreferanse: Optional<string>;
    vedtaksperiodeId: string;
}

export interface UnmappedPerson {
    aktørId: string;
    arbeidsgivere: Arbeidsgiver[];
    skjemaVersjon: number;
    hendelser: Hendelse[];
}

export interface Person extends UnmappedPerson {
    inngangsvilkår: Inngangsvilkår;
    inntektskilder: Inntektskilder;
    oppsummering: Oppsummering;
    personinfo: Personinfo;
    sykepengegrunnlag: Sykepengegrunnlag;
}

export interface ProviderProps {
    children: ReactChild;
}

export interface Tildeling {
    behovId: string;
    userId: string;
}
