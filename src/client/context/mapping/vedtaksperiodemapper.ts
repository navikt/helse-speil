import {
    Dag,
    Dagtype,
    DataForVilkårsvurdering,
    Hendelse,
    Inntektsmelding,
    Optional,
    SendtSøknad,
    SpleisVedtaksperiode,
    Vedtaksperiode
} from '../types';
import { Personinfo, VedtaksperiodeTilstand } from '../../../types';
import dayjs, { Dayjs } from 'dayjs';

enum HendelseType {
    SENDTSØKNAD = 'SENDT_SØKNAD',
    INNTEKTSMELDING = 'INNTEKTSMELDING',
    NYSØKNAD = 'NY_SØKNAD'
}

export const mapVedtaksperiode = (
    unmappedPeriode: SpleisVedtaksperiode,
    personinfo: Personinfo,
    hendelser: Hendelse[],
    dataForVilkårsvurdering?: DataForVilkårsvurdering,
    organisasjonsnummer?: string
): Vedtaksperiode => {
    const findHendelse = (hendelser: Hendelse[], type: HendelseType): Hendelse | undefined =>
        hendelser.find(hendelse => hendelse.type === type.valueOf());

    const søknadIPeriode = (søknad: SendtSøknad, fom: Dayjs, tom: Dayjs) =>
        dayjs(søknad.fom).isSameOrBefore(fom) && dayjs(søknad.tom).isSameOrAfter(tom);

    const findSøknadIPeriode = (hendelser: Hendelse[], fom: Dayjs, tom: Dayjs): SendtSøknad | undefined =>
        hendelser.find(
            hendelse => hendelse.type === HendelseType.SENDTSØKNAD && søknadIPeriode(hendelse as SendtSøknad, fom, tom)
        ) as SendtSøknad;

    const inntektsmelding = findHendelse(hendelser, HendelseType.INNTEKTSMELDING) as Inntektsmelding;

    const periode = filtrerPaddedeArbeidsdager(unmappedPeriode);
    const fom = [...periode.sykdomstidslinje].shift()!.dagen;
    const tom = [...periode.sykdomstidslinje].pop()!.dagen;
    const sendtSøknad = findSøknadIPeriode(hendelser, dayjs(fom), dayjs(tom));

    const førsteFraværsdag = inntektsmelding?.førsteFraværsdag ?? '-';
    const sisteSykdomsdag = [...periode.sykdomstidslinje].pop()?.dagen;
    const månedsinntekt = inntektsmelding && +(inntektsmelding?.beregnetInntekt).toFixed(2);

    const årsinntekt = inntektsmelding && +(inntektsmelding.beregnetInntekt * 12).toFixed(2);

    const utbetalingsdager = periode.utbetalingstidslinje.filter(dag => dag.utbetaling > 0).length;

    const førsteSykepengedag =
        periode.utbetalingslinjer && periode.utbetalingslinjer.length > 0
            ? dayjs.min(periode.utbetalingslinjer.map(linje => dayjs(linje.fom))).format('YYYY-MM-DD')
            : null;

    const årsinntektFraInntektsmelding = inntektsmelding?.beregnetInntekt
        ? +(inntektsmelding.beregnetInntekt * 12).toFixed(2)
        : undefined;

    const dagsats = periode.utbetalingslinjer?.[0]?.dagsats;

    const totaltTilUtbetaling = periode.utbetalingstidslinje
        .map(dag => dag.utbetaling)
        .filter(utbetaling => utbetaling !== undefined)
        .reduce((acc, dagsats) => acc + dagsats, 0);

    const opptjeningFra =
        (dataForVilkårsvurdering?.antallOpptjeningsdagerErMinst &&
            dayjs(periode.førsteFraværsdag, 'YYYY-MM-DD')
                .subtract(dataForVilkårsvurdering?.antallOpptjeningsdagerErMinst, 'day')
                .format('DD.MM.YYYY')) ||
        undefined;
    const innen3Mnd = sendtSøknad?.sendtNav
        ? dayjs(sendtSøknad.tom)
              .add(3, 'month')
              .isSameOrAfter(dayjs(sendtSøknad.sendtNav))
        : false;

    const kanVelges =
        [
            VedtaksperiodeTilstand.AVVENTER_GODKJENNING,
            VedtaksperiodeTilstand.TIL_UTBETALING,
            VedtaksperiodeTilstand.TIL_INFOTRYGD,
            VedtaksperiodeTilstand.ANNULLERT,
            VedtaksperiodeTilstand.UTBETALING_FEILET
        ].includes(periode.tilstand as VedtaksperiodeTilstand) ||
        (periode.tilstand === VedtaksperiodeTilstand.AVSLUTTET && totaltTilUtbetaling > 0);

    return {
        id: periode.id,
        fom,
        tom,
        kanVelges,
        tilstand: periode.tilstand as VedtaksperiodeTilstand,
        utbetalingsreferanse: periode.utbetalingsreferanse,
        utbetalingstidslinje: periode.utbetalingstidslinje,
        sykdomstidslinje: periode.sykdomstidslinje,
        godkjentAv: periode.godkjentAv,
        godkjentTidspunkt: periode.godkjentTidspunkt,
        inngangsvilkår: {
            alderISykmeldingsperioden: beregnAlder(sisteSykdomsdag, personinfo.fødselsdato),
            dagerIgjen: {
                dagerBrukt: periode.forbrukteSykedager,
                førsteFraværsdag,
                førsteSykepengedag,
                maksdato: periode.maksdato,
                tidligerePerioder: []
            },
            opptjening: dataForVilkårsvurdering?.harOpptjening
                ? {
                      antallOpptjeningsdagerErMinst: dataForVilkårsvurdering!.antallOpptjeningsdagerErMinst,
                      harOpptjening: dataForVilkårsvurdering!.harOpptjening,
                      opptjeningFra: opptjeningFra!
                  }
                : undefined,
            søknadsfrist: {
                sendtNav: sendtSøknad?.sendtNav,
                søknadTom: sendtSøknad?.tom,
                innen3Mnd
            }
        },
        inntektskilder: [
            {
                organisasjonsnummer,
                månedsinntekt,
                årsinntekt,
                refusjon: 'Ja',
                forskuttering: 'Ja'
            }
        ],
        sykepengegrunnlag: {
            årsinntektFraAording: dataForVilkårsvurdering?.beregnetÅrsinntektFraInntektskomponenten,
            årsinntektFraInntektsmelding,
            avviksprosent: dataForVilkårsvurdering?.avviksprosent,
            dagsats
        },
        oppsummering: {
            antallUtbetalingsdager: utbetalingsdager,
            totaltTilUtbetaling
        },
        rawData: unmappedPeriode
    };
};

export const filtrerPaddedeArbeidsdager = (vedtaksperiode: SpleisVedtaksperiode): SpleisVedtaksperiode => {
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
