import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useHarVurderLovvalgOgMedlemskapVarsel = (): boolean => {
    const periode = useActivePeriod();

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return periode.varsler.some((varsel) => varsel === 'Vurder lovvalg og medlemskap');
};
