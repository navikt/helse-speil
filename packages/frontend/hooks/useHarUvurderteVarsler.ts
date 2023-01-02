import { Varselstatus } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { skalViseAvhukbareVarsler } from '@utils/featureToggles';

export const useHarUvurderteVarsler = (periode: FetchedBeregnetPeriode): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver();

    // For å ikke gå i beina på eksisterende flyt
    if (!skalViseAvhukbareVarsler) return false;

    if (!arbeidsgiver) {
        return false;
    }

    return periode.varslerForGenerasjon
        .filter((varsel) => !varsel.kode.startsWith('SB_BO_'))
        .some((varsel) => varsel.vurdering?.status !== Varselstatus.Vurdert);
};
