import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

/* Dette er det egentlig en sjekk på for å markere oppgaver til totrinnsvurdering i spesialist,
 *  men den har ikke tilbakevirkende kraft for oppgaver som allerede er i speil, opprettet før 24.06.22.
 *  Denne, og bruken av denne, kan derfor slettes når alle oppgaver i speil er opprettet fom. 24.06.22
 */

export const useHarVurderLovvalgOgMedlemskapVarsel = (): boolean => {
    const periode = useActivePeriod();

    if (!isBeregnetPeriode(periode)) {
        return false;
    }

    return periode.varsler.some((varsel) => varsel === 'Vurder lovvalg og medlemskap');
};
