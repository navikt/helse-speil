import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { harBlittUtbetaltTidligere } from '@state/selectors/period';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useHarVurderLovvalgOgMedlemskapVarsel = (): boolean => {
    const periode = useActivePeriod();
    const arbeidsgiver = useCurrentArbeidsgiver();

    // TODO: Dette skal endres så snart nytt uavklart "lovvalg og medlemskap"-varsel med annen tekst er klart i spleis
    // Dette er gjort slik for at det gamle varselet ikke skal trigge totrinns og notat-modal.
    const varselTekst = 'ikke-eksisterende varseltekst for å unngå videre eksekvering av koden';
    if (varselTekst === 'ikke-eksisterende varseltekst for å unngå videre eksekvering av koden') {
        return false;
    }

    if (!isBeregnetPeriode(periode) || !arbeidsgiver) {
        return false;
    }

    const vedtaksperiodeHarIkkeBlittUtbetaltFør = !harBlittUtbetaltTidligere(periode, arbeidsgiver);

    return vedtaksperiodeHarIkkeBlittUtbetaltFør && periode.varsler.some((varsel) => varsel === varselTekst);
};
