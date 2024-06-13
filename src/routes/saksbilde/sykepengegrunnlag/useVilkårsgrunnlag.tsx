import { PersonFragment, Vilkarsgrunnlag } from '@io/graphql';
import { getVilkårsgrunnlag } from '@state/utils';
import { ActivePeriod } from '@typer/shared';
import { Maybe } from '@utils/ts';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

export const useVilkårsgrunnlag = (
    person?: Maybe<PersonFragment>,
    period?: Maybe<ActivePeriod>,
): Maybe<Vilkarsgrunnlag> => {
    if (!person || !period || (!isGhostPeriode(period) && !isBeregnetPeriode(period)) || !period.vilkarsgrunnlagId) {
        return null;
    }

    return getVilkårsgrunnlag(person, period.vilkarsgrunnlagId);
};
