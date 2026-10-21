import dayjs from 'dayjs';

import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useAlderVedSkjæringstidspunkt = (
    person: ApiSaksbildePerson,
    fødselsdato?: string | null,
): number | null => {
    const period = useActivePeriod(person);

    if (typeof fødselsdato === 'string' && isBeregnetPeriode(period)) {
        return dayjs(period.skjaeringstidspunkt).diff(fødselsdato, 'year');
    } else {
        return null;
    }
};
