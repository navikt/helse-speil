import { useCurrentArbeidsgiver, usePeriodIsInGeneration } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useForrigeGenerasjonPeriode = () => {
    const currentArbeidsgiver = useCurrentArbeidsgiver();
    const currentGeneration = usePeriodIsInGeneration();
    const aktivPeriod = useActivePeriod();

    if (!currentArbeidsgiver || !currentGeneration || !isBeregnetPeriode(aktivPeriod)) {
        return null;
    }

    return currentArbeidsgiver.generasjoner[currentGeneration + 1]?.perioder.find(
        (periode) => periode.vedtaksperiodeId === aktivPeriod.vedtaksperiodeId
    );
};
