import dayjs, { Dayjs } from 'dayjs';
import { sykdomstidslinje } from './sykdomstidslinje';
import { utbetalingstidslinje } from './utbetalingstidslinje';
import { totalbeløpArbeidstaker, utbetalinger } from './utbetalinger';
import { dataForVilkårsvurdering, umappedeVilkår } from './vilkår';
import { hendelser } from './hendelser';
import {
    SpesialistInntektsgrunnlag,
    SpesialistInntektskilde,
    SpesialistOverstyring,
    SpesialistVedtaksperiode,
    SpleisAktivitet,
    SpleisForlengelseFraInfotrygd,
    SpleisPeriodetype,
    SpleisSykdomsdag,
    SpleisUtbetalingsdag,
    SpleisVedtaksperiodetilstand,
} from 'external-types';
import { VedtaksperiodeBuilder } from '../../client/mapping/vedtaksperiode';
import { Vedtaksperiode } from 'internal-types';
import { aktivitetslogg } from './aktivitetslogg';
import { umappetArbeidsgiver } from './arbeidsgiver';
import { umappetSimuleringsdata } from './simulering';
import { umappetInntektsgrunnlag } from './inntektsgrunnlag';

type UmappetVedtaksperiodeOptions = {
    fom?: Dayjs;
    tom?: Dayjs;
    aktivitetslogg?: SpleisAktivitet[];
    varsler?: string[];
    id?: string;
    beregningIder?: string[];
};

export const umappetVedtaksperiode = (options?: UmappetVedtaksperiodeOptions): SpesialistVedtaksperiode => {
    const fom = options?.fom ?? dayjs('2020-01-01');
    const tom = options?.tom ?? dayjs('2020-01-31');
    const aktivitetsloggen = options?.aktivitetslogg ?? aktivitetslogg();
    const varslene = options?.varsler ?? [];
    const id = options?.id ?? 'fa02d7a5-daf2-488c-9798-2539edd7fe3f';
    const beregningIder = options?.beregningIder ?? ['id1'];

    const sykdomsdager = sykdomstidslinje(fom, tom);
    const utbetalingsdager = utbetalingstidslinje(sykdomsdager, 1500);
    const utbetalingene = utbetalinger(utbetalingsdager, true);
    return {
        id: id,
        fom: fom.format('YYYY-MM-DD'),
        tom: tom.format('YYYY-MM-DD'),
        gruppeId: 'en-gruppeId',
        tilstand: SpleisVedtaksperiodetilstand.Oppgaver,
        oppgavereferanse: 'en-oppgavereferanse',
        fullstendig: true,
        utbetalingsreferanse: 'en-utbetalingsreferanse',
        utbetalingstidslinje: utbetalingsdager,
        sykdomstidslinje: sykdomsdager,
        utbetalinger: utbetalingene,
        automatiskBehandlet: false,
        vilkår: umappedeVilkår(sykdomsdager),
        inntektFraInntektsmelding: 31000.0,
        totalbeløpArbeidstaker: totalbeløpArbeidstaker(utbetalingsdager),
        hendelser: hendelser(sykdomsdager),
        dataForVilkårsvurdering: dataForVilkårsvurdering(),
        utbetalingslinjer: utbetalingene.arbeidsgiverUtbetaling?.linjer ?? [],
        aktivitetslogg: aktivitetsloggen,
        forlengelseFraInfotrygd: SpleisForlengelseFraInfotrygd.NEI,
        periodetype: SpleisPeriodetype.FØRSTEGANGSBEHANDLING,
        risikovurdering: { funn: [], kontrollertOk: [] },
        varsler: varslene,
        simuleringsdata: umappetSimuleringsdata,
        inntektskilde: SpesialistInntektskilde.EnArbeidsgiver,
        beregningIder: beregningIder,
    };
};

export const medUtbetalingstidslinje = (
    vedtaksperiode: SpesialistVedtaksperiode,
    tidslinje: SpleisUtbetalingsdag[]
) => ({
    ...vedtaksperiode,
    utbetalingstidslinje: tidslinje,
    totalbeløpArbeidstaker: totalbeløpArbeidstaker(tidslinje),
});

export const medLedendeSykdomsdager = (vedtaksperiode: SpesialistVedtaksperiode, sykdomsdager: SpleisSykdomsdag[]) => ({
    ...vedtaksperiode,
    fom: sykdomsdager[0].dagen,
    sykdomstidslinje: [...sykdomsdager, ...vedtaksperiode.sykdomstidslinje],
});

export const medEkstraSykdomsdager = (vedtaksperiode: SpesialistVedtaksperiode, sykdomsdager: SpleisSykdomsdag[]) => ({
    ...vedtaksperiode,
    sykdomstidslinje: [...vedtaksperiode.sykdomstidslinje, ...sykdomsdager],
});

export const mappetVedtaksperiode = (
    fom: Dayjs = dayjs('2020-01-01'),
    tom: Dayjs = dayjs('2020-01-31'),
    overstyringer: SpesialistOverstyring[] = [],
    inntektsgrunnlag: SpesialistInntektsgrunnlag[] = [umappetInntektsgrunnlag()]
): Vedtaksperiode => {
    let { vedtaksperiode } = new VedtaksperiodeBuilder()
        .setVedtaksperiode(umappetVedtaksperiode({ fom, tom }))
        .setArbeidsgiver(umappetArbeidsgiver())
        .setOverstyringer(overstyringer)
        .setInntektsgrunnlag(inntektsgrunnlag)
        .build();

    return vedtaksperiode as Vedtaksperiode;
};
