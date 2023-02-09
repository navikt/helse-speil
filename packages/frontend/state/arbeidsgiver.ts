import dayjs from 'dayjs';

import {
    Arbeidsforholdoverstyring,
    Arbeidsgiver,
    BeregnetPeriode,
    Dagoverstyring,
    GhostPeriode,
    Inntektoverstyring,
    UberegnetPeriode,
    Utbetaling,
    Vurdering,
} from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { harBlittUtbetaltTidligere } from '@state/selectors/period';
import {
    isArbeidsforholdoverstyring,
    isBeregnetPeriode,
    isDagoverstyring,
    isGhostPeriode,
    isInntektoverstyring,
    isUberegnetPeriode,
} from '@utils/typeguards';

import { useDagoverstyringer } from '../routes/saksbilde/utbetaling/Utbetaling';

export const findArbeidsgiverWithGhostPeriode = (
    period: GhostPeriode,
    arbeidsgivere: Array<Arbeidsgiver>
): Maybe<Arbeidsgiver> => {
    return (
        arbeidsgivere.find((arbeidsgiver) => arbeidsgiver.ghostPerioder.find((periode) => periode.id === period.id)) ??
        null
    );
};

export const findArbeidsgiverWithPeriode = (
    period: FetchedBeregnetPeriode | UberegnetPeriode,
    arbeidsgivere: Array<Arbeidsgiver>
): Arbeidsgiver | null => {
    return (
        arbeidsgivere.find((arbeidsgiver) =>
            arbeidsgiver.generasjoner
                .flatMap((generasjon) => generasjon.perioder)
                .filter((periode): periode is UberegnetPeriode | BeregnetPeriode => (periode as any).id)
                .find((periode: UberegnetPeriode | BeregnetPeriode) => periode.id === period.id)
        ) ?? null
    );
};

export const useCurrentArbeidsgiver = (): Arbeidsgiver | null => {
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

export const useArbeidsgiver = (organisasjonsnummer: string): Arbeidsgiver | null =>
    useCurrentPerson()?.arbeidsgivere.find((it) => it.organisasjonsnummer === organisasjonsnummer) ?? null;

export const usePeriodForSkjæringstidspunkt = (skjæringstidspunkt: DateString): ActivePeriod | null => {
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!currentArbeidsgiver?.generasjoner[0]?.perioder) {
        return null;
    }

    return (currentArbeidsgiver.generasjoner[0].perioder
        .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
        .sort((a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime())
        .shift() ?? null) as ActivePeriod | null;
};

const usePeriodIsInGeneration = (): number | null => {
    const period = useActivePeriod();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!period || !arbeidsgiver) {
        return null;
    }

    return arbeidsgiver.generasjoner.findIndex((it) =>
        it.perioder.some((periode) => isBeregnetPeriode(periode) && periode.id === period.id)
    );
};

export const usePeriodForSkjæringstidspunktForArbeidsgiver = (
    skjæringstidspunkt: DateString | null,
    organisasjonsnummer: string
): ActivePeriod | null => {
    const arbeidsgiver = useArbeidsgiver(organisasjonsnummer);
    const aktivPeriodeErIgenerasjon = usePeriodIsInGeneration();
    const aktivPeriodeGhostGenerasjon = -1;
    const generasjon = aktivPeriodeErIgenerasjon === aktivPeriodeGhostGenerasjon ? 0 : aktivPeriodeErIgenerasjon;

    if (!skjæringstidspunkt || generasjon === null) return null;

    const arbeidsgiverGhostPerioder = arbeidsgiver?.ghostPerioder.filter(
        (it) => it.skjaeringstidspunkt === skjæringstidspunkt
    );

    if (!arbeidsgiver?.generasjoner[generasjon]?.perioder && arbeidsgiverGhostPerioder?.length === 0) {
        return null;
    }

    return isGhostPeriode(arbeidsgiverGhostPerioder?.[0])
        ? arbeidsgiverGhostPerioder?.[0] ?? null
        : ((arbeidsgiver?.generasjoner[generasjon].perioder
              .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
              .filter((it) => isBeregnetPeriode(it))
              .sort((a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime())
              .pop() ?? null) as ActivePeriod | null);
};

export const useUtbetalingForSkjæringstidspunkt = (skjæringstidspunkt: DateString): Utbetaling | null => {
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

export const useVurderingForSkjæringstidspunkt = (skjæringstidspunkt: DateString): Vurdering | null => {
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

    if (!endringer || !periode) {
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
        .filter((it) => dayjs(it.timestamp).isSameOrBefore(periode.opprettet))
        .filter(isInntektoverstyring);

    const arbeidsforhold = endringer
        .filter((it) => dayjs((periode as BeregnetPeriode).skjaeringstidspunkt).isSameOrBefore(it.timestamp))
        .filter(isArbeidsforholdoverstyring);

    const dager = endringer
        .filter((it) => dayjs(it.timestamp).isSameOrBefore(periode.opprettet))
        .filter(isDagoverstyring);

    return { inntektsendringer: inntekter, arbeidsforholdendringer: arbeidsforhold, dagendringer: dager };
};

export const useHarDagOverstyringer = (periode: FetchedBeregnetPeriode): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver();
    const dagendringer = useDagoverstyringer(periode.fom, periode.tom, arbeidsgiver);

    if (!arbeidsgiver) {
        return false;
    }

    return !harBlittUtbetaltTidligere(periode, arbeidsgiver) && (dagendringer?.length ?? 0) > 0;
};
