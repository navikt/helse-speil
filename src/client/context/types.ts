import { ReactChild } from 'react';

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

interface Fravær extends Periode {
    type: string;
}

interface Søknadsperiode extends Periode {
    avtaltTimer: Optional<string | number>; // TODO: Finn ut av hvordan denne ser ut.
    faktiskGrad: Optional<string | number>; // TODO: Finn ut av hvordan denne ser ut.
    faktiskTimer: Optional<string | number>; // TODO: Finn ut av hvordan denne ser ut.
    sykmeldingsgrad: number;
    sykmeldingstype: Optional<string>; // TODO: Finn ut av hvordan denne ser ut.
}

interface Refusjon {
    beloepPrMnd: Optional<number | string>;
    opphoersdato: Optional<string>;
}

export interface Inntektsmelding {
    status: string;
    refusjon: Refusjon;
    mottattDato: string;
    ferieperioder: undefined[]; // TODO: Finn ut av hvordan denne ser ut.
    arkivreferanse: string;
    arbeidsgiverFnr: Optional<string>;
    arbeidstakerFnr: string;
    beregnetInntekt: string;
    arbeidsforholdId: Optional<string>;
    arbeidsgivertype: string;
    inntektsmeldingId: string;
    virksomhetsnummer: string;
    endringIRefusjoner: undefined[]; // TODO: Finn ut av hvordan denne ser ut.
    førsteFraværsdag: string;
    arbeidsgiverAktorId: Optional<string>;
    arbeidstakerAktorId: string;
    arbeidsgiverperioder: Periode[];
    opphoerAvNaturalytelser: undefined[]; // TODO: Finn ut av hvordan denne ser ut.
    gjenopptakelseNaturalytelser: undefined[]; // TODO: Finn ut av hvordan denne ser ut.
}

interface Arbeidsgiver {
    id: string;
    organisasjonsnummer: string;
    saker: Sak[];
}

interface ArbeidsgiverISøknad {
    orgnummer: string;
    navn: Optional<string>;
}

export interface Søknad extends Periode {
    id: string;
    type: string;
    fravar: Fravær[];
    status: string;
    aktorId: string;
    mottaker: Optional<any>; // TODO: Finn ut av hvordan denne ser ut.
    sendtNav: string;
    sporsmal: Optional<any>; // TODO: Finn ut av hvordan denne ser ut.
    opprettet: string;
    korrigerer: Optional<any>; // TODO: Finn ut av hvordan denne ser ut.
    korrigertAv: Optional<any>; // TODO: Finn ut av hvordan denne ser ut.
    arbeidsgiver: ArbeidsgiverISøknad;
    avsendertype: Optional<any>; // TODO: Finn ut av hvordan denne ser ut.
    ettersending: boolean;
    sykmeldingId: string;
    egenmeldinger: Periode[];
    soknadsperioder: Søknadsperiode[];
    arbeidssituasjon: string;
    arbeidGjenopptatt: Optional<any>; // TODO: Finn ut av hvordan denne ser ut.
    papirsykmeldinger: Optional<any>; // TODO: Finn ut av hvordan denne ser ut.
    sendtArbeidsgiver: string;
    startSyketilfelle: string;
    sykmeldingSkrevet: Optional<any>; // TODO: Finn ut av hvordan denne ser ut.
    andreInntektskilder: Optional<any>; // TODO: Finn ut av hvordan denne ser ut.
    soktUtenlandsopphold: Optional<boolean>; // TODO: Finn ut av hvordan denne ser ut.
    arbeidsgiverForskutterer: string;
}

export interface Dag {
    dato: string;
    type: string;
    erstatter: Dag[];
    hendelseId: string;
}

export interface Hendelse {
    type: string;
    hendelseId: string;
    inntektsmelding?: Inntektsmelding;
    søknad?: Søknad;
}

interface Sykdomstidslinje {
    dager: Dag[];
    hendelser: Hendelse[];
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
    chronology: { id: string; calendarType: string; };
}

export interface Sak {
    id: string;
    aktørId: string;
    maksdato: string;
    godkjentAv: Optional<string>;
    tilstandType: string;
    sykdomstidslinje: Sykdomstidslinje;
    utbetalingslinjer?: Utbetalingslinje[];
    organisasjonsnummer: string;
    utbetalingsreferanse?: string;
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
    }
    sykepengegrunnlag: Optional<number>;
    alder: Optional<number>;
}

interface Sykepengegrunnlag {
    dagsats?: number;
    grunnlag: Optional<number>;
    årsinntekt: Optional<number>;
    månedsinntekt: Optional<number>;
}

export interface Personinfo {
    fnr: string;
    fødselsdato: string;
    kjønn: string;
    navn: string;
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
    mottaker: Optional<ArbeidsgiverISøknad>;
    sykepengegrunnlag: Optional<number>;
    utbetalingsreferanse: Optional<string>;
    vedtaksperiodeId: string;
}

export interface UnmappedPerson {
    aktørId: string;
    arbeidsgivere: Arbeidsgiver[];
    skjemaVersjon: number;
}

export interface Person extends UnmappedPerson {
    inngangsvilkår: Inngangsvilkår;
    inntektskilder: Inntektskilder;
    oppsummering: Oppsummering;
    personinfo: Personinfo;
    sykepengegrunnlag: Sykepengegrunnlag;
}

export interface Behov {
    '@behov': string;
    '@id': string;
    '@opprettet': string;
    aktørId: string;
    organisasjonsnummer: string;
    sakskompleksId: string;
    personinfo: Optional<Personinfo>;
}

export interface ProviderProps {
    children: ReactChild;
}

export interface Tildeling {
    behovId: string;
    userId: string;
}
