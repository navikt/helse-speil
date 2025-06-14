import { Maybe, PersonFragment, VilkarsgrunnlagInfotrygdV2, VilkarsgrunnlagSpleisV2 } from '@io/graphql';
import { getVilkårsgrunnlag } from '@state/utils';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

export const useVilkårsgrunnlag = (
    person?: Maybe<PersonFragment>,
    period?: Maybe<ActivePeriod>,
): Maybe<VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2> => {
    if (!person || !period || (!isGhostPeriode(period) && !isBeregnetPeriode(period)) || !period.vilkarsgrunnlagId) {
        return null;
    }

    return getVilkårsgrunnlag(person, period.vilkarsgrunnlagId);
};
