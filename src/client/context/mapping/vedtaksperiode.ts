import dayjs, { Dayjs } from 'dayjs';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT, NORSK_DATOFORMAT } from '../../utils/date';
import {
    Periodetype,
    UferdigVedtaksperiode,
    Utbetaling,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from '../types.internal';
import {
    SpesialistOverstyring,
    SpesialistRisikovurdering,
    SpesialistVedtaksperiode,
    SpleisForlengelseFraInfotrygd,
    SpleisPeriodetype,
    SpleisSykdomsdag,
    SpleisSykdomsdagtype,
    SpleisUtbetalinger,
    SpleisUtbetalingslinje,
} from './types.external';
import { mapForlengelseFraInfotrygd } from './infotrygd';
import { mapSykdomstidslinje, mapUtbetalingstidslinje } from './dag';
import { mapSimuleringsdata } from './simulering';
import { mapVilkår } from './vilkår';
import { mapHendelse } from './hendelse';
import { tilOverstyrtDag } from './overstyring';

type UnmappedPeriode = SpesialistVedtaksperiode & {
    organisasjonsnummer: string;
    risikovurderingerForArbeidsgiver: SpesialistRisikovurdering[];
    overstyringer: SpesialistOverstyring[];
};

type PartialMappingResult = {
    unmapped: UnmappedPeriode;
    partial: Partial<Vedtaksperiode>;
};

export const somDato = (dato: string): Dayjs => dayjs(dato ?? null, ISO_DATOFORMAT);

export const somNorskDato = (dato: string): Dayjs => dayjs(dato, NORSK_DATOFORMAT);

export const somKanskjeDato = (dato?: string): Dayjs | undefined => (dato ? somDato(dato) : undefined);

export const somTidspunkt = (dato: string): Dayjs => dayjs(dato, ISO_TIDSPUNKTFORMAT);

const somProsent = (avviksprosent: number): number => avviksprosent * 100;

const somInntekt = (inntekt?: number, måneder: number = 1): number | undefined =>
    inntekt ? +(inntekt * måneder).toFixed(2) : undefined;

const somÅrsinntekt = (inntekt?: number): number | undefined => somInntekt(inntekt, 12);

const withoutLeadingArbeidsdager = (unmapped: UnmappedPeriode): UnmappedPeriode => {
    const arbeidsdagEllerImplisittDag = (dag: SpleisSykdomsdag) =>
        dag.type === SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING ||
        dag.type === SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD ||
        dag.type === SpleisSykdomsdagtype.IMPLISITT_DAG ||
        dag.type === SpleisSykdomsdagtype.ARBEIDSDAG;
    const førsteArbeidsdag = unmapped.sykdomstidslinje.findIndex(arbeidsdagEllerImplisittDag);
    if (førsteArbeidsdag !== 0) return unmapped;

    const førsteIkkeArbeidsdag = unmapped.sykdomstidslinje.findIndex(
        (dag) =>
            dag.type !== SpleisSykdomsdagtype.ARBEIDSDAG_INNTEKTSMELDING &&
            dag.type !== SpleisSykdomsdagtype.ARBEIDSDAG_SØKNAD &&
            dag.type !== SpleisSykdomsdagtype.IMPLISITT_DAG &&
            dag.type !== SpleisSykdomsdagtype.ARBEIDSDAG
    );

    return {
        ...unmapped,
        sykdomstidslinje: [...unmapped.sykdomstidslinje.slice(førsteIkkeArbeidsdag)],
    };
};

export const mapUferdigVedtaksperiode = (unmapped: SpesialistVedtaksperiode): UferdigVedtaksperiode => ({
    id: unmapped.id,
    fom: dayjs(unmapped.fom),
    tom: dayjs(unmapped.tom),
    kanVelges: false,
    tilstand: Vedtaksperiodetilstand[unmapped.tilstand] || Vedtaksperiodetilstand.Ukjent,
});

const appendUnmappedFields = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        id: unmapped.id,
        gruppeId: unmapped.gruppeId,
        godkjentAv: unmapped.godkjentAv,
        oppgavereferanse: unmapped.oppgavereferanse,
        utbetalingsreferanse: unmapped.utbetalingsreferanse,
        kanVelges: true,
    },
});

const appendVilkår = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        vilkår: mapVilkår(unmapped),
    },
});

const appendTilstand = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        tilstand: Vedtaksperiodetilstand[unmapped.tilstand] || Vedtaksperiodetilstand.Ukjent,
        behandlet: !!unmapped.godkjentAv,
        godkjenttidspunkt: somKanskjeDato(unmapped.godkjenttidspunkt),
        forlengelseFraInfotrygd: mapForlengelseFraInfotrygd(unmapped.forlengelseFraInfotrygd),
    },
});

const appendHendelser = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        hendelser: unmapped.hendelser.map(mapHendelse),
    },
});

const appendFomAndTom = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        fom: somDato(unmapped.fom),
        tom: somDato(unmapped.tom),
    },
});

const appendTidslinjer = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        utbetalingstidslinje: mapUtbetalingstidslinje(unmapped.utbetalingstidslinje),
        sykdomstidslinje: mapSykdomstidslinje(unmapped.sykdomstidslinje),
    },
});

const appendSimulering = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        simuleringsdata: mapSimuleringsdata(unmapped.simuleringsdata),
    },
});

const mapExistingPeriodetype = (spleisPeriodetype: SpleisPeriodetype): Periodetype => {
    switch (spleisPeriodetype) {
        case SpleisPeriodetype.FØRSTEGANGSBEHANDLING:
            return Periodetype.Førstegangsbehandling;
        case SpleisPeriodetype.OVERGANG_FRA_IT:
        case SpleisPeriodetype.INFOTRYGDFORLENGELSE:
            return Periodetype.Infotrygdforlengelse;
        case SpleisPeriodetype.FORLENGELSE:
        default:
            return Periodetype.Forlengelse;
    }
};

