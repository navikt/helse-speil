import {
    ApiSaksbildePerson,
    ApiVilkårsgrunnlagInfotrygdV2,
    ApiVilkårsgrunnlagSpleisV2,
} from '@io/rest/generated/spesialist.schemas';
import { getVilkårsgrunnlag } from '@state/utils';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

export const useVilkårsgrunnlag = (
    person?: ApiSaksbildePerson | null,
    period?: ActivePeriod | null,
): ApiVilkårsgrunnlagSpleisV2 | ApiVilkårsgrunnlagInfotrygdV2 | null => {
    if (!person || !period || (!isGhostPeriode(period) && !isBeregnetPeriode(period)) || !period.vilkarsgrunnlagId) {
        return null;
    }

    return getVilkårsgrunnlag(person, period.vilkarsgrunnlagId);
};
