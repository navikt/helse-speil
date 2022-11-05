import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { harBlittUtbetaltTidligere } from '@state/selectors/period';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useHarVurderLovvalgOgMedlemskapVarsel = (): boolean => {
    const periode = useActivePeriod();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!isBeregnetPeriode(periode) || !arbeidsgiver) {
        return false;
    }

    const vedtaksperiodeHarIkkeBlittUtbetaltFør = !harBlittUtbetaltTidligere(periode, arbeidsgiver);

    return (
        vedtaksperiodeHarIkkeBlittUtbetaltFør &&
        periode.varsler.some((varsel) => varsel === 'Vurder lovvalg og medlemskap')
    );
};
