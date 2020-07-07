import { ReactChild } from 'react';
import { Dayjs } from 'dayjs';
import { SpesialistVedtaksperiode, Utbetalingsperiode } from './mapping/types.external';
import { PersonNavn } from '../../types';

export interface Periode {
    fom: Dayjs;
    tom: Dayjs;
}

export interface Basisvilkår {
    oppfylt?: boolean;
}

export interface DagerIgjen extends Basisvilkår {
    dagerBrukt: number;
    førsteFraværsdag: Dayjs;
    førsteSykepengedag?: Dayjs;
    maksdato: Dayjs;
    gjenståendeDager?: number;
    tidligerePerioder: Periode[];
}

export interface Søknadsfrist extends Basisvilkår {
    søknadTom?: Dayjs;
    sendtNav?: Dayjs;
}

export interface Opptjening extends Basisvilkår {
    antallOpptjeningsdagerErMinst: number;
    opptjeningFra: Dayjs;
}

export interface Alder extends Basisvilkår {
    alderSisteSykedag: number;
}

export interface Vilkår {
    alder: Alder;
    dagerIgjen: DagerIgjen;
    sykepengegrunnlag: SykepengegrunnlagVilkår;
    opptjening?: Opptjening | Basisvilkår;
    søknadsfrist?: Søknadsfrist;
}

export interface SykepengegrunnlagVilkår {
    sykepengegrunnlag?: number;
    oppfylt?: boolean;
    grunnebeløp: number;
}

export interface Sykepengegrunnlag {
    sykepengegrunnlag?: number;
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
    Inntektsmelding = 'Inntektsmelding',
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

export interface Risikovurdering {
    vedtaksperiodeId: string;
    opprettet: Dayjs;
    samletScore: number;
    begrunnelser: string[];
    ufullstendig: boolean;
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
    Arbeidsgiverperiode = 'Arbeidsgiverperiode',
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

export enum Periodetype {
    Forlengelse = 'forlengelse',
    Infotrygdforlengelse = 'infotrygdForlengelse',
    Førstegangsbehandling = 'førstegangsbehandling',
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
    TilInfotrygd = 'tilInfotrygd',
    Annullert = 'annullert',
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
    forlengelseFraInfotrygd?: boolean;
    periodetype: Periodetype;
    behandlet: boolean;
    tilstand: Vedtaksperiodetilstand;
    oppgavereferanse: string;
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
    risikovurdering?: Risikovurdering;
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
    infotrygdutbetalinger: Infotrygdutbetaling[];
    enhet: Enhetsinfo;
    tildeltTil?: string;
}

export interface Enhetsinfo {
    id: string;
    navn: string;
}

export interface ProviderProps {
    children: ReactChild;
}

export interface Tildeling {
    oppgavereferanse: string;
    userId: string;
}

export interface Infotrygdutbetaling {
    fom: Dayjs;
    tom: Dayjs;
    grad?: number;
    dagsats?: number;
    typetekst: InfotrygdTypetekst;
    organisasjonsnummer: string;
}

export enum InfotrygdTypetekst {
    FERIE = 'Ferie',
    UTBETALING = 'Utbetaling',
    ARBEIDSGIVERREFUSJON = 'ArbRef',
    UKJENT = 'Ukjent',
    TILBAKEFØRT = 'Tilbakeført',
}
