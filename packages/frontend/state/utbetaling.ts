import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
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
            it.utbetaling.vurdering?.godkjent
    )[0];

    return isBeregnetPeriode(periode) ? periode.utbetaling.vurdering?.tidsstempel ?? '' : '';
};
