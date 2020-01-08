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
    sykmeldingsgrad: number;
    avtaltTimer?: string | number; // TODO: Finn ut av hvordan denne ser ut.
    faktiskGrad?: string | number; // TODO: Finn ut av hvordan denne ser ut.
    faktiskTimer?: string | number; // TODO: Finn ut av hvordan denne ser ut.
    sykmeldingstype?: string; // TODO: Finn ut av hvordan denne ser ut.
}

interface Refusjon {
    beloepPrMnd?: number | string;
    opphoersdato?: string;
}

export interface Inntektsmelding {
    status: string;
    refusjon: Refusjon;
    mottattDato: string;
    ferieperioder: undefined[]; // TODO: Finn ut av hvordan denne ser ut.
    arkivreferanse: string;
    arbeidstakerFnr: string;
    beregnetInntekt: string;
    arbeidsgivertype: string;
    virksomhetsnummer: string;
    inntektsmeldingId: string;
    førsteFraværsdag: string;
    endringIRefusjoner: undefined[]; // TODO: Finn ut av hvordan denne ser ut.
    arbeidstakerAktorId: string;
    arbeidsgiverperioder: Periode[];
    opphoerAvNaturalutelser: undefined[]; // TODO: Finn ut av hvordan denne ser ut.
    gjenopptakelseNaturalytelser: undefined[]; // TODO: Finn ut av hvordan denne ser ut.
    arbeidsgiverFnr?: string;
    arbeidsforholdId?: string;
    arbeidsgiverAktorId?: string;
}

interface Arbeidsgiver {
    id: string;
    organisasjonsnummer: string;
    saker: Sak[];
}

interface ArbeidsgiverISøknad {
    navn: string;
    orgnummer: string;
}

export interface Søknad extends Periode {
    id: string;
    type: string;
    status: string;
    fravar: Fravær[];
    aktorId: string;
    sendtNav: string;
    opprettet: string;
    sykmeldingId: string;
    ettersending: boolean;
    arbeidsgiver: ArbeidsgiverISøknad;
    egenmeldinger: Periode[];
    soknadsperioder: Søknadsperiode[];
    arbeidssituasjon: string;
    startSyketilfelle: string;
    sendtArbeidsgiver: string;
    arbeidsgiverForskutterer: 'JA' | 'NEI';
    sporsmål?: undefined; // TODO: Finn ut av hvordan denne ser ut.
    mottaker?: undefined; // TODO: Finn ut av hvordan denne ser ut.
    korrigerer?: undefined; // TODO: Finn ut av hvordan denne ser ut.
    korrigertAv?: undefined; // TODO: Finn ut av hvordan denne ser ut.
    avsendertype?: undefined; // TODO: Finn ut av hvordan denne ser ut.
    sykmeldingSkrevet?: undefined; // TODO: Finn ut av hvordan denne ser ut.
    papirsykmeldinger?: undefined; // TODO: Finn ut av hvordan denne ser ut.
    arbeidsGjenopptatt?: undefined; // TODO: Finn ut av hvordan denne ser ut.
    andreInntektskilder?: undefined; // TODO: Finn ut av hvordan denne ser ut.
    soktUtenlandsopphold?: boolean; // TODO: Finn ut av hvordan denne ser ut.
}

interface Dag {
    dato: string;
    type: Dagtype | string;
    erstatter: Dag[];
    hendelseId: string;
}

export interface Hendelse {
    type: Hendelsetype | string;
    hendelseId: string;
    inntektsmelding?: Inntektsmelding;
    søknad?: Søknad;
}

interface Sykdomstidslinje {
    dager: Dag[];
    hendelser: Hendelse[];
}

export interface Utbetalingslinje {
    dagsats: number;
    fom: string;
    tom: string;
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
    tilstandType: string;
    sykdomstidslinje: Sykdomstidslinje;
    utbetalingslinjer: Utbetalingslinje[];
    organisasjonsnummer: string;
    godkjentAv?: string;
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
        førsteSykepengedag: string;
        maksdato: string;
        tidligerePerioder: Periode[];
        yrkesstatus?: string;
    };
    søknadsfrist: {
        innen3Mnd: boolean;
        søknadTom?: string;
        sendtNav?: string;
    }
    sykepengegrunnlag: Optional<number>;
    alder: Optional<number>;
}

interface Sykepengegrunnlag {
    dagsats: number;
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
    månedsinntekt?: Optional<number>;
}

interface Oppsummering {
    antallDager: number;
    beløp: number;
    dagsats: number;
    mottaker?: ArbeidsgiverISøknad;
    sykepengegrunnlag: Optional<number>;
    utbetalingsreferanse: Optional<string>;
    sakskompleksId: string;
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
    personinfo?: Personinfo;
}

export interface ProviderProps {
    children: ReactChild;
}

export interface Tildeling {
    behovId: string;
    userId: string;
}
