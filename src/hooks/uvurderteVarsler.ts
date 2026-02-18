import dayjs from 'dayjs';

import { BeregnetPeriodeFragment, Varselstatus } from '@io/graphql';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { DatePeriod } from '@typer/shared';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const harUvurderteVarslerPåPeriode = (periode: BeregnetPeriodeFragment | DatePeriod): boolean => {
    if (!isBeregnetPeriode(periode) && !isUberegnetPeriode(periode)) {
        return false;
    }

    return periode.varsler
        .filter((varsel) => !varsel.kode.startsWith('SB_BO_'))
        .some(
            (varsel) =>
                varsel.vurdering?.status !== Varselstatus.Vurdert && varsel.vurdering?.status !== Varselstatus.Godkjent,
        );
};

export const harUvurderteVarslerPåEllerFør = (
    activePeriod: BeregnetPeriodeFragment,
    inntektsforhold: Inntektsforhold[],
): boolean => {
    return inntektsforhold
        .filter((inntektsforhold) => inntektsforhold.behandlinger.length > 0)
        .flatMap((inntektsforhold) => inntektsforhold.behandlinger[0]?.perioder)
        .filter((periode) => dayjs(periode?.tom).isSameOrBefore(dayjs(activePeriod.tom)))
        .some((periode) => {
            if (!isBeregnetPeriode(periode) && !isUberegnetPeriode(periode)) return false;
            return periode.varsler
                .filter((varsel) => !varsel.kode.startsWith('SB_BO_'))
                .some(
                    (varsel) =>
                        varsel.vurdering?.status !== Varselstatus.Vurdert &&
                        varsel.vurdering?.status !== Varselstatus.Godkjent,
                );
        });
};
