import { Dag } from '@io/graphql';
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

export const useTotalbeløp = (erSelvstendigNæringsdrivede: boolean, tidslinje?: Dag[] | null): Totalbeløp => {
    const dager = useTabelldagerMap({
        tidslinje: tidslinje ?? [],
        erSelvstendigNæringsdrivende: erSelvstendigNæringsdrivede,
    });
    const utbetalingsdager = getDagerMedUtbetaling(Array.from(dager.values()));

    const arbeidsgiverTotalbeløp = getTotalArbeidsgiverbeløp(utbetalingsdager);
    const personTotalbeløp = getTotalPersonbeløp(utbetalingsdager);

    return {
        arbeidsgiverTotalbeløp: arbeidsgiverTotalbeløp,
        personTotalbeløp: personTotalbeløp,
        totalbeløp: personTotalbeløp + arbeidsgiverTotalbeløp,
    };
};
