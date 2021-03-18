import { Dayjs } from 'dayjs';
import { Utbetalingsperiode } from 'external-types';
import { UtbetalingshistorikkElement } from '../client/modell/UtbetalingshistorikkElement';

export interface Periode {
    fom: Dayjs;
    tom: Dayjs;
}

export interface Basisvilkår {
    oppfylt?: boolean;
}

export interface DagerIgjen extends Basisvilkår {
    dagerBrukt?: number;
    skjæringstidspunkt: Dayjs;
    førsteSykepengedag?: Dayjs;
    maksdato?: Dayjs;
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
    medlemskap?: Basisvilkår;
}

export interface SykepengegrunnlagVilkår {
    sykepengegrunnlag?: number;
    oppfylt?: boolean;
    grunnebeløp: number;
}

export interface Arbeidsforhold {
    stillingstittel: string;
    stillingsprosent: number;
    startdato: Dayjs;
    sluttdato?: Dayjs;
}

export interface Oppsummering {
    antallUtbetalingsdager: number;
    totaltTilUtbetaling: number;
}

export enum Kildetype {
    Sykmelding = 'Sykmelding',
    Søknad = 'Søknad',
    Inntektsmelding = 'Inntektsmelding',
    Saksbehandler = 'Saksbehandler',
}

export enum Periodetype {
    Forlengelse = 'forlengelse',
    Førstegangsbehandling = 'førstegangsbehandling',
    Infotrygdforlengelse = 'infotrygdforlengelse',
    OvergangFraInfotrygd = 'overgangFraIt',
    Stikkprøve = 'stikkprøve',
    RiskQa = 'riskQa',
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
    funn: Faresignal[];
    kontrollertOk: Faresignal[];
}

export interface Faresignal {
    kreverSupersaksbehandler: boolean;
    beskrivelse: string;
    kategori: string[];
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
    Annullert = 'Annullert',
}

export interface Sykdomsdag {
    dato: Dayjs;
    type: Dagtype;
    kildeId?: string;
    kilde?: Kildetype;
    gradering?: number;
}

export interface Utbetalingsdag {
    dato: Dayjs;
    type: Dagtype;
    gradering?: number;
    totalGradering?: number;
    utbetaling?: number;
    avvistÅrsak?: {
        tekst: string;
        paragraf?: string;
    };
}

export enum Vedtaksperiodetilstand {
    TilUtbetaling = 'tilUtbetaling',
    Utbetalt = 'utbetalt',
    Oppgaver = 'oppgaver',
    Venter = 'venter',
    VenterPåKiling = 'venterPåKiling',
    Avslag = 'avslag',
    IngenUtbetaling = 'ingenUtbetaling',
    KunFerie = 'kunFerie',
    Feilet = 'feilet',
    Ukjent = 'ukjent',
    TilInfotrygd = 'tilInfotrygd',
    Annullert = 'annullert',
    TilAnnullering = 'tilAnnullering',
    AnnulleringFeilet = 'annulleringFeilet',
}

export interface UfullstendigVedtaksperiode {
    id: string;
    fom: Dayjs;
    tom: Dayjs;
    kanVelges: boolean;
    tilstand: Vedtaksperiodetilstand;
    utbetalingstidslinje?: Utbetalingsdag[];
    erNyeste?: boolean;
    beregningIder?: string[];
}

