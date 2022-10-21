import { useVedtaksperiodeHarIkkeBlittUtbetaltFør } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useHarVurderLovvalgOgMedlemskapVarsel = (): boolean => {
    const periode = useActivePeriod();
    const vedtaksperiodeHarIkkeBlittUtbetaltFør = useVedtaksperiodeHarIkkeBlittUtbetaltFør();

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return (
        vedtaksperiodeHarIkkeBlittUtbetaltFør &&
        periode.varsler.some((varsel) => varsel === 'Vurder lovvalg og medlemskap')
    );
};
