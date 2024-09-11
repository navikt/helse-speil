import dayjs from 'dayjs';

import { Maybe } from '@io/graphql';
import { useActivePeriodOld } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useAlderVedSkjæringstidspunkt = (fødselsdato?: Maybe<string>): Maybe<number> => {
    const period = useActivePeriodOld();

    if (typeof fødselsdato === 'string' && isBeregnetPeriode(period)) {
        return dayjs(period.skjaeringstidspunkt).diff(fødselsdato, 'year');
    } else {
        return null;
    }
};
