import dayjs, { Dayjs } from 'dayjs';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT } from '../../utils/date';
import {
    Periodetype,
    UferdigVedtaksperiode,
    Utbetaling,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from '../types.internal';
import {
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

type UnmappedPeriode = SpesialistVedtaksperiode & {
    organisasjonsnummer: string;
    risikovurderingerForArbeidsgiver: SpesialistRisikovurdering[];
};

type PartialMappingResult = {
    unmapped: UnmappedPeriode;
    partial: Partial<Vedtaksperiode>;
};

export const somDato = (dato: string): Dayjs => dayjs(dato ?? null, ISO_DATOFORMAT);

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

const appendUnmappedFields = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
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

const appendVilkår = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
        unmapped,
        partial: {
            ...partial,
            vilkår: mapVilkår(unmapped),
        },
    });

const appendTilstand = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
        unmapped,
        partial: {
            ...partial,
            tilstand: Vedtaksperiodetilstand[unmapped.tilstand] || Vedtaksperiodetilstand.Ukjent,
            behandlet: !!unmapped.godkjentAv,
            godkjenttidspunkt: somKanskjeDato(unmapped.godkjenttidspunkt),
            forlengelseFraInfotrygd: mapForlengelseFraInfotrygd(unmapped.forlengelseFraInfotrygd),
        },
    });

const appendHendelser = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
        unmapped,
        partial: {
            ...partial,
            hendelser: unmapped.hendelser.map(mapHendelse),
        },
    });

const appendFomAndTom = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
        unmapped,
        partial: {
            ...partial,
            fom: somDato(unmapped.fom),
            tom: somDato(unmapped.tom),
        },
    });

const appendTidslinjer = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
        unmapped,
        partial: {
            ...partial,
            utbetalingstidslinje: mapUtbetalingstidslinje(unmapped.utbetalingstidslinje),
            sykdomstidslinje: mapSykdomstidslinje(unmapped.sykdomstidslinje),
        },
    });

const appendSimulering = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
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

const appendPeriodetype = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
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

const appendUtbetalinger = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
        unmapped,
        partial: {
            ...partial,
            utbetalinger: unmapped.utbetalinger && {
                arbeidsgiverUtbetaling: mapUtbetaling(unmapped.utbetalinger, 'arbeidsgiverUtbetaling'),
                personUtbetaling: mapUtbetaling(unmapped.utbetalinger, 'personUtbetaling'),
            },
        },
    });

const appendOppsummering = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
        unmapped,
        partial: {
            ...partial,
            oppsummering: {
                antallUtbetalingsdager: unmapped.utbetalingstidslinje.filter((dag) => !!dag.utbetaling).length,
                totaltTilUtbetaling: unmapped.totalbeløpArbeidstaker,
            },
        },
    });

const appendInntektskilder = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
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

const appendAktivitetslogg = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
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

const appendRisikovurdering = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
        unmapped,
        partial: {
            ...partial,
            risikovurdering: unmapped.risikovurderingerForArbeidsgiver
                .map((risikovurdering) => ({ ...risikovurdering, opprettet: somTidspunkt(risikovurdering.opprettet) }))
                .find((risikovurdering) => risikovurdering.vedtaksperiodeId === unmapped.id),
        },
    });

const appendSykepengegrunnlag = ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
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
        .then(appendInntektskilder)
        .then(appendAktivitetslogg)
        .then(appendRisikovurdering)
        .then(appendSykepengegrunnlag)
        .then(finalize);
};
