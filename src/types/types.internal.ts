import { Dayjs } from 'dayjs';
import { Utbetalingsperiode } from 'external-types';

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
    Saksbehandler = 'Saksbehandler',
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
    arbeidsuførhetvurdering: string[];
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
    utbetaling?: number;
    avvistÅrsak?: string;
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
    automatiskBehandlet: boolean;
    godkjentAv?: string;
    godkjenttidspunkt?: Dayjs;
    vilkår?: Vilkår;
    sykepengegrunnlag: Sykepengegrunnlag;
    inntektsgrunnlag?: Inntektsgrunnlag;
    inntektskilder: Inntektskilde[];
    utbetalinger?: Utbetalinger;
    oppsummering: Oppsummering;
    simuleringsdata?: Simulering;
    hendelser: Hendelse[];
    aktivitetslog: string[];
    risikovurdering?: Risikovurdering;
    overstyringer: Overstyring[];
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

export interface Arbeidsgiver {
    organisasjonsnummer: string;
    id: string;
    navn: string;
    vedtaksperioder: (Vedtaksperiode | UfullstendigVedtaksperiode)[];
}

export type Kjønn = 'Mann' | 'Kvinne' | 'Ukjent';

export interface Personinfo {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    fødselsdato: Dayjs;
    kjønn: Kjønn;
    fnr?: string;
}

export interface Person {
    aktørId: string;
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
    gjeldendeArbeidsgiver: string;
    skjæringstidspunkt: Dayjs;
    sykepengegrunnlag: number;
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag?: number;
    avviksprosent?: number;
    maksUtbetalingPerDag: number;
    inntekter: Arbeidsgiverinntekt[];
}

export interface Arbeidsgiverinntekt {
    arbeidsgiver: string;
    omregnetÅrsinntekt: OmregnetÅrsinntekt;
    sammenligningsgrunnlag?: Sammenligningsgrunnlag;
}

export interface OmregnetÅrsinntekt {
    kilde: Inntektkilde;
    beløp: number;
    månedsbeløp: number;
    inntekterFraAOrdningen?: InntekterFraAOrdningen[]; //kun gyldig for A-ordningen
}

export enum Inntektkilde {
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
