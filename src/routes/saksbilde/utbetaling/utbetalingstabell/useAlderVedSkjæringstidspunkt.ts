import dayjs from 'dayjs';

import { PersonFragment } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useAlderVedSkjæringstidspunkt = (person: PersonFragment, fødselsdato?: string | null): number | null => {
    const period = useActivePeriod(person);

    if (typeof fødselsdato === 'string' && isBeregnetPeriode(period)) {
        return dayjs(period.skjaeringstidspunkt).diff(fødselsdato, 'year');
    } else {
        return null;
    }
};
