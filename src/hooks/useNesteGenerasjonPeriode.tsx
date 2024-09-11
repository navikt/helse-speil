import { useCurrentArbeidsgiver, usePeriodIsInGeneration } from '@state/arbeidsgiver';
import { useActivePeriodOld } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useNesteGenerasjonPeriode = () => {
    const currentArbeidsgiver = useCurrentArbeidsgiver();
    const currentGeneration = usePeriodIsInGeneration();
    const aktivPeriod = useActivePeriodOld();

    if (
        !currentArbeidsgiver ||
        currentGeneration === null ||
        currentGeneration === 0 ||
        currentGeneration === -1 ||
        !isBeregnetPeriode(aktivPeriod)
    ) {
        return null;
    }

    return currentArbeidsgiver.generasjoner[currentGeneration - 1]?.perioder.find(
        (periode) => periode.vedtaksperiodeId === aktivPeriod.vedtaksperiodeId,
    );
};
