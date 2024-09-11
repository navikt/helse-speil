import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriodOld } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useActivePeriodHasLatestSkjæringstidspunkt = (): boolean => {
    const period = useActivePeriodOld();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!period || !arbeidsgiver || !isBeregnetPeriode(period)) {
        return false;
    }

    const lastBeregnetPeriode = arbeidsgiver.generasjoner[0]?.perioder.filter(isBeregnetPeriode)[0];

    return lastBeregnetPeriode !== undefined && lastBeregnetPeriode.skjaeringstidspunkt === period.skjaeringstidspunkt;
};
