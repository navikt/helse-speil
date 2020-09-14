import dayjs, { Dayjs } from 'dayjs';
import { sykdomstidslinje } from './sykdomstidslinje';
import { utbetalingstidslinje } from './utbetalingstidslinje';
import { totalbeløpArbeidstaker, utbetalinger } from './utbetalinger';
import { dataForVilkårsvurdering, vilkår } from './vilkår';
import { hendelser } from './hendelser';
import {
    SpesialistOverstyring,
    SpesialistRisikovurdering,
    SpesialistVedtaksperiode,
    SpleisForlengelseFraInfotrygd,
    SpleisPeriodetype,
    SpleisSykdomsdagtype,
    SpleisVedtaksperiodetilstand,
} from 'external-types';
import { mapVedtaksperiode } from '../../client/mapping/vedtaksperiode';
import { Vedtaksperiode } from 'internal-types';
import { aktivitetslogg } from './aktivitetslogg';

type UmappetVedtaksperiodeOptions = { fom: Dayjs; tom: Dayjs };

export const umappetVedtaksperiode = (options?: UmappetVedtaksperiodeOptions): SpesialistVedtaksperiode => {
    const fom = options?.fom ?? dayjs('2020-01-01');
    const tom = options?.tom ?? dayjs('2020-01-31');
    const sykdomsdager = sykdomstidslinje(fom, tom);
    const utbetalingsdager = utbetalingstidslinje(sykdomsdager, 1500);
    const førsteFraværsdag = sykdomsdager.find(({ type }) => type === SpleisSykdomsdagtype.SYKEDAG)!;
    const utbetalingene = utbetalinger(utbetalingsdager, true);
    return {
        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
        fom: fom.format('YYYY-MM-DD'),
        tom: tom.format('YYYY-MM-DD'),
        gruppeId: 'en-gruppeID',
        tilstand: SpleisVedtaksperiodetilstand.Oppgaver,
        oppgavereferanse: 'en-oppgavereferanse',
        fullstendig: true,
        utbetalingsreferanse: 'en-utbetalingsreferanse',
        utbetalingstidslinje: utbetalingsdager,
        sykdomstidslinje: sykdomsdager,
        utbetalinger: utbetalingene,
        godkjentAv: undefined,
        godkjenttidspunkt: undefined,
        vilkår: vilkår(sykdomsdager),
        førsteFraværsdag: førsteFraværsdag.dagen,
        inntektFraInntektsmelding: 31000.0,
        totalbeløpArbeidstaker: totalbeløpArbeidstaker(utbetalingsdager),
        hendelser: hendelser(sykdomsdager),
        dataForVilkårsvurdering: dataForVilkårsvurdering(),
        utbetalingslinjer: utbetalingene.arbeidsgiverUtbetaling?.linjer ?? [],
        aktivitetslogg: aktivitetslogg(),
        forlengelseFraInfotrygd: SpleisForlengelseFraInfotrygd.NEI,
        periodetype: SpleisPeriodetype.FØRSTEGANGSBEHANDLING,
    };
};

export const mappetVedtaksperiode = (
    fom: Dayjs = dayjs('2020-01-01'),
    tom: Dayjs = dayjs('2020-01-31'),
    organisasjonsnummer: string = 'et-organisasjonsnummer',
    risikovurderingerForArbeidsgiver: SpesialistRisikovurdering[] = [],
    overstyringer: SpesialistOverstyring[] = []
): Promise<Vedtaksperiode> =>
    mapVedtaksperiode({
        ...umappetVedtaksperiode({ fom, tom }),
        organisasjonsnummer,
        risikovurderingerForArbeidsgiver,
        overstyringer,
    });
