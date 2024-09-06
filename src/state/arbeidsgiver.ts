import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import {
    Arbeidsforholdoverstyring,
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Dagoverstyring,
    GhostPeriodeFragment,
    Hendelse,
    Inntektoverstyring,
    Maybe,
    NyttInntektsforholdPeriodeFragment,
    PersonFragment,
    TilleggsinfoForInntektskildeFragment,
    UberegnetPeriodeFragment,
    Utbetaling,
    Vurdering,
} from '@io/graphql';
import { inntektOgRefusjonState } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson, useFetchPersonQuery } from '@state/person';
import { harBlittUtbetaltTidligere } from '@state/selectors/period';
import { isGodkjent } from '@state/selectors/utbetaling';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ActivePeriod, DateString } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';
import {
    isArbeidsforholdoverstyring,
    isBeregnetPeriode,
    isDagoverstyring,
    isGhostPeriode,
    isInntektoverstyring,
    isTilkommenInntekt,
    isUberegnetPeriode,
} from '@utils/typeguards';

export const findArbeidsgiverWithGhostPeriode = (
    period: GhostPeriodeFragment,
    arbeidsgivere: Array<ArbeidsgiverFragment>,
): Maybe<ArbeidsgiverFragment> => {
    return (
        arbeidsgivere.find((arbeidsgiver) => arbeidsgiver.ghostPerioder.find((periode) => periode.id === period.id)) ??
        null
    );
};

export const findArbeidsgiverWithNyttInntektsforholdPeriode = (
    period: NyttInntektsforholdPeriodeFragment,
    arbeidsgivere: Array<ArbeidsgiverFragment>,
): Maybe<ArbeidsgiverFragment> => {
    return (
        arbeidsgivere.find((arbeidsgiver) =>
            arbeidsgiver.nyeInntektsforholdPerioder.find((periode) => periode.id === period.id),
        ) ?? null
    );
};

export const findArbeidsgiverWithPeriode = (
    period: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
    arbeidsgivere: Array<ArbeidsgiverFragment>,
): Maybe<ArbeidsgiverFragment> => {
    return (
        arbeidsgivere.find((arbeidsgiver) =>
            arbeidsgiver.generasjoner
                .flatMap((generasjon) => generasjon.perioder)
                .filter(
                    (periode): periode is UberegnetPeriodeFragment | BeregnetPeriodeFragment =>
                        isUberegnetPeriode(period) || isBeregnetPeriode(periode),
                )
                .find((periode: UberegnetPeriodeFragment | BeregnetPeriodeFragment) => periode.id === period.id),
        ) ?? null
    );
};

export const useCurrentArbeidsgiver = (): Maybe<ArbeidsgiverFragment> => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();

    if (!currentPerson || !activePeriod) {
        return null;
    } else if (isBeregnetPeriode(activePeriod) || isUberegnetPeriode(activePeriod)) {
        return findArbeidsgiverWithPeriode(activePeriod, currentPerson.arbeidsgivere);
    } else if (isGhostPeriode(activePeriod)) {
        return findArbeidsgiverWithGhostPeriode(activePeriod, currentPerson.arbeidsgivere);
    }

    return null;
};

export const useArbeidsgiver = (organisasjonsnummer: string): Maybe<ArbeidsgiverFragment> =>
    useCurrentPerson()?.arbeidsgivere.find((it) => it.organisasjonsnummer === organisasjonsnummer) ?? null;

export const useTilleggsinfo = (): Maybe<TilleggsinfoForInntektskildeFragment[]> =>
    useFetchPersonQuery()?.data?.person?.tilleggsinfoForInntektskilder ?? [];

export const useMaybeArbeidsgiver = (organisasjonsnummer?: Maybe<string>): Maybe<ArbeidsgiverFragment> =>
    useCurrentPerson()?.arbeidsgivere.find((it) => it.organisasjonsnummer === organisasjonsnummer) ?? null;

export const useInntektsmeldinghendelser = (arbeidsgiver: Maybe<ArbeidsgiverFragment>): Hendelse[] => {
    if (!arbeidsgiver) return [];

    // Ja, det er litt rotete kode for å deduplisere hendelser-lista, men
    // tenker det er verdt det siden det ikke er så lett å oppdage at det vil
    // kunne være duplikater i lista.
    // Kan ikke gå via Set fordi like hendelser er distinkte objekter - det
    // knepet funker bare på primitiver.

    const hendelser = new Map<string, Hendelse>();
    arbeidsgiver.generasjoner
        .flatMap((g) => g.perioder.flatMap((p) => p.hendelser))
        .forEach((h) => {
            hendelser.set(h.id, h);
        });
    const hendelserDeduplisert = [...hendelser.values()];

    return hendelserDeduplisert.filter((h) => h.type === 'INNTEKTSMELDING');
};

