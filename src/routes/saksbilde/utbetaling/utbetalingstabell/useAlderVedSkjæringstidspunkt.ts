import dayjs from 'dayjs';

import { useCurrentPerson } from '@person/query';
import { useActivePeriod } from '@state/periode';
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
