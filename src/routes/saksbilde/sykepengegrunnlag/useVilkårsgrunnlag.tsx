import { Maybe, Person, Vilkarsgrunnlag } from '@io/graphql';
import { getVilkårsgrunnlag } from '@state/utils';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

export const useVilkårsgrunnlag = (person?: Maybe<Person>, period?: Maybe<ActivePeriod>): Maybe<Vilkarsgrunnlag> => {
    if (!person || !period || (!isGhostPeriode(period) && !isBeregnetPeriode(period)) || !period.vilkarsgrunnlagId) {
        return null;
    }

    return getVilkårsgrunnlag(person, period.vilkarsgrunnlagId);
};