export const usePeriodForSkjæringstidspunkt = (skjæringstidspunkt: DateString): Maybe<ActivePeriod> => {
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!currentArbeidsgiver?.generasjoner[0]?.perioder) {
        return null;
    }

    return (currentArbeidsgiver.generasjoner[0].perioder
        .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
        .sort((a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime())
        .shift() ?? null) as Maybe<ActivePeriod>;
};

export const usePeriodIsInGeneration = (): Maybe<number> => {
    const period = useActivePeriod();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!period || !arbeidsgiver) {
        return null;
    }

    return arbeidsgiver.generasjoner.findIndex((it) =>
        it.perioder.some((periode) => isBeregnetPeriode(periode) && periode.id === period.id),
    );
};

export const usePeriodeErIGenerasjon = (arbeidsgiver: Maybe<ArbeidsgiverFragment>, periodeId: string): Maybe<number> =>
    arbeidsgiver?.generasjoner.findIndex((it) =>
        it.perioder.some(
            (periode) => (isBeregnetPeriode(periode) || isUberegnetPeriode(periode)) && periode.id === periodeId,
        ),
    ) ?? null;

export const usePeriodeTilGodkjenning = (): Maybe<BeregnetPeriodeFragment> => {
    const person = useCurrentPerson();

    if (!person) return null;

    return (
        (person.arbeidsgivere
            .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder)
            .filter(
                (periode) => isBeregnetPeriode(periode) && periode.periodetilstand === 'TilGodkjenning',
            )?.[0] as BeregnetPeriodeFragment) ?? null
    );
};

export const usePeriodForSkjæringstidspunktForArbeidsgiver = (
    skjæringstidspunkt: Maybe<DateString>,
    organisasjonsnummer: string,
): Maybe<ActivePeriod> => {
    const arbeidsgiver = useArbeidsgiver(organisasjonsnummer);
    const aktivPeriodeErIgenerasjon = usePeriodIsInGeneration();
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();
    const aktivPeriodeGhostGenerasjon = -1;
    const generasjon = aktivPeriodeErIgenerasjon === aktivPeriodeGhostGenerasjon ? 0 : aktivPeriodeErIgenerasjon;

    if (!skjæringstidspunkt || generasjon === null) return null;

    const arbeidsgiverGhostPerioder =
        arbeidsgiver?.ghostPerioder.filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt) ?? [];
    const arbeidsgiverPerioder =
        arbeidsgiver?.generasjoner[generasjon]?.perioder.filter(
            (it) => it.skjaeringstidspunkt === skjæringstidspunkt,
        ) ?? [];

    if (arbeidsgiverPerioder.length === 0 && arbeidsgiverGhostPerioder.length === 0) {
        return null;
    }

    const arbeidsgiverBeregnedePerioder: Array<BeregnetPeriodeFragment> = arbeidsgiverPerioder.filter((it) =>
        isBeregnetPeriode(it),
    ) as Array<BeregnetPeriodeFragment>;

    if (arbeidsgiverBeregnedePerioder.length === 0 && isGhostPeriode(arbeidsgiverGhostPerioder[0])) {
        return arbeidsgiverGhostPerioder[0] ?? null;
    }

    const harSammeSkjæringstidspunkt = skjæringstidspunkt === periodeTilGodkjenning?.skjaeringstidspunkt;

    const aktivArbeidsgiverHarAktivPeriode = arbeidsgiverBeregnedePerioder.some(
        (it) => it.id === periodeTilGodkjenning?.id,
    );

    if (
        periodeTilGodkjenning &&
        aktivArbeidsgiverHarAktivPeriode &&
        erAktivPeriodeLikEllerFørPeriodeTilGodkjenning &&
        harSammeSkjæringstidspunkt
    )
        return periodeTilGodkjenning as ActivePeriod;

    const overstyrbareArbeidsgiverPerioder = arbeidsgiverPerioder
        .filter((it) => isBeregnetPeriode(it) || isUberegnetPeriode(it))
        .sort((a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime());
    const nyesteBeregnetPeriodePåSkjæringstidspunkt = (overstyrbareArbeidsgiverPerioder
        ?.filter((it) => isBeregnetPeriode(it))
        .pop() ?? null) as Maybe<ActivePeriod>;
    const nyestePeriodePåSkjæringstidspunkt = (overstyrbareArbeidsgiverPerioder?.pop() ?? null) as Maybe<ActivePeriod>;

    return nyesteBeregnetPeriodePåSkjæringstidspunkt ?? nyestePeriodePåSkjæringstidspunkt;
};