export interface Vedtaksperiode {
    id: string;
    fom: Dayjs;
    tom: Dayjs;
    gruppeId: string;
    arbeidsgivernavn: string;
    forlengelseFraInfotrygd?: boolean;
    periodetype: Periodetype;
    behandlet: boolean;
    tilstand: Vedtaksperiodetilstand;
    oppgavereferanse?: string;
    kanVelges: boolean;
    utbetalingsreferanse?: string;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    automatiskBehandlet: boolean;
    godkjentAv?: string;
    godkjenttidspunkt?: Dayjs;
    vilkår?: Vilkår;
    inntektsgrunnlag: Inntektsgrunnlag;
    utbetalinger?: Utbetalinger;
    oppsummering: Oppsummering;
    simuleringsdata?: Simulering;
    hendelser: Hendelse[];
    aktivitetslog: string[];
    risikovurdering?: Risikovurdering;
    overstyringer: Overstyring[];
    erNyeste: boolean;
    beregningIder: string[];
    inntektskilde: Inntektskilde;
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

export interface AnnullertAvSaksbehandler {
    annullertTidspunkt: Dayjs;
    saksbehandlerNavn: string;
}

export interface Simulering {
    totalbeløp: number;
    perioder: Utbetalingsperiode[];
}

export interface Arbeidsgiver {
    organisasjonsnummer: string;
    id: string;
    navn: string;
    utbetalingshistorikk: UtbetalingshistorikkElement[];
    vedtaksperioder: (Vedtaksperiode | UfullstendigVedtaksperiode)[];
}

export type Kjønn = 'mann' | 'kvinne' | 'ukjent';

export interface Personinfo {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    fødselsdato: Dayjs | null;
    kjønn: Kjønn;
    fnr?: string;
}

export interface Person {
    aktørId: string;
    arbeidsgivere: Arbeidsgiver[];
    utbetalinger: UtbetalingshistorikkUtbetaling[];
    personinfo: Personinfo;
    fødselsnummer: string;
    infotrygdutbetalinger: Infotrygdutbetaling[];
    enhet: Enhetsinfo;
    tildeltTil?: string;
    erPåVent?: boolean;
    dødsdato?: Dayjs;
}

export interface Enhetsinfo {
    id: string;
    navn: string;
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

export interface Overstyring {
    hendelseId: string;
    begrunnelse: string;
    timestamp: Dayjs;
    overstyrteDager: OverstyrtDag[];
    saksbehandlerNavn: string;
}

export interface OverstyrtDag {
    dato: Dayjs;
    type: 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | Dagtype;
    grad?: number;
}

export interface Inntektsgrunnlag {
    organisasjonsnummer: string;
    skjæringstidspunkt: Dayjs;
    sykepengegrunnlag?: number;
    omregnetÅrsinntekt?: number;
    sammenligningsgrunnlag?: number;
    avviksprosent?: number;
    maksUtbetalingPerDag?: number;
    inntekter: Arbeidsgiverinntekt[];
}

export interface Arbeidsgiverinntekt {
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
    omregnetÅrsinntekt?: OmregnetÅrsinntekt;
    sammenligningsgrunnlag?: Sammenligningsgrunnlag;
    bransjer: string[];
    forskuttering: boolean;
    refusjon: boolean;
    arbeidsforhold: Arbeidsforhold[];
}

export interface OmregnetÅrsinntekt {
    kilde: Inntektskildetype;
    beløp: number;
    månedsbeløp: number;
    inntekterFraAOrdningen?: InntekterFraAOrdningen[]; //kun gyldig for A-ordningen
}

export enum Inntektskildetype {
    Saksbehandler = 'Saksbehandler',
    Inntektsmelding = 'Inntektsmelding',
    Infotrygd = 'Infotrygd',
    AOrdningen = 'AOrdningen',
}

export interface InntekterFraAOrdningen {
    måned: string;
    sum: number;
}

export interface Sammenligningsgrunnlag {
    beløp: number;
    inntekterFraAOrdningen: InntekterFraAOrdningen[];
}

export interface UtbetalingshistorikkUtbetaling {
    status: string;
    type: string;
    arbeidsgiverOppdrag: UtbetalingshistorikkArbeidsgiverOppdrag;
    annullering?: AnnullertAvSaksbehandler;
}

export interface UtbetalingshistorikkArbeidsgiverOppdrag {
    orgnummer: string;
    fagsystemId: string;
    utbetalingslinjer: UtbetalingshistorikkUtbetalingslinje[];
}

export interface UtbetalingshistorikkUtbetalingslinje {
    fom: Dayjs;
    tom: Dayjs;
}

export interface Oppgave {
    oppgavereferanse: string;
    tildeltTil?: string;
    erPåVent?: boolean;
    opprettet: string;
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    fødselsnummer: string;
    aktørId: string;
    antallVarsler: number;
    periodetype: Periodetype;
    inntektskilde: Inntektskilde;
    boenhet: Boenhet;
    tildeling?: Tildeling
}

interface Tildeling {
    epost: string,
    oid: string,
    påVent: boolean
}

interface Boenhet {
    id: string;
    navn: string;
}

export interface TildeltOppgave extends Oppgave {
    tildeltTil: string;
}

export enum Inntektskilde {
    EnArbeidsgiver = 'EN_ARBEIDSGIVER',
    FlereArbeidsgivere = 'FLERE_ARBEIDSGIVERE',
}

