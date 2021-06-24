import dayjs, { Dayjs } from 'dayjs';
import {
    SpesialistInntektsgrunnlag,
    SpesialistInntektskilde,
    SpesialistOverstyring,
    SpesialistVedtaksperiode,
    SpleisAktivitet,
    SpleisForlengelseFraInfotrygd,
    SpleisPeriodetype,
    EksternSykdomsdag,
    SpleisUtbetalingsdag,
    SpleisVedtaksperiodetilstand,
} from 'external-types';
import { Vedtaksperiode } from 'internal-types';

import { VedtaksperiodeBuilder } from '../../client/mapping/vedtaksperiode';

import { aktivitetslogg } from './aktivitetslogg';
import { umappetArbeidsgiver } from './arbeidsgiver';
import { hendelser } from './hendelser';
import { umappetInntektsgrunnlag } from './inntektsgrunnlag';
import { umappetSimuleringsdata } from './simulering';
import { sykdomstidslinje } from './sykdomstidslinje';
import { totalbeløpArbeidstaker, utbetalinger } from './utbetalinger';
import { utbetalingstidslinje } from './utbetalingstidslinje';
import { dataForVilkårsvurdering, umappedeVilkår } from './vilkår';

type UmappetVedtaksperiodeOptions = {
    fom?: Dayjs;
    tom?: Dayjs;
    aktivitetslogg?: SpleisAktivitet[];
    varsler?: string[];
    id?: string;
    beregningIder?: string[];
    fagsystemId?: string;
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
    const utbetalingene = utbetalinger(utbetalingsdager, true, false, options?.fagsystemId);
    return {
        id: id,
        fom: fom.format('YYYY-MM-DD'),
        tom: tom.format('YYYY-MM-DD'),
        gruppeId: 'en-gruppeId',
        tilstand: SpleisVedtaksperiodetilstand.Oppgaver,
        oppgavereferanse: 'en-oppgavereferanse',
        fullstendig: true,
        erForkastet: false,
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

export const medLedendeSykdomsdager = (
    vedtaksperiode: SpesialistVedtaksperiode,
    sykdomsdager: EksternSykdomsdag[]
) => ({
    ...vedtaksperiode,
    fom: sykdomsdager[0].dagen,
    sykdomstidslinje: [...sykdomsdager, ...vedtaksperiode.sykdomstidslinje],
});

export const medEkstraSykdomsdager = (vedtaksperiode: SpesialistVedtaksperiode, sykdomsdager: EksternSykdomsdag[]) => ({
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
        .setAnnullertUtbetalingshistorikk([])
        .setInntektsgrunnlag(inntektsgrunnlag)
        .build();

    return vedtaksperiode as Vedtaksperiode;
};
