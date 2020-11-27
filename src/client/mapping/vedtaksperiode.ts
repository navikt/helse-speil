import dayjs, { Dayjs } from 'dayjs';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT, NORSK_DATOFORMAT } from '../utils/date';
import {
    Periodetype,
    UfullstendigVedtaksperiode,
    Utbetaling,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
} from 'internal-types';
import {
    SpesialistOverstyring,
    SpesialistVedtaksperiode,
    SpleisForlengelseFraInfotrygd,
    SpleisPeriodetype,
    SpleisSykdomsdag,
    SpleisSykdomsdagtype,
    SpleisUtbetalinger,
    SpleisUtbetalingslinje,
} from 'external-types';
import { mapForlengelseFraInfotrygd } from './infotrygd';
import { mapSykdomstidslinje, mapUtbetalingstidslinje } from './dag';
import { mapSimuleringsdata } from './simulering';
import { mapVilkår } from './vilkår';
import { mapHendelse } from './hendelse';
import { tilOverstyrtDag } from './overstyring';

type UnmappedPeriode = SpesialistVedtaksperiode & {
    organisasjonsnummer: string;
    overstyringer: SpesialistOverstyring[];
};

type PartialMappingResult = {
    unmapped: UnmappedPeriode;
    partial: Partial<Vedtaksperiode>;
    problems: Error[];
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

const appendUnmappedFields = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        id: unmapped.id,
        gruppeId: unmapped.gruppeId,
        ...(unmapped.godkjentAv && { godkjentAv: unmapped.godkjentAv }),
        oppgavereferanse: unmapped.oppgavereferanse,
        utbetalingsreferanse: unmapped.utbetalingsreferanse,
        kanVelges: true,
    },
    problems: problems,
});

const appendVilkår = async ({ unmapped, partial, problems }: PartialMappingResult): Promise<PartialMappingResult> => {
    const { vilkår, problems: vilkårProblems } = await mapVilkår(unmapped);
    return {
        unmapped,
        partial: {
            ...partial,
            vilkår: vilkår,
        },
        problems: [...problems, ...vilkårProblems],
    };
};

const inneholderAnnullerteDager = (vedtaksperiode: SpesialistVedtaksperiode): boolean =>
    !!vedtaksperiode.sykdomstidslinje.find((dag) => dag.type === SpleisSykdomsdagtype.ANNULLERT_DAG);

const appendTilstand = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        tilstand:
            (inneholderAnnullerteDager(unmapped) && Vedtaksperiodetilstand.Annullert) ||
            Vedtaksperiodetilstand[unmapped.tilstand] ||
            Vedtaksperiodetilstand.Ukjent,
        behandlet: !!unmapped.godkjentAv || !!unmapped.automatiskBehandlet,
        ...(unmapped.godkjenttidspunkt && { godkjenttidspunkt: somKanskjeDato(unmapped.godkjenttidspunkt) }),
        forlengelseFraInfotrygd: mapForlengelseFraInfotrygd(unmapped.forlengelseFraInfotrygd),
    },
    problems: problems,
});

const appendHendelser = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        hendelser: unmapped.hendelser.map(mapHendelse),
    },
    problems: problems,
});

const appendFomAndTom = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        fom: somDato(unmapped.fom),
        tom: somDato(unmapped.tom),
    },
    problems: problems,
});

const appendTidslinjer = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        utbetalingstidslinje: mapUtbetalingstidslinje(unmapped.utbetalingstidslinje),
        sykdomstidslinje: mapSykdomstidslinje(unmapped.sykdomstidslinje),
    },
    problems: problems,
});

const appendSimulering = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        simuleringsdata: mapSimuleringsdata(unmapped.simuleringsdata),
    },
    problems: problems,
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

const appendPeriodetype = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        periodetype: mapPeriodetype(unmapped),
    },
    problems: problems,
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

const appendUtbetalinger = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        utbetalinger: unmapped.utbetalinger && {
            arbeidsgiverUtbetaling: mapUtbetaling(unmapped.utbetalinger, 'arbeidsgiverUtbetaling'),
            personUtbetaling: mapUtbetaling(unmapped.utbetalinger, 'personUtbetaling'),
        },
    },
    problems: problems,
});

