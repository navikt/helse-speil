import { useMemo } from 'react';

import { Dag } from '@io/graphql';

import {
    getDagerMedUtbetaling,
    getTotalArbeidsgiverbeløp,
    getTotalPersonbeløp,
} from '../routes/saksbilde/utbetaling/utbetalingstabell/TotalRow';
import { useTabelldagerMap } from '../routes/saksbilde/utbetaling/utbetalingstabell/useTabelldagerMap';

export const useTotalbeløp = (tidslinje?: Maybe<Dag[]>) => {
    const dager = useTabelldagerMap({ tidslinje: tidslinje ?? [] });
    const utbetalingsdager = getDagerMedUtbetaling(useMemo(() => Array.from(dager.values()), [dager]));

    const arbeidsgiverTotalbeløp = getTotalArbeidsgiverbeløp(utbetalingsdager);
    const personTotalbeløp = getTotalPersonbeløp(utbetalingsdager);

    return {
        arbeidsgiverTotalbeløp: arbeidsgiverTotalbeløp,
        personTotalbeløp: personTotalbeløp,
        totalbeløp: personTotalbeløp + arbeidsgiverTotalbeløp,
    };
};
