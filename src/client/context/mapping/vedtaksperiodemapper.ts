import {
    Dag,
    Dagtype,
    Inntektsmelding,
    Vedtaksperiode,
    Optional,
    SendtSøknad,
    SpleisVedtaksperiode
} from '../types';
import { Personinfo, VedtaksperiodeTilstand } from '../../../types';
import { arbeidsdagerMellom } from '../../utils/date';
import dayjs from 'dayjs';

export const mapVedtaksperiode = (
    unmappedPeriode: SpleisVedtaksperiode,
    personinfo: Personinfo,
    sendtSøknad?: SendtSøknad,
    inntektsmelding?: Inntektsmelding
): Vedtaksperiode => {
    const periode = filtrerPaddedeArbeidsdager(unmappedPeriode);
    const førsteFraværsdag = inntektsmelding?.førsteFraværsdag ?? '-';
    const sisteSykdomsdag = [...periode.sykdomstidslinje].pop()?.dagen;
    const månedsinntekt = inntektsmelding && +(inntektsmelding?.beregnetInntekt).toFixed(2);
    const årsinntekt = inntektsmelding && +(inntektsmelding.beregnetInntekt * 12).toFixed(2);
    const årsinntektFraAording =
        periode.dataForVilkårsvurdering?.beregnetÅrsinntektFraInntektskomponenten;

    const utbetalingsdager =
        periode.utbetalingslinjer?.reduce(
            (antallDager, linje) => antallDager + arbeidsdagerMellom(linje.fom, linje.tom).length,
            0
        ) ?? 0;

    const førsteSykepengedag =
        periode.utbetalingslinjer && periode.utbetalingslinjer.length > 0
            ? dayjs
                  .min(periode.utbetalingslinjer.map(linje => dayjs(linje.fom)))
                  .format('YYYY-MM-DD')
            : null;

    const opptjeningFra =
        (periode.dataForVilkårsvurdering?.antallOpptjeningsdagerErMinst &&
            dayjs(periode.førsteFraværsdag, 'YYYY-MM-DD')
                .subtract(periode.dataForVilkårsvurdering?.antallOpptjeningsdagerErMinst, 'day')
                .format('DD.MM.YYYY')) ||
        undefined;

    const årsinntektFraInntektsmelding = inntektsmelding?.beregnetInntekt
        ? +(inntektsmelding.beregnetInntekt * 12).toFixed(2)
        : undefined;

    const innen3Mnd = sendtSøknad?.sendtNav
        ? dayjs(sendtSøknad.tom)
              .add(3, 'month')
              .isSameOrAfter(dayjs(sendtSøknad.sendtNav))
        : false;

    const avviksprosent = periode.dataForVilkårsvurdering?.avviksprosent;

    const dagsats = periode.utbetalingslinjer?.[0]?.dagsats;

    const totaltTilUtbetaling =
        dagsats !== undefined && utbetalingsdager !== undefined ? dagsats * utbetalingsdager : 0;

    return {
        id: periode.id,
        fom: [...periode.sykdomstidslinje].shift()!.dagen,
        tom: [...periode.sykdomstidslinje].pop()!.dagen,
        tilstand: periode.tilstand as VedtaksperiodeTilstand,
        utbetalingsreferanse: periode.utbetalingsreferanse,
        utbetalingstidslinje: periode.utbetalingstidslinje,
        sykdomstidslinje: periode.sykdomstidslinje,
        godkjentAv: periode.godkjentAv,
        godkjentTidspunkt: periode.godkjentTidspunkt,
        inngangsvilkår: {
            alderISykmeldingsperioden: beregnAlder(sisteSykdomsdag, personinfo.fødselsdato),
            dagerIgjen: {
                dagerBrukt: utbetalingsdager,
                førsteFraværsdag,
                førsteSykepengedag,
                maksdato: periode.maksdato,
                tidligerePerioder: []
            },
            opptjening: {
                antallOpptjeningsdagerErMinst:
                    periode.dataForVilkårsvurdering?.antallOpptjeningsdagerErMinst,
                harOpptjening: periode.dataForVilkårsvurdering?.harOpptjening,
                opptjeningFra
            },
            søknadsfrist: {
                sendtNav: sendtSøknad?.sendtNav,
                søknadTom: sendtSøknad?.tom,
                innen3Mnd
            }
        },
        inntektskilder: {
            månedsinntekt,
            årsinntekt,
            refusjon: 'Ja',
            forskuttering: 'Ja'
        },
        sykepengegrunnlag: {
            årsinntektFraAording,
            årsinntektFraInntektsmelding,
            avviksprosent,
            dagsats
        },
        oppsummering: {
            antallUtbetalingsdager: utbetalingsdager,
            totaltTilUtbetaling
        },
        rawData: unmappedPeriode
    };
};

export const filtrerPaddedeArbeidsdager = (
    vedtaksperiode: SpleisVedtaksperiode
): SpleisVedtaksperiode => {
    const arbeidsdagEllerImplisittDag = (dag: Dag) =>
        dag.type === Dagtype.ARBEIDSDAG_INNTEKTSMELDING ||
        dag.type === Dagtype.ARBEIDSDAG_SØKNAD ||
        dag.type === Dagtype.IMPLISITT_DAG;
    const førsteArbeidsdag = vedtaksperiode.sykdomstidslinje.findIndex(arbeidsdagEllerImplisittDag);
    if (førsteArbeidsdag === -1 || førsteArbeidsdag !== 0) return vedtaksperiode;

    const førsteIkkeArbeidsdag = vedtaksperiode.sykdomstidslinje.findIndex(
        dag =>
            dag.type !== Dagtype.ARBEIDSDAG_INNTEKTSMELDING &&
            dag.type !== Dagtype.ARBEIDSDAG_SØKNAD &&
            dag.type !== Dagtype.IMPLISITT_DAG
    );

    return {
        ...vedtaksperiode,
        sykdomstidslinje: [...vedtaksperiode.sykdomstidslinje.slice(førsteIkkeArbeidsdag)]
    };
};

export const beregnAlder = (tidspunkt?: string, fødselsdato?: string): Optional<number> => {
    if (fødselsdato === undefined) return;
    const søknadstidspunkt = dayjs(tidspunkt);
    const fødselsdag = dayjs(fødselsdato);
    return søknadstidspunkt.diff(fødselsdag, 'year', false);
};
