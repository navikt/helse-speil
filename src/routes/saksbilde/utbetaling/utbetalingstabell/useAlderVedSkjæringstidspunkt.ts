import dayjs from 'dayjs';

import { Maybe } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useAlderVedSkjæringstidspunkt = (): Maybe<number> => {
    const birthDate = useCurrentPerson()?.personinfo.fodselsdato;
    const period = useActivePeriod();

    if (typeof birthDate === 'string' && isBeregnetPeriode(period)) {
        return dayjs(period.skjaeringstidspunkt).diff(birthDate, 'year');
    } else {
        return null;
    }
};
