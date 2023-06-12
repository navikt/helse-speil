import { Vilkarsgrunnlag } from '@io/graphql';
import { getRequiredVilkårsgrunnlag } from '@state/selectors/person';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

export const useVilkårsgrunnlag = (
    person?: Maybe<FetchedPerson>,
    period?: Maybe<ActivePeriod>,
): Maybe<Vilkarsgrunnlag> => {
    if (!person || (!isGhostPeriode(period) && !isBeregnetPeriode(period)) || !period.vilkarsgrunnlagId) {
        return null;
    }

    return getRequiredVilkårsgrunnlag(person, period.vilkarsgrunnlagId);
};
