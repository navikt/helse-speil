import dayjs, { Dayjs } from 'dayjs';

import { VedtaksperiodeBuilder } from '../../mapping/vedtaksperiode';
import { ISO_DATOFORMAT } from '../../utils/date';

import { aktivitetslogg } from './aktivitetslogg';
import { umappetArbeidsgiver } from './arbeidsgiver';
import { hendelser } from './hendelser';
import { umappetInntektsgrunnlag } from './inntektsgrunnlag';
import {
    testBeregningId,
    testEnkelPeriodeFom,
    testEnkelPeriodeTom,
    testArbeidsgiverfagsystemId,
    testVedtaksperiodeId,
} from './person';
import { dateStringSykdomstidslinje } from './sykdomstidslinje';
import { totalbeløpArbeidstaker, utbetalinger, utbetalingV2 } from './utbetalinger';
import { utbetalingstidslinje } from './utbetalingstidslinje';
import { dataForVilkårsvurdering, umappedeVilkår } from './vilkår';

type UmappetVedtaksperiodeOptions = {
    fagsystemId?: string;
};

export const umappetVedtaksperiode = (
    vedtaksperiode?: Partial<ExternalVedtaksperiode> & UmappetVedtaksperiodeOptions
): ExternalVedtaksperiode => {
    const fom = vedtaksperiode?.fom ?? testEnkelPeriodeFom;
    const tom = vedtaksperiode?.tom ?? testEnkelPeriodeTom;

    const sykdomsdager = dateStringSykdomstidslinje(fom, tom);
    const utbetalingsdager = utbetalingstidslinje(sykdomsdager, 1500);
    const utbetalingene = utbetalinger(
        utbetalingsdager,
        true,
        false,
        vedtaksperiode?.fagsystemId ?? testArbeidsgiverfagsystemId
    );
    const fullstendig = vedtaksperiode?.fullstendig ?? true;
    const tilstand = vedtaksperiode?.tilstand ?? 'Oppgaver';
    return {
        id: testVedtaksperiodeId,
        fom: fom,
        tom: tom,
        gruppeId: 'en-gruppeId',
        tilstand: tilstand,
        oppgavereferanse: 'en-oppgavereferanse',
        fullstendig: fullstendig,
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
        aktivitetslogg: aktivitetslogg(),
        forlengelseFraInfotrygd: 'NEI',
        periodetype: 'FØRSTEGANGSBEHANDLING',
        risikovurdering: { funn: [], kontrollertOk: [] },
        varsler: [],
        utbetaling: utbetalingV2(),
        inntektskilde: 'EN_ARBEIDSGIVER',
        beregningIder: [testBeregningId],
        ...vedtaksperiode,
    };
};

export const medUtbetalingstidslinje = (
    vedtaksperiode: ExternalVedtaksperiode,
    tidslinje: ExternalUtbetalingsdag[]
) => ({
    ...vedtaksperiode,
    utbetalingstidslinje: tidslinje,
    totalbeløpArbeidstaker: totalbeløpArbeidstaker(tidslinje),
});

export const medLedendeSykdomsdager = (vedtaksperiode: ExternalVedtaksperiode, sykdomsdager: ExternalSykdomsdag[]) => ({
    ...vedtaksperiode,
    fom: sykdomsdager[0].dagen,
    sykdomstidslinje: [...sykdomsdager, ...vedtaksperiode.sykdomstidslinje],
});

export const medEkstraSykdomsdager = (vedtaksperiode: ExternalVedtaksperiode, sykdomsdager: ExternalSykdomsdag[]) => ({
    ...vedtaksperiode,
    sykdomstidslinje: [...vedtaksperiode.sykdomstidslinje, ...sykdomsdager],
});

export const mappetVedtaksperiode = (
    fom: Dayjs = dayjs('2018-01-01'),
    tom: Dayjs = dayjs('2018-01-31'),
    overstyringer: ExternalOverstyring[] = [],
    inntektsgrunnlag: ExternalInntektsgrunnlag[] = [umappetInntektsgrunnlag()]
): Vedtaksperiode => {
    let { vedtaksperiode } = new VedtaksperiodeBuilder()
        .setVedtaksperiode(umappetVedtaksperiode({ fom: fom.format(ISO_DATOFORMAT), tom: tom.format(ISO_DATOFORMAT) }))
        .setArbeidsgiver(umappetArbeidsgiver())
        .setOverstyringer(overstyringer)
        .setAnnullertUtbetalingshistorikk([])
        .setInntektsgrunnlag(inntektsgrunnlag)
        .build();

    return vedtaksperiode as Vedtaksperiode;
};
