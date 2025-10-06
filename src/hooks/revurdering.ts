import { Maybe, PersonFragment } from '@io/graphql';
import { useAktivtInntektsforhold } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useActivePeriodHasLatestSkjæringstidspunkt = (person: Maybe<PersonFragment>): boolean => {
    const period = useActivePeriod(person);
    const inntektsforhold = useAktivtInntektsforhold(person);

    if (!period || !inntektsforhold || !isBeregnetPeriode(period)) {
        return false;
    }

    const lastBeregnetPeriode = inntektsforhold.generasjoner[0]?.perioder.filter(isBeregnetPeriode)[0];

    return lastBeregnetPeriode !== undefined && lastBeregnetPeriode.skjaeringstidspunkt === period.skjaeringstidspunkt;
};
