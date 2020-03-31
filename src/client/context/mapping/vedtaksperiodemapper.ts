import {
    DagerIgjen,
    Hendelse,
    Hendelsestype,
    Inntektskilde,
    Oppsummering,
    Opptjening,
    Personinfo,
    Søknadsfrist,
    UferdigVedtaksperiode,
    Vedtaksperiode,
    Vedtaksperiodetilstand
} from '../types';
import dayjs, { Dayjs } from 'dayjs';
import {
    SpleisHendelse,
    SpleisHendelsetype,
    SpleisInntektsmelding,
    SpleisSykdomsdag,
    SpleisSykdomsdagtype,
    SpleisSykmelding,
    SpleisSøknad,
    SpleisVedtaksperiode,
    SpleisVedtaksperiodetilstand
} from './external.types';
import { tilSykdomstidslinje, tilUtbetalingstidslinje } from './dagmapper';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT } from '../../utils/date';

export const somDato = (dato: string): Dayjs => dayjs(dato, ISO_DATOFORMAT);
export const somKanskjeDato = (dato?: string): Dayjs | undefined => (dato ? somDato(dato) : undefined);
export const somTidspunkt = (dato: string): Dayjs => dayjs(dato, ISO_TIDSPUNKTFORMAT);

export const mapUferdigVedtaksperiode = (periode: SpleisVedtaksperiode): UferdigVedtaksperiode => ({
    id: periode.id,
    fom: dayjs(periode.fom),
    tom: dayjs(periode.tom),
    kanVelges: false,
    tilstand: Vedtaksperiodetilstand.Ukjent
});

export const tilHendelse = (hendelse: SpleisHendelse): Hendelse => {
    switch (hendelse.type) {
        case SpleisHendelsetype.INNTEKTSMELDING:
            return {
                id: hendelse.id,
                type: Hendelsestype.Inntektsmelding,
                beregnetInntekt: (hendelse as SpleisInntektsmelding).beregnetInntekt,
                mottattTidspunkt: somTidspunkt((hendelse as SpleisInntektsmelding).mottattDato)
            };
        case SpleisHendelsetype.SØKNAD_ARBEIDSGIVER:
        case SpleisHendelsetype.SØKNAD_NAV:
            return {
                id: (hendelse as SpleisSøknad).id,
                type: Hendelsestype.Søknad,
                fom: somDato((hendelse as SpleisSøknad).fom),
                tom: somDato((hendelse as SpleisSøknad).tom),
                sendtNav: somDato(((hendelse as SpleisSøknad) as SpleisSøknad).sendtNav),
                rapportertDato: somKanskjeDato((hendelse as SpleisSøknad).rapportertdato)
            };
        case SpleisHendelsetype.SYKMELDING:
            return {
                id: (hendelse as SpleisSykmelding).id,
                type: Hendelsestype.Sykmelding,
                fom: somDato((hendelse as SpleisSykmelding).fom),
                tom: somDato((hendelse as SpleisSykmelding).tom),
                rapportertDato: somKanskjeDato((hendelse as SpleisSykmelding).rapportertdato)
            };
    }
};

