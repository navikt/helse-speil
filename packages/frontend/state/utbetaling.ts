import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { isBeregnetPeriode } from '@utils/typeguards';
import { useActivePeriod } from '@state/periode';

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
