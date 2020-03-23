import {
    DagerIgjen,
    Hendelse,
    Hendelsestype,
    Inntektskilde,
    Inntektsmelding,
    Opptjening,
    Personinfo,
    Sykmelding,
    Søknad,
    Søknadsfrist,
    UferdigVedtaksperiode,
    Vedtaksperiode,
    Vedtaksperiodetilstand
} from '../types';
import { SpleisVedtaksperiodetilstand } from '../../../types';
import dayjs, { Dayjs } from 'dayjs';
import {
    DataForVilkårsvurdering,
    SpleisSykdomsdag,
    SpleisSykdomsdagtype,
    SpleisVedtaksperiode
} from './external.types';
import { tilSykdomstidslinje, tilUtbetalingstidslinje } from './dagmapper';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT } from '../../utils/date';

export const somDato = (dato: string): Dayjs => dayjs(dato, ISO_DATOFORMAT);
export const somKanskjeDato = (dato?: string): Dayjs | undefined => (dato ? somDato(dato) : undefined);
export const somTidspunkt = (dato: string): Dayjs => dayjs(dato, ISO_TIDSPUNKTFORMAT);

export const mapUferdigVedtaksperiode = ({ id, sykdomstidslinje }: SpleisVedtaksperiode): UferdigVedtaksperiode => ({
    id,
    fom: dayjs(sykdomstidslinje[0]!.dagen),
    tom: dayjs(sykdomstidslinje[sykdomstidslinje.length - 1]!.dagen),
    kanVelges: false,
    tilstand: Vedtaksperiodetilstand.Ukjent
});

