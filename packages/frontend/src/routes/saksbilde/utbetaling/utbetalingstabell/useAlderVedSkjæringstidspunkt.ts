import dayjs from 'dayjs';

import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useAlderVedSkjæringstidspunkt = (): number | null => {
    const birthDate = useCurrentPerson()?.personinfo.fodselsdato;
    const period = useActivePeriod();

    if (typeof birthDate === 'string' && isBeregnetPeriode(period)) {
        return dayjs(period.skjaeringstidspunkt).diff(birthDate, 'year');
    } else {
        return null;
    }
};
