import { useMemo } from 'react';

import { Dag, Maybe } from '@io/graphql';
import {
    getDagerMedUtbetaling,
    getTotalArbeidsgiverbeløp,
    getTotalPersonbeløp,
} from '@saksbilde/utbetaling/utbetalingstabell/dagerUtils';
import { useTabelldagerMap } from '@saksbilde/utbetaling/utbetalingstabell/useTabelldagerMap';

type Totalbeløp = {
    arbeidsgiverTotalbeløp: number;
    personTotalbeløp: number;
    totalbeløp: number;
};

export const useTotalbeløp = (erSelvstendigNæringsdrivede: boolean, tidslinje?: Maybe<Dag[]>): Totalbeløp => {
    const dager = useTabelldagerMap({
        tidslinje: tidslinje ?? [],
        erSelvstendigNæringsdrivende: erSelvstendigNæringsdrivede,
    });
    const utbetalingsdager = getDagerMedUtbetaling(useMemo(() => Array.from(dager.values()), [dager]));

    const arbeidsgiverTotalbeløp = getTotalArbeidsgiverbeløp(utbetalingsdager);
    const personTotalbeløp = getTotalPersonbeløp(utbetalingsdager);

    return {
        arbeidsgiverTotalbeløp: arbeidsgiverTotalbeløp,
        personTotalbeløp: personTotalbeløp,
        totalbeløp: personTotalbeløp + arbeidsgiverTotalbeløp,
    };
};