const appendOppsummering = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        oppsummering: {
            antallUtbetalingsdager: unmapped.utbetalingstidslinje.filter((dag) => !!dag.utbetaling).length,
            totaltTilUtbetaling: unmapped.totalbeløpArbeidstaker,
        },
    },
    problems: problems,
});

const appendInntektskilder = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
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
    problems: problems,
});

const appendAktivitetslogg = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => {
    const aktivitetsloggvarsler = unmapped.aktivitetslogg.map((aktivitet) => aktivitet.melding);
    return {
        unmapped,
        partial: {
            ...partial,
            aktivitetslog:
                unmapped.varsler?.length > 0
                    ? unmapped.varsler.filter((v, i) => unmapped.varsler.indexOf(v) === i)
                    : aktivitetsloggvarsler.filter((v, i) => aktivitetsloggvarsler.indexOf(v) === i),
        },
        problems: problems,
    };
};

const appendRisikovurdering = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        risikovurdering: unmapped.risikovurdering !== null ? unmapped.risikovurdering : undefined,
    },
    problems: problems,
});

const appendSykepengegrunnlag = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => {
    try {
        return {
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
            problems: problems,
        };
    } catch (error) {
        return {
            unmapped,
            partial: {
                ...partial,
                sykepengegrunnlag: {},
            },
            problems: [...problems, error],
        };
    }
};

const appendAutomatiskBehandlet = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        automatiskBehandlet: unmapped.automatiskBehandlet === true,
    },
    problems: problems,
});

const tilhørerVedtaksperiode = (partial: Partial<Vedtaksperiode>, overstyring: SpesialistOverstyring) =>
    overstyring.overstyrteDager
        .map((dag) => dayjs(dag.dato))
        .every((dato) => partial.fom?.isSameOrBefore(dato) && partial.tom?.isSameOrAfter(dato));

const appendOverstyringer = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        overstyringer: unmapped.overstyringer
            .filter((overstyring) => tilhørerVedtaksperiode(partial, overstyring))
            .map((overstyring) => ({
                ...overstyring,
                timestamp: dayjs(overstyring.timestamp),
                overstyrteDager: overstyring.overstyrteDager.map(tilOverstyrtDag),
            }))
            .sort((a, b) => (a.timestamp.isBefore(b.timestamp) ? 1 : -1)),
    },
    problems: problems,
});

const finalize = (partialResult: PartialMappingResult): { vedtaksperiode: Vedtaksperiode; problems: Error[] } => ({
    vedtaksperiode: partialResult.partial as Vedtaksperiode,
    problems: partialResult.problems,
});

type MapUfullstendigVedtaksperiodeResult = {
    vedtaksperiode: UfullstendigVedtaksperiode;
    problems: Error[];
};

export const mapUferdigVedtaksperiode = async (
    unmapped: SpesialistVedtaksperiode
): Promise<MapUfullstendigVedtaksperiodeResult> => ({
    vedtaksperiode: {
        id: unmapped.id,
        fom: dayjs(unmapped.fom),
        tom: dayjs(unmapped.tom),
        kanVelges: false,
        tilstand: Vedtaksperiodetilstand[unmapped.tilstand] || Vedtaksperiodetilstand.Ukjent,
    },
    problems: [],
});

type MapVedtaksperiodeResult = {
    vedtaksperiode: Vedtaksperiode;
    problems: Error[];
};

export const mapVedtaksperiode = async (unmapped: UnmappedPeriode): Promise<MapVedtaksperiodeResult> => {
    const spesialistperiode = withoutLeadingArbeidsdager(unmapped);
    return appendUnmappedFields({ unmapped: spesialistperiode, partial: {}, problems: [] })
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
        .then(appendRisikovurdering)
        .then(appendAktivitetslogg)
        .then(appendSykepengegrunnlag)
        .then(appendAutomatiskBehandlet)
        .then(finalize);
};
