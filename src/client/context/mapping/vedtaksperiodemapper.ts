import {
    Dag,
    DagerIgjen,
    Dagtype,
    DataForVilkårsvurdering,
    Hendelse,
    Inntektskilde,
    Inntektsmelding,
    Opptjening,
    SendtSøknad,
    SpleisVedtaksperiode,
    Søknadsfrist,
    Vedtaksperiode
} from '../types';
import { Personinfo, VedtaksperiodeTilstand } from '../../../types';
import dayjs, { Dayjs } from 'dayjs';

export const mapVedtaksperiode = (
    unmappedPeriode: SpleisVedtaksperiode,
    personinfo: Personinfo,
    hendelser: Hendelse[],
    dataForVilkårsvurdering?: DataForVilkårsvurdering,
    organisasjonsnummer?: string
): Vedtaksperiode => {
    const somDato = (dato: string): Dayjs => dayjs(dato, 'YYYY-MM-DD');
    const somProsent = (avviksprosent?: number): number | undefined =>
        avviksprosent !== undefined ? avviksprosent * 100 : undefined;
    const somInntekt = (inntekt?: number, måneder: number = 1): number | undefined =>
        inntekt ? +(inntekt * måneder).toFixed(2) : undefined;
    const somÅrsinntekt = (inntekt?: number): number | undefined => somInntekt(inntekt, 12);

    const inntektsmelding = hendelser.find(hendelse => hendelse.type === 'INNTEKTSMELDING') as Inntektsmelding;
    const periode = filtrerPaddedeArbeidsdager(unmappedPeriode);

    const totaltTilUtbetaling = periode.utbetalingstidslinje
        .map(dag => dag.utbetaling)
        .filter(utbetaling => utbetaling !== undefined)
        .reduce((acc, dagsats) => acc + dagsats, 0);

    const fom = [...periode.sykdomstidslinje].shift()!.dagen;
    const tom = [...periode.sykdomstidslinje].pop()!.dagen;
    const kanVelges =
        [
            VedtaksperiodeTilstand.AVVENTER_GODKJENNING,
            VedtaksperiodeTilstand.TIL_UTBETALING,
            VedtaksperiodeTilstand.TIL_INFOTRYGD,
            VedtaksperiodeTilstand.ANNULLERT,
            VedtaksperiodeTilstand.UTBETALING_FEILET
        ].includes(periode.tilstand as VedtaksperiodeTilstand) ||
        (periode.tilstand === VedtaksperiodeTilstand.AVSLUTTET && totaltTilUtbetaling > 0);

    const dagsats = periode.utbetalingslinjer?.[0]?.dagsats;

    const alderISykmeldingsperioden = (): number | undefined => {
        const sisteSykedag = [...periode.sykdomstidslinje].pop()?.dagen;
        if (sisteSykedag === undefined || personinfo.fødselsdato === undefined) return undefined;

        return somDato(sisteSykedag).diff(somDato(personinfo.fødselsdato), 'year', false);
    };

    const dagerIgjen = (): DagerIgjen => {
        const førsteSykepengedag =
            periode.utbetalingslinjer && periode.utbetalingslinjer.length > 0
                ? dayjs.min(periode.utbetalingslinjer.map(linje => somDato(linje.fom))).format('YYYY-MM-DD')
                : undefined;
        return {
            dagerBrukt: periode.forbrukteSykedager,
            førsteFraværsdag: inntektsmelding?.førsteFraværsdag,
            førsteSykepengedag: førsteSykepengedag,
            maksdato: periode.maksdato,
            tidligerePerioder: []
        };
    };

    const opptjening = (): Opptjening | undefined => {
        if (!dataForVilkårsvurdering?.harOpptjening) return undefined;

        const antallOpptjeningsdagerErMinst: number = dataForVilkårsvurdering.antallOpptjeningsdagerErMinst;
        return {
            antallOpptjeningsdagerErMinst: antallOpptjeningsdagerErMinst,
            harOpptjening: dataForVilkårsvurdering.harOpptjening,
            opptjeningFra: somDato(periode.førsteFraværsdag)
                .subtract(antallOpptjeningsdagerErMinst, 'day')
                .format('DD.MM.YYYY')
        };
    };

    const søknadsfrist = (): Søknadsfrist | undefined => {
        const sendtSøknad = hendelser.find(
            hendelse =>
                hendelse.type === 'SENDT_SØKNAD' &&
                dayjs(hendelse.fom).isSameOrBefore(dayjs(fom)) &&
                dayjs(hendelse.tom).isSameOrAfter(dayjs(tom))
        ) as SendtSøknad;
        if (sendtSøknad === undefined) return undefined;
        return {
            sendtNav: sendtSøknad.sendtNav,
            søknadTom: sendtSøknad.tom,
            innen3Mnd:
                sendtSøknad.sendtNav && sendtSøknad.tom
                    ? somDato(sendtSøknad.tom)
                          .add(3, 'month')
                          .isSameOrAfter(somDato(sendtSøknad.sendtNav))
                    : false
        };
    };

    const inntektskilder: Inntektskilde[] = [
        {
            organisasjonsnummer,
            månedsinntekt: somInntekt(inntektsmelding?.beregnetInntekt),
            årsinntekt: somÅrsinntekt(inntektsmelding?.beregnetInntekt),
            refusjon: 'Ja',
            forskuttering: 'Ja'
        }
    ];

    const sykepengegrunnlag = {
        årsinntektFraAording: dataForVilkårsvurdering?.beregnetÅrsinntektFraInntektskomponenten,
        årsinntektFraInntektsmelding: somÅrsinntekt(inntektsmelding?.beregnetInntekt),
        avviksprosent: somProsent(dataForVilkårsvurdering?.avviksprosent),
        dagsats
    };

    const oppsummering = {
        antallUtbetalingsdager: periode.utbetalingstidslinje.filter(dag => dag.utbetaling > 0).length,
        totaltTilUtbetaling
    };

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
        vilkår: {
            alderISykmeldingsperioden: alderISykmeldingsperioden(),
            dagerIgjen: dagerIgjen(),
            opptjening: opptjening(),
            søknadsfrist: søknadsfrist()
        },
        inntektskilder: inntektskilder,
        sykepengegrunnlag: sykepengegrunnlag,
        oppsummering: oppsummering,
        rawData: unmappedPeriode
    };
};

const filtrerPaddedeArbeidsdager = (vedtaksperiode: SpleisVedtaksperiode): SpleisVedtaksperiode => {
    const arbeidsdagEllerImplisittDag = (dag: Dag) =>
        dag.type === Dagtype.ARBEIDSDAG_INNTEKTSMELDING ||
        dag.type === Dagtype.ARBEIDSDAG_SØKNAD ||
        dag.type === Dagtype.IMPLISITT_DAG;
    const førsteArbeidsdag = vedtaksperiode.sykdomstidslinje.findIndex(arbeidsdagEllerImplisittDag);
    if (førsteArbeidsdag !== 0) return vedtaksperiode;

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
