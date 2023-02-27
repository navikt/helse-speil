import dayjs from 'dayjs';

import { Varselstatus } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const useUvurderteVarslerPåPeriode = (periode: FetchedBeregnetPeriode | DatePeriod): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver();

    if ((!isBeregnetPeriode(periode) && !isUberegnetPeriode(periode)) || !arbeidsgiver) {
        return false;
    }

    return periode.varslerForGenerasjon
        .filter((varsel) => !varsel.kode.startsWith('SB_BO_'))
        .some(
            (varsel) =>
                varsel.vurdering?.status !== Varselstatus.Vurdert && varsel.vurdering?.status !== Varselstatus.Godkjent
        );
};

export const useHarUvurderteVarslerPåUtbetaling = (activePeriod: FetchedBeregnetPeriode): boolean => {
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!arbeidsgiver) {
        return false;
    }

    return arbeidsgiver.generasjoner[0].perioder
        .filter((periode) => dayjs(periode.tom).isSameOrBefore(dayjs(activePeriod.tom)))
        .some((periode) => {
            if (!isBeregnetPeriode(periode) && !isUberegnetPeriode(periode)) return false;
            return periode.varslerForGenerasjon
                .filter((varsel) => !varsel.kode.startsWith('SB_BO_'))
                .some(
                    (varsel) =>
                        varsel.vurdering?.status !== Varselstatus.Vurdert &&
                        varsel.vurdering?.status !== Varselstatus.Godkjent
                );
        });
};