export const useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning = (): boolean => {
    const aktivPeriode = useActivePeriod();
    const aktivPeriodeErIgenerasjon = usePeriodIsInGeneration();
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();
    const aktivPeriodeGhostGenerasjon = -1;
    const generasjon = aktivPeriodeErIgenerasjon === aktivPeriodeGhostGenerasjon ? 0 : aktivPeriodeErIgenerasjon;

    if (!aktivPeriode || generasjon !== 0) return false;

    return periodeTilGodkjenning ? dayjs(aktivPeriode.fom).isSameOrBefore(periodeTilGodkjenning?.tom) : true;
};

export const useErGhostLikEllerFørPeriodeTilGodkjenning = (): boolean => {
    const aktivPeriode = useActivePeriod();
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();

    if (!aktivPeriode) return false;

    return periodeTilGodkjenning
        ? dayjs(aktivPeriode.fom).isSameOrBefore(periodeTilGodkjenning?.skjaeringstidspunkt) ||
              dayjs(aktivPeriode.fom).isSameOrBefore(periodeTilGodkjenning?.fom)
        : true;
};

export const useUtbetalingForSkjæringstidspunkt = (skjæringstidspunkt: DateString): Maybe<Utbetaling> => {
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!currentArbeidsgiver?.generasjoner[0]?.perioder) {
        return null;
    }

    return (
        Array.from(currentArbeidsgiver.generasjoner[0]?.perioder)
            .filter(isBeregnetPeriode)
            .reverse()
            .find((beregnetPeriode) => beregnetPeriode.skjaeringstidspunkt === skjæringstidspunkt)?.utbetaling ?? null
    );
};

export const useFinnesNyereUtbetaltPeriodePåPerson = (
    period: BeregnetPeriodeFragment,
    person: PersonFragment,
): boolean => {
    const nyesteUtbetaltPeriodePåPerson = person.arbeidsgivere
        .flatMap((it) => it.generasjoner[0]?.perioder)
        .filter((periode) => isBeregnetPeriode(periode) && isGodkjent(periode.utbetaling))
        .pop();

    return dayjs(nyesteUtbetaltPeriodePåPerson?.fom, ISO_DATOFORMAT).isAfter(dayjs(period.tom, ISO_DATOFORMAT));
};

export const useVurderingForSkjæringstidspunkt = (skjæringstidspunkt: DateString): Maybe<Vurdering> => {
    return useUtbetalingForSkjæringstidspunkt(skjæringstidspunkt)?.vurdering ?? null;
};

type UseEndringerForPeriodeResult = {
    inntektsendringer: Inntektoverstyring[];
    arbeidsforholdendringer: Arbeidsforholdoverstyring[];
    dagendringer: Dagoverstyring[];
};

export const useEndringerForPeriode = (organisasjonsnummer: string): UseEndringerForPeriodeResult => {
    const endringer = useArbeidsgiver(organisasjonsnummer)?.overstyringer;
    const periode = useActivePeriod();

    if (!endringer || !periode || isTilkommenInntekt(periode)) {
        return { inntektsendringer: [], arbeidsforholdendringer: [], dagendringer: [] };
    }

    if (isGhostPeriode(periode)) {
        const arbeidsforhold = endringer
            .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
            .filter(isArbeidsforholdoverstyring);

        const inntekter = endringer
            .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
            .filter(isInntektoverstyring);

        return { inntektsendringer: inntekter, arbeidsforholdendringer: arbeidsforhold, dagendringer: [] };
    }

    const inntekter = endringer
        .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
        .filter(isInntektoverstyring);

    const arbeidsforhold = endringer
        .filter((it) => dayjs((periode as BeregnetPeriodeFragment).skjaeringstidspunkt).isSameOrBefore(it.timestamp))
        .filter(isArbeidsforholdoverstyring);

    const dager = endringer
        .filter((it) => dayjs(periode.skjaeringstidspunkt).isSameOrBefore(it.timestamp))
        .filter(isDagoverstyring);

    return { inntektsendringer: inntekter, arbeidsforholdendringer: arbeidsforhold, dagendringer: dager };
};

