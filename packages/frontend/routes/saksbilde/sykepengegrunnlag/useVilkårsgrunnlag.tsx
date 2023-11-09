import { Vilkarsgrunnlag } from '@io/graphql';
import { getVilkårsgrunnlag } from '@state/selectors/person';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetVilkarsprovdPeriode } from '@utils/typeguards';

export const useVilkårsgrunnlag = (
    person?: Maybe<FetchedPerson>,
    period?: Maybe<ActivePeriod>,
): Maybe<Vilkarsgrunnlag> => {
    if (
        !person ||
        !period ||
        (!isGhostPeriode(period) && !isBeregnetPeriode(period) && !isUberegnetVilkarsprovdPeriode(period)) ||
        !period.vilkarsgrunnlagId
    ) {
        return null;
    }

    return getVilkårsgrunnlag(person, period.vilkarsgrunnlagId);
};
