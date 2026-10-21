import dayjs from 'dayjs';

import { ApiBeregnetPeriode, ApiSaksbildeVarselstatus } from '@io/rest/generated/spesialist.schemas';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { DatePeriod } from '@typer/shared';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export const harUvurderteVarslerPåPeriode = (periode: ApiBeregnetPeriode | DatePeriod): boolean => {
    if (!isBeregnetPeriode(periode) && !isUberegnetPeriode(periode)) {
        return false;
    }

    return periode.varsler
        .filter((varsel) => !varsel.kode.startsWith('SB_BO_'))
        .some(
            (varsel) =>
                varsel.vurdering?.status !== ApiSaksbildeVarselstatus.VURDERT &&
                varsel.vurdering?.status !== ApiSaksbildeVarselstatus.GODKJENT,
        );
};

export const harUvurderteVarslerPåEllerFør = (
    activePeriod: ApiBeregnetPeriode,
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
                        varsel.vurdering?.status !== ApiSaksbildeVarselstatus.VURDERT &&
                        varsel.vurdering?.status !== ApiSaksbildeVarselstatus.GODKJENT,
                );
        });
};
