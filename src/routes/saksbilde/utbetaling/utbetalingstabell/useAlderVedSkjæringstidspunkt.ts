import dayjs from 'dayjs';

import { Maybe } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useAlderVedSkjæringstidspunkt = (fødselsdato?: Maybe<string>): Maybe<number> => {
    const period = useActivePeriod();

    if (typeof fødselsdato === 'string' && isBeregnetPeriode(period)) {
        return dayjs(period.skjaeringstidspunkt).diff(fødselsdato, 'year');
    } else {
        return null;
    }
};