export const mapVedtaksperiode = (
    unmappedPeriode: SpleisVedtaksperiode,
    personinfo: Personinfo,
    hendelserForPerson: Hendelse[],
    gjeldendeInntektsmelding: Inntektsmelding,
    dataForVilkårsvurdering?: DataForVilkårsvurdering,
    organisasjonsnummer?: string
): Vedtaksperiode => {
    const somProsent = (avviksprosent?: number): number | undefined =>
        avviksprosent !== undefined ? avviksprosent * 100 : undefined;
    const somInntekt = (inntekt?: number, måneder: number = 1): number | undefined =>
        inntekt ? +(inntekt * måneder).toFixed(2) : undefined;
    const somÅrsinntekt = (inntekt?: number): number | undefined => somInntekt(inntekt, 12);
    const spleisPeriode = filtrerPaddedeArbeidsdager(unmappedPeriode);

    const sykdomstidslinje = tilSykdomstidslinje(spleisPeriode.sykdomstidslinje);
    const utbetalingstidslinje = tilUtbetalingstidslinje(spleisPeriode.utbetalingstidslinje);
    const utbetalingslinjer = spleisPeriode.utbetalingslinjer;

    const totaltTilUtbetaling: number =
        utbetalingstidslinje
            .map(dag => dag.utbetaling)
            .filter(utbetaling => utbetaling !== undefined)
            .reduce((acc: number, dagsats: number) => acc + dagsats, 0) ?? 0;
    const fom = [...sykdomstidslinje].shift()!.dato;
    const tom = [...sykdomstidslinje].pop()!.dato;

    const inntektsmelding: Inntektsmelding = hendelserForPerson.find(
        hendelse => hendelse.type === Hendelsestype.Inntektsmelding
    ) as Inntektsmelding;

    const søknad = hendelserForPerson.find(hendelse => hendelse.type === Hendelsestype.Søknad) as Søknad;
    const sykmelding = hendelserForPerson.find(hendelse => hendelse.type === Hendelsestype.Sykmelding) as Sykmelding;

    const dagsats = utbetalingslinjer?.[0]?.dagsats;

    const alderISykmeldingsperioden = (): number | undefined => {
        const sisteSykedag: Dayjs | undefined = [...sykdomstidslinje].pop()?.dato;
        if (sisteSykedag === undefined || personinfo.fødselsdato === undefined) return undefined;

        return sisteSykedag.diff(personinfo.fødselsdato, 'year', false);
    };

    const dagerIgjen = (): DagerIgjen => {
        const førsteSykepengedag =
            spleisPeriode.utbetalingslinjer && spleisPeriode.utbetalingslinjer.length > 0
                ? dayjs.min(spleisPeriode.utbetalingslinjer.map(linje => somDato(linje.fom)))
                : undefined;
        return {
            dagerBrukt: spleisPeriode.forbrukteSykedager,
            førsteFraværsdag: gjeldendeInntektsmelding.førsteFraværsdag,
            førsteSykepengedag: førsteSykepengedag,
            maksdato: somDato(spleisPeriode.maksdato),
            tidligerePerioder: []
        };
    };

    const opptjening = (): Opptjening | undefined => {
        if (!dataForVilkårsvurdering?.harOpptjening) return undefined;

        const antallOpptjeningsdagerErMinst: number = dataForVilkårsvurdering.antallOpptjeningsdagerErMinst;
        return {
            antallOpptjeningsdagerErMinst: antallOpptjeningsdagerErMinst,
            harOpptjening: dataForVilkårsvurdering.harOpptjening,
            opptjeningFra: somDato(spleisPeriode.førsteFraværsdag).subtract(antallOpptjeningsdagerErMinst, 'day')
        };
    };

    const søknadsfrist = (): Søknadsfrist | undefined => {
        if (søknad === undefined) return undefined;
        return {
            sendtNav: søknad.sendtNav,
            søknadTom: søknad.tom,
            innen3Mnd: søknad.sendtNav && søknad.tom ? søknad.tom.add(3, 'month').isSameOrAfter(søknad.sendtNav) : false
        };
    };

    const inntektskilder: Inntektskilde[] = [
        {
            organisasjonsnummer,
            månedsinntekt: somInntekt(gjeldendeInntektsmelding.beregnetInntekt),
            årsinntekt: somÅrsinntekt(gjeldendeInntektsmelding.beregnetInntekt),
            refusjon: true,
            forskuttering: true
        }
    ];

    const sykepengegrunnlag = {
        årsinntektFraAording: dataForVilkårsvurdering?.beregnetÅrsinntektFraInntektskomponenten,
        årsinntektFraInntektsmelding: somÅrsinntekt(gjeldendeInntektsmelding.beregnetInntekt),
        avviksprosent: somProsent(dataForVilkårsvurdering?.avviksprosent),
        dagsats
    };

    const oppsummering = {
        antallUtbetalingsdager: spleisPeriode.utbetalingstidslinje.filter(dag => dag.utbetaling > 0).length,
        totaltTilUtbetaling
    };

    const mapTilstand = (
        tilstand: SpleisVedtaksperiodetilstand,
        totaltTilUtbetaling: number
    ): Vedtaksperiodetilstand => {
        switch (tilstand) {
            case SpleisVedtaksperiodetilstand.AVSLUTTET:
                return totaltTilUtbetaling > 0
                    ? Vedtaksperiodetilstand.Utbetalt
                    : Vedtaksperiodetilstand.IngenUtbetaling;
            case SpleisVedtaksperiodetilstand.AVVENTER_GODKJENNING:
                return Vedtaksperiodetilstand.Oppgaver;
            case SpleisVedtaksperiodetilstand.TIL_UTBETALING:
                return Vedtaksperiodetilstand.TilUtbetaling;
            case SpleisVedtaksperiodetilstand.UTBETALING_FEILET:
                return Vedtaksperiodetilstand.Feilet;
            case SpleisVedtaksperiodetilstand.START:
            case SpleisVedtaksperiodetilstand.MOTTATT_SYKMELDING_FERDIG_FORLENGELSE:
            case SpleisVedtaksperiodetilstand.MOTTATT_SYKMELDING_UFERDIG_FORLENGELSE:
            case SpleisVedtaksperiodetilstand.MOTTATT_SYKMELDING_FERDIG_GAP:
            case SpleisVedtaksperiodetilstand.MOTTATT_SYKMELDING_UFERDIG_GAP:
            case SpleisVedtaksperiodetilstand.AVVENTER_SØKNAD_FERDIG_GAP:
            case SpleisVedtaksperiodetilstand.AVVENTER_SØKNAD_UFERDIG_GAP:
            case SpleisVedtaksperiodetilstand.AVVENTER_VILKÅRSPRØVING_GAP:
            case SpleisVedtaksperiodetilstand.AVVENTER_GAP:
            case SpleisVedtaksperiodetilstand.AVVENTER_INNTEKTSMELDING_FERDIG_GAP:
            case SpleisVedtaksperiodetilstand.AVVENTER_INNTEKTSMELDING_UFERDIG_GAP:
            case SpleisVedtaksperiodetilstand.AVVENTER_UFERDIG_GAP:
            case SpleisVedtaksperiodetilstand.AVVENTER_INNTEKTSMELDING_UFERDIG_FORLENGELSE:
            case SpleisVedtaksperiodetilstand.AVVENTER_SØKNAD_UFERDIG_FORLENGELSE:
            case SpleisVedtaksperiodetilstand.AVVENTER_UFERDIG_FORLENGELSE:
            case SpleisVedtaksperiodetilstand.AVVENTER_HISTORIKK:
            case SpleisVedtaksperiodetilstand.TIL_INFOTRYGD:
                return Vedtaksperiodetilstand.Venter;
            case SpleisVedtaksperiodetilstand.ANNULLERT:
                return Vedtaksperiodetilstand.Avslag;
            default:
                return Vedtaksperiodetilstand.Ukjent;
        }
    };

    const dokumenter = [søknad, sykmelding, inntektsmelding].filter(hendelse => hendelse !== undefined);

    return {
        id: spleisPeriode.id,
        fom,
        tom,
        kanVelges: totaltTilUtbetaling > 0,
        tilstand: mapTilstand(spleisPeriode.tilstand as SpleisVedtaksperiodetilstand, oppsummering.totaltTilUtbetaling),
        utbetalingsreferanse: spleisPeriode.utbetalingsreferanse,
        utbetalingstidslinje: utbetalingstidslinje,
        sykdomstidslinje: sykdomstidslinje,
        godkjentAv: spleisPeriode.godkjentAv,
        godkjenttidspunkt: somKanskjeDato(spleisPeriode.godkjenttidspunkt),
        vilkår: {
            alderISykmeldingsperioden: alderISykmeldingsperioden(),
            dagerIgjen: dagerIgjen(),
            opptjening: opptjening(),
            søknadsfrist: søknadsfrist()
        },
        inntektskilder: inntektskilder,
        sykepengegrunnlag: sykepengegrunnlag,
        oppsummering: oppsummering,
        rawData: unmappedPeriode,
        dokumenter: dokumenter
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