const erFørstegangsbehandling = (spleisPeriode: SpesialistVedtaksperiode): boolean => {
    const førsteUtbetalingsdag = spleisPeriode.utbetalinger?.arbeidsgiverUtbetaling?.linjer[0].fom ?? dayjs(0);
    return spleisPeriode.utbetalingstidslinje.some((dag) => dayjs(dag.dato).isSame(førsteUtbetalingsdag));
};

const mapPeriodetype = (spleisPeriode: SpesialistVedtaksperiode): Periodetype => {
    if (spleisPeriode.periodetype) {
        return mapExistingPeriodetype(spleisPeriode.periodetype);
    } else if (erFørstegangsbehandling(spleisPeriode)) {
        return Periodetype.Førstegangsbehandling;
    } else if (spleisPeriode.forlengelseFraInfotrygd === SpleisForlengelseFraInfotrygd.JA) {
        return Periodetype.Infotrygdforlengelse;
    } else {
        return Periodetype.Forlengelse;
    }
};

const appendPeriodetype = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        periodetype: mapPeriodetype(unmapped),
    },
});

const mapUtbetaling = (utbetalinger: SpleisUtbetalinger, key: keyof SpleisUtbetalinger): Utbetaling | undefined =>
    utbetalinger[key] && {
        fagsystemId: utbetalinger[key]!.fagsystemId,
        linjer: utbetalinger[key]!.linjer.map((value: SpleisUtbetalingslinje) => ({
            fom: somDato(value.fom),
            tom: somDato(value.tom),
            dagsats: value.dagsats,
            grad: value.grad,
        })),
    };

const appendUtbetalinger = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        utbetalinger: unmapped.utbetalinger && {
            arbeidsgiverUtbetaling: mapUtbetaling(unmapped.utbetalinger, 'arbeidsgiverUtbetaling'),
            personUtbetaling: mapUtbetaling(unmapped.utbetalinger, 'personUtbetaling'),
        },
    },
});

const appendOppsummering = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        oppsummering: {
            antallUtbetalingsdager: unmapped.utbetalingstidslinje.filter((dag) => !!dag.utbetaling).length,
            totaltTilUtbetaling: unmapped.totalbeløpArbeidstaker,
        },
    },
});

const appendInntektskilder = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        inntektskilder: [
            {
                organisasjonsnummer: unmapped.organisasjonsnummer,
                månedsinntekt: somInntekt(unmapped.inntektFraInntektsmelding),
                årsinntekt: somÅrsinntekt(unmapped.inntektFraInntektsmelding),
                refusjon: true,
                forskuttering: true,
            },
        ],
    },
});

const appendAktivitetslogg = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        aktivitetslog: unmapped.aktivitetslogg.map((aktivitet) => ({
            melding: aktivitet.melding,
            alvorlighetsgrad: aktivitet.alvorlighetsgrad,
            tidsstempel: somTidspunkt(aktivitet.tidsstempel),
        })),
    },
});

const appendRisikovurdering = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        risikovurdering: unmapped.risikovurderingerForArbeidsgiver
            .map((risikovurdering) => ({ ...risikovurdering, opprettet: somTidspunkt(risikovurdering.opprettet) }))
            .find((risikovurdering) => risikovurdering.vedtaksperiodeId === unmapped.id),
    },
});

const appendSykepengegrunnlag = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        sykepengegrunnlag: {
            årsinntektFraAording: unmapped.dataForVilkårsvurdering?.beregnetÅrsinntektFraInntektskomponenten,
            årsinntektFraInntektsmelding: somÅrsinntekt(unmapped.inntektFraInntektsmelding),
            avviksprosent: somProsent(unmapped.dataForVilkårsvurdering?.avviksprosent),
            sykepengegrunnlag: unmapped.vilkår?.sykepengegrunnlag.sykepengegrunnlag,
        },
    },
});

const tilhørerVedtaksperiode = (partial: Partial<Vedtaksperiode>, overstyring: SpesialistOverstyring) =>
    overstyring.overstyrteDager
        .map((dag) => dayjs(dag.dato))
        .every((dato) => partial.fom?.isSameOrBefore(dato) && partial.tom?.isSameOrAfter(dato));

const appendOverstyringer = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        overstyringer: unmapped.overstyringer
            .filter((overstyring) => tilhørerVedtaksperiode(partial, overstyring))
            .map((overstyring) => ({
                ...overstyring,
                timestamp: dayjs(overstyring.timestamp),
                overstyrteDager: overstyring.overstyrteDager.map(tilOverstyrtDag),
            })),
    },
});

const finalize = (partialResult: PartialMappingResult): Vedtaksperiode => partialResult.partial as Vedtaksperiode;

export const mapVedtaksperiode = async (unmapped: UnmappedPeriode): Promise<Vedtaksperiode> => {
    const spesialistperiode = withoutLeadingArbeidsdager(unmapped);
    return appendUnmappedFields({ unmapped: spesialistperiode, partial: {} })
        .then(appendVilkår)
        .then(appendTilstand)
        .then(appendHendelser)
        .then(appendFomAndTom)
        .then(appendTidslinjer)
        .then(appendSimulering)
        .then(appendPeriodetype)
        .then(appendUtbetalinger)
        .then(appendOppsummering)
        .then(appendOverstyringer)
        .then(appendInntektskilder)
        .then(appendAktivitetslogg)
        .then(appendRisikovurdering)
        .then(appendSykepengegrunnlag)
        .then(finalize);
};