export const useDagoverstyringer = (
    fom: DateString,
    tom: DateString,
    arbeidsgiver?: Maybe<ArbeidsgiverFragment>,
): Array<Dagoverstyring> => {
    return useMemo(() => {
        if (!arbeidsgiver) return [];

        const start = dayjs(fom);
        const end = dayjs(tom);
        return arbeidsgiver.overstyringer.filter(isDagoverstyring).filter((overstyring) =>
            overstyring.dager.some((dag) => {
                const dato = dayjs(dag.dato);
                return dato.isSameOrAfter(start) && dato.isSameOrBefore(end);
            }),
        );
    }, [arbeidsgiver, fom, tom]);
};
export const useHarDagOverstyringer = (periode: BeregnetPeriodeFragment): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver();
    const dagendringer = useDagoverstyringer(periode.fom, periode.tom, arbeidsgiver);

    if (!arbeidsgiver) {
        return false;
    }

    return !harBlittUtbetaltTidligere(periode, arbeidsgiver) && (dagendringer?.length ?? 0) > 0;
};

export const useLokaleRefusjonsopplysninger = (
    organisasjonsnummer: string,
    skjæringstidspunkt: string,
): Refusjonsopplysning[] => {
    const lokaleInntektoverstyringer = useRecoilValue(inntektOgRefusjonState);

    if (lokaleInntektoverstyringer.skjæringstidspunkt !== skjæringstidspunkt) return [];

    return (
        lokaleInntektoverstyringer.arbeidsgivere
            .filter((it) => it.organisasjonsnummer === organisasjonsnummer)?.[0]
            ?.refusjonsopplysninger?.map((refusjonsopplysning) => {
                return { ...refusjonsopplysning } as Refusjonsopplysning;
            }) ?? []
    );
};

export const useLokaltMånedsbeløp = (organisasjonsnummer: string, skjæringstidspunkt: string): Maybe<number> => {
    const lokaleInntektoverstyringer = useRecoilValue(inntektOgRefusjonState);

    if (lokaleInntektoverstyringer.skjæringstidspunkt !== skjæringstidspunkt) return null;

    return (
        lokaleInntektoverstyringer.arbeidsgivere.filter((it) => it.organisasjonsnummer === organisasjonsnummer)?.[0]
            ?.månedligInntekt ?? null
    );
};

export const useGjenståendeDager = (periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment): Maybe<number> => {
    const person = useCurrentPerson();
    const arbeidsgiver = findArbeidsgiverWithPeriode(periode, person?.arbeidsgivere ?? []);
    const periodeErIGenerasjon = usePeriodeErIGenerasjon(arbeidsgiver, periode.id);

    if (
        !person ||
        !arbeidsgiver ||
        periodeErIGenerasjon === null ||
        (!isBeregnetPeriode(periode) && !isUberegnetPeriode(periode))
    )
        return null;

    const sisteBeregnedePeriodeISykefraværstilfellet = arbeidsgiver?.generasjoner[
        periodeErIGenerasjon
    ]?.perioder.filter(
        (it) => isBeregnetPeriode(it) && it.skjaeringstidspunkt === periode.skjaeringstidspunkt && it.maksdato,
    )[0] as BeregnetPeriodeFragment;

    if (!sisteBeregnedePeriodeISykefraværstilfellet) return null;

    const antallNavdagerEtterAktivPeriode = navdager(person.arbeidsgivere, periodeErIGenerasjon).filter(
        (dag) =>
            dayjs(dag).isAfter(periode.tom) &&
            dayjs(dag).isSameOrBefore(sisteBeregnedePeriodeISykefraværstilfellet.tom),
    ).length;

    return (sisteBeregnedePeriodeISykefraværstilfellet?.gjenstaendeSykedager ?? 0) + antallNavdagerEtterAktivPeriode;
};

const navdager = (arbeidsgivere: Array<ArbeidsgiverFragment>, periodeErIGenerasjon: Maybe<number>): string[] => {
    if (periodeErIGenerasjon === null || periodeErIGenerasjon === -1) return [];
    const alleNavdager = [
        ...arbeidsgivere.flatMap(
            (it) => it.generasjoner[periodeErIGenerasjon]?.perioder?.flatMap((periode) => periode.tidslinje) ?? [],
        ),
    ].filter((dag) => dag.utbetalingsdagtype === 'NAVDAG');

    const unikeNavdagerPåsykefraværstilfellet = [...new Set(alleNavdager.map((item) => item.dato))];

    return unikeNavdagerPåsykefraværstilfellet;
};