export const mapVedtaksperiode = (
    unmappedPeriode: SpleisVedtaksperiode,
    personinfo: Personinfo,
    organisasjonsnummer: string
): Vedtaksperiode => {
    const somProsent = (avviksprosent: number): number => avviksprosent * 100;
    const somInntekt = (inntekt?: number, måneder: number = 1): number | undefined =>
        inntekt ? +(inntekt * måneder).toFixed(2) : undefined;
    const somÅrsinntekt = (inntekt?: number): number | undefined => somInntekt(inntekt, 12);
    const spleisPeriode = filtrerPaddedeArbeidsdager(unmappedPeriode);

    const sykdomstidslinje = tilSykdomstidslinje(spleisPeriode.sykdomstidslinje);
    const utbetalingstidslinje = tilUtbetalingstidslinje(spleisPeriode.utbetalingstidslinje);

    const vilkår = unmappedPeriode.vilkår;

    const dagerIgjen = (): DagerIgjen | undefined => {
        const sykepengedager = vilkår.sykepengedager;
        return {
            dagerBrukt: sykepengedager.forbrukteSykedager!,
            førsteFraværsdag: somDato(sykepengedager.førsteFraværsdag!),
            førsteSykepengedag: somDato(sykepengedager.førsteSykepengedag!),
            maksdato: somDato(sykepengedager.maksdato!),
            tidligerePerioder: []
        };
    };

    const opptjening = (): Opptjening | undefined => {
        const opptjening = vilkår.opptjening;
        if (opptjening === undefined) return undefined;
        return {
            antallOpptjeningsdagerErMinst: opptjening.antallKjenteOpptjeningsdager!,
            harOpptjening: opptjening.oppfylt!,
            opptjeningFra: somDato(opptjening.fom!)
        };
    };

    const søknadsfrist = (): Søknadsfrist | undefined => {
        const søknadsfrist = vilkår.søknadsfrist;
        if (søknadsfrist === undefined) return undefined;
        return {
            sendtNav: somDato(søknadsfrist.sendtNav),
            søknadTom: somDato(søknadsfrist.søknadTom),
            // TODO: oppfylt undefined burde legge kravet i liste over ting vi ikke har sjekket
            innen3Mnd: søknadsfrist.oppfylt ?? false
        };
    };

    const inntektskilder: Inntektskilde[] = [
        {
            organisasjonsnummer,
            månedsinntekt: somInntekt(unmappedPeriode.inntektFraInntektsmelding),
            årsinntekt: somÅrsinntekt(unmappedPeriode.inntektFraInntektsmelding),
            refusjon: true,
            forskuttering: true
        }
    ];

    const sykepengegrunnlag = {
        årsinntektFraAording: unmappedPeriode.dataForVilkårsvurdering?.beregnetÅrsinntektFraInntektskomponenten,
        årsinntektFraInntektsmelding: somÅrsinntekt(unmappedPeriode.inntektFraInntektsmelding),
        avviksprosent: somProsent(unmappedPeriode.dataForVilkårsvurdering?.avviksprosent)
    };

    const oppsummering: Oppsummering = {
        antallUtbetalingsdager: unmappedPeriode.utbetalingstidslinje.filter(dag => dag.utbetaling && dag.utbetaling > 0)
            .length,
        totaltTilUtbetaling: unmappedPeriode.totalbeløpArbeidstaker
    };

    const mapTilstand = (tilstand: SpleisVedtaksperiodetilstand): Vedtaksperiodetilstand => {
        const vedtaksperiodeTilstand = Vedtaksperiodetilstand[tilstand];
        if (vedtaksperiodeTilstand === undefined) return Vedtaksperiodetilstand.Ukjent;
        else return vedtaksperiodeTilstand;
    };

    return {
        id: unmappedPeriode.id,
        fom: somDato(unmappedPeriode.fom),
        tom: somDato(unmappedPeriode.tom),
        gruppeId: unmappedPeriode.gruppeId,
        kanVelges:
            ![SpleisVedtaksperiodetilstand.IngenUtbetaling, SpleisVedtaksperiodetilstand.Utbetalt].includes(
                spleisPeriode.tilstand
            ) || unmappedPeriode.totalbeløpArbeidstaker > 0,
        tilstand: mapTilstand(unmappedPeriode.tilstand),
        utbetalingsreferanse: unmappedPeriode.utbetalingsreferanse,
        utbetalingstidslinje: utbetalingstidslinje,
        sykdomstidslinje: sykdomstidslinje,
        godkjentAv: unmappedPeriode.godkjentAv,
        godkjenttidspunkt: somKanskjeDato(unmappedPeriode.godkjenttidspunkt),
        vilkår: {
            alderISykmeldingsperioden: unmappedPeriode.vilkår.alder.alderSisteSykedag,
            dagerIgjen: dagerIgjen(),
            opptjening: opptjening(),
            søknadsfrist: søknadsfrist()
        },
        inntektskilder: inntektskilder,
        sykepengegrunnlag: sykepengegrunnlag,
        oppsummering: oppsummering,
        hendelser: unmappedPeriode.hendelser.map(tilHendelse),
        rawData: unmappedPeriode
    };
};

const filtrerPaddedeArbeidsdager = (vedtaksperiode: SpleisVedtaksperiode): SpleisVedtaksperiode => {
    const arbeidsdagEllerImplisittDag = (dag: SpleisSykdomsdag) =>
        dag.type === SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING ||
        dag.type === SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD ||
        dag.type === SpleisSykdomsdagtype.IMPLISITT_DAG;
    const førsteArbeidsdag = vedtaksperiode.sykdomstidslinje.findIndex(arbeidsdagEllerImplisittDag);
    if (førsteArbeidsdag !== 0) return vedtaksperiode;

    const førsteIkkeArbeidsdag = vedtaksperiode.sykdomstidslinje.findIndex(
        dag =>
            dag.type !== SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING &&
            dag.type !== SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD &&
            dag.type !== SpleisSykdomsdagtype.IMPLISITT_DAG
    );

    return {
        ...vedtaksperiode,
        sykdomstidslinje: [...vedtaksperiode.sykdomstidslinje.slice(førsteIkkeArbeidsdag)]
    };
};
