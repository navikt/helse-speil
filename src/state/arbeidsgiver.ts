import dayjs from 'dayjs';
import { useMemo } from 'react';

import {
    Arbeidsgiver,
    BeregnetPeriodeFragment,
    Dagoverstyring,
    Maybe,
    PersonFragment,
    SelvstendigNaering,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { finnArbeidsgiver } from '@state/arbeidsgiverHelpers';
import { useInntektOgRefusjon } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import {
    finnInntektsforholdForPeriode,
    finnNteEllerNyesteGenerasjon,
    finnPeriodeTilGodkjenning,
} from '@state/selectors/arbeidsgiver';
import { harBlittUtbetaltTidligere } from '@state/selectors/period';
import { Refusjonsopplysning } from '@typer/overstyring';
import { ActivePeriod, DateString } from '@typer/shared';
import { isBeregnetPeriode, isDagoverstyring, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

export type Inntektsforhold = Arbeidsgiver | SelvstendigNaering;

export const useAktivtInntektsforhold = (person: Maybe<PersonFragment>): Inntektsforhold | undefined => {
    const aktivPeriode = useActivePeriod(person);
    return finnInntektsforholdForPeriode(person, aktivPeriode);
};

export const usePeriodForSkjæringstidspunktForArbeidsgiver = (
    person: PersonFragment,
    skjæringstidspunkt: Maybe<DateString>,
    organisasjonsnummer: string,
): Maybe<ActivePeriod> => {
    const aktivPeriode = useActivePeriod(person);
    const arbeidsgiver = finnArbeidsgiver(person, organisasjonsnummer);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    if (!skjæringstidspunkt || aktivPeriode == null || arbeidsgiver == null) return null;

    const forrigeEllerNyesteGenerasjon = finnNteEllerNyesteGenerasjon(aktivPeriode, arbeidsgiver);

    const arbeidsgiverEierForrigeEllerNyesteGenerasjon = arbeidsgiver?.generasjoner.some(
        (g) => g.id === forrigeEllerNyesteGenerasjon?.id,
    );

    const arbeidsgiverGhostPerioder =
        arbeidsgiver?.ghostPerioder.filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt) ?? [];

    const arbeidsgiverPerioder = arbeidsgiverEierForrigeEllerNyesteGenerasjon
        ? (forrigeEllerNyesteGenerasjon?.perioder.filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt) ?? [])
        : [];
    if (arbeidsgiverPerioder.length === 0 && arbeidsgiverGhostPerioder.length === 0) {
        return null;
    }
    const arbeidsgiverBeregnedePerioder: Array<BeregnetPeriodeFragment> = arbeidsgiverPerioder.filter((it) =>
        isBeregnetPeriode(it),
    ) as Array<BeregnetPeriodeFragment>;

    if (arbeidsgiverBeregnedePerioder.length === 0 && isGhostPeriode(arbeidsgiverGhostPerioder[0])) {
        return arbeidsgiverGhostPerioder[0] ?? null;
    }

    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
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

export const useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning = (person: PersonFragment): boolean => {
    const aktivPeriode = useActivePeriod(person);
    const inntektsforhold = useAktivtInntektsforhold(person);
    if (!aktivPeriode || !inntektsforhold) return false;

    const generasjon = finnNteEllerNyesteGenerasjon(aktivPeriode, inntektsforhold);

    if (!aktivPeriode || generasjon?.id !== inntektsforhold.generasjoner[0]?.id) return false;

    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    return periodeTilGodkjenning ? dayjs(aktivPeriode.fom).isSameOrBefore(periodeTilGodkjenning?.tom) : true;
};

export const useDagoverstyringer = (
    fom: DateString,
    tom: DateString,
    inntektsforhold?: Maybe<Inntektsforhold>,
): Array<Dagoverstyring> => {
    return useMemo(() => {
        if (!inntektsforhold) return [];

        const start = dayjs(fom);
        const end = dayjs(tom);
        return inntektsforhold.overstyringer.filter(isDagoverstyring).filter((overstyring) =>
            overstyring.dager.some((dag) => {
                const dato = dayjs(dag.dato);
                return dato.isSameOrAfter(start) && dato.isSameOrBefore(end);
            }),
        );
    }, [inntektsforhold, fom, tom]);
};

export const useHarDagOverstyringer = (
    periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
    person: PersonFragment,
): boolean => {
    const inntektsforhold = useAktivtInntektsforhold(person);
    const dagendringer = useDagoverstyringer(periode.fom, periode.tom, inntektsforhold);

    if (!inntektsforhold) {
        return false;
    }

    return !harBlittUtbetaltTidligere(periode, inntektsforhold) && (dagendringer?.length ?? 0) > 0;
};

export const useLokaleRefusjonsopplysninger = (
    organisasjonsnummer: string,
    skjæringstidspunkt: string,
): Refusjonsopplysning[] => {
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

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
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

    if (lokaleInntektoverstyringer.skjæringstidspunkt !== skjæringstidspunkt) return null;

    return (
        lokaleInntektoverstyringer.arbeidsgivere.filter((it) => it.organisasjonsnummer === organisasjonsnummer)?.[0]
            ?.månedligInntekt ?? null
    );
};
