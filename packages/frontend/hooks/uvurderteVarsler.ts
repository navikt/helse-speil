import { Varselstatus } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { skalViseAvhukbareVarsler } from '@utils/featureToggles';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useUvurderteVarslerPåPeriode = (periode: FetchedBeregnetPeriode | DatePeriod): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver();

    // For å ikke gå i beina på eksisterende flyt
    if (!skalViseAvhukbareVarsler) return false;

    if (!isBeregnetPeriode(periode) || !arbeidsgiver) {
        return false;
    }

    return periode.varslerForGenerasjon
        .filter((varsel) => !varsel.kode.startsWith('SB_BO_'))
        .some(
            (varsel) =>
                varsel.vurdering?.status !== Varselstatus.Vurdert && varsel.vurdering?.status !== Varselstatus.Godkjent
        );
};

export const useHarUvurderteVarslerPåUtbetaling = (utbetalingId: string): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver();

    // For å ikke gå i beina på eksisterende flyt
    if (!skalViseAvhukbareVarsler) return false;

    if (!arbeidsgiver) {
        return false;
    }

    return arbeidsgiver.generasjoner[0].perioder.some((periode) => {
        if (!isBeregnetPeriode(periode)) return false;
        if (periode.utbetaling.id !== utbetalingId) return false;
        return periode.varslerForGenerasjon
            .filter((varsel) => !varsel.kode.startsWith('SB_BO_'))
            .some(
                (varsel) =>
                    varsel.vurdering?.status !== Varselstatus.Vurdert &&
                    varsel.vurdering?.status !== Varselstatus.Godkjent
            );
    });
};
