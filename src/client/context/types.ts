import { ReactChild } from 'react';
import { Personinfo } from '../../types';

export type Optional<T> = T | undefined | null;

export type Hendelsetype = 'Inntektsmelding' | 'Sykmelding' | 'Søknad';

export const HendelsetypeMap = {
    Inntektsmelding: 'Inntektsmelding',
    Sykmelding: 'NySøknad',
    Søknad: 'SendtSøknad'
};

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

export interface Arbeidsgiver {
    id: string;
    organisasjonsnummer: string;
    vedtaksperioder: Vedtaksperiode[];
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
    sendtNav: string;
    perioder: Søknadsperiode[];
    tom: string;
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
    hendelseType: Hendelsetype;
}

export interface Hendelse {
    type: string;
    hendelseId: string;
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
        søknadTom: string;
        sendtNav: string;
    };
    opptjening?: {
        antallOpptjeningsdagerErMinst: number;
        opptjeningFra: string;
        harOpptjening: boolean;
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
    fødselsnummer: string;
    arbeidsgivere: Arbeidsgiver[];
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
