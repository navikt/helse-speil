import dayjs from 'dayjs';

import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useUtbetalingstidsstempelFørsteGenForPeriode = (): string => {
    const activePeriod = useActivePeriod();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!currentArbeidsgiver || !isBeregnetPeriode(activePeriod)) {
        return '';
    }

    const periode = currentArbeidsgiver.generasjoner[currentArbeidsgiver.generasjoner.length - 1].perioder.filter(
        (it) =>
            it.vedtaksperiodeId === activePeriod.vedtaksperiodeId &&
            isBeregnetPeriode(it) &&
            it.utbetaling.vurdering?.godkjent,
    )[0];

    return isBeregnetPeriode(periode) ? periode.utbetaling.vurdering?.tidsstempel ?? '' : '';
};

export const useFørsteUtbetalingstidsstempelFørsteGenISkjæringstidspunkt = (): string => {
    const activePeriod = useActivePeriod();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!isBeregnetPeriode(activePeriod) || !currentArbeidsgiver) {
        return '';
    }

    const firstGeneration = currentArbeidsgiver.generasjoner[currentArbeidsgiver.generasjoner.length - 1];

    const førsteUtbetaltePeriodeForSkjæringstidspunkt = firstGeneration.perioder
        .filter(
            (periode) => isBeregnetPeriode(periode) && periode.skjaeringstidspunkt === activePeriod.skjaeringstidspunkt,
        )
        ?.pop();

    if (
        isBeregnetPeriode(førsteUtbetaltePeriodeForSkjæringstidspunkt) &&
        førsteUtbetaltePeriodeForSkjæringstidspunkt.utbetaling.vurdering?.godkjent
    ) {
        return førsteUtbetaltePeriodeForSkjæringstidspunkt.utbetaling.vurdering.tidsstempel;
    } else {
        return '';
    }
};

export const useNyesteUtbetalingstidsstempelForSkjæringstidspunkt = (): Dayjs => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();

    const MIN_DATE = dayjs('1970-01-01');

    if (!isBeregnetPeriode(activePeriod) || !currentPerson) {
        return MIN_DATE;
    }

    const nyesteUtbetalingstidsstempel =
        currentPerson.arbeidsgivere
            .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner)
            ?.flatMap((generasjon) => generasjon.perioder)
            .filter(
                (periode) =>
                    isBeregnetPeriode(periode) &&
                    periode.skjaeringstidspunkt === activePeriod.skjaeringstidspunkt &&
                    periode.utbetaling.vurdering?.godkjent,
            )
            .map((periode) =>
                isBeregnetPeriode(periode) ? dayjs(periode.utbetaling.vurdering?.tidsstempel) : MIN_DATE,
            ) ?? MIN_DATE;

    return dayjs.max([...nyesteUtbetalingstidsstempel, MIN_DATE]);
};
