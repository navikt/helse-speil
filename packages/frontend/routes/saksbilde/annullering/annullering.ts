import { Simuleringsperiode, Utbetaling } from '@io/graphql';
import { somDato } from '@utils/date';

const finnBruttoUtbetalingerFor = (perioder?: Maybe<Array<Simuleringsperiode>>) =>
    perioder
        ?.flatMap((it) =>
            it.utbetalinger.flatMap(
                (utbetaling) => utbetaling?.detaljer.filter((detalj) => detalj.utbetalingstype !== 'SKAT'),
            ),
        )
        .flatMap((simuleringsdetalj) => simuleringsdetalj?.belop ?? 0) ?? [];

// Filtrerer ut skattelinjene i personbeløpet for å finne brutto
export const finnTotalBruttoUtbetaltForSykefraværstilfellet = (utbetaling?: Maybe<Utbetaling>) =>
    finnBruttoUtbetalingerFor(utbetaling?.personsimulering?.perioder).reduce((delSum, beløp) => delSum + beløp, 0) +
    (utbetaling?.arbeidsgiversimulering?.totalbelop ?? 0);

export const finnSisteUtbetalingsdag = (utbetaling?: Maybe<Utbetaling>) =>
    [...(utbetaling?.arbeidsgiversimulering?.perioder ?? []), ...(utbetaling?.personsimulering?.perioder ?? [])]
        ?.flatMap((it) => it.tom)
        .sort(dateDescending)
        .shift();

export const finnFørsteUtbetalingsdag = (utbetaling?: Maybe<Utbetaling>) =>
    [...(utbetaling?.arbeidsgiversimulering?.perioder ?? []), ...(utbetaling?.personsimulering?.perioder ?? [])]
        ?.flatMap((it) => it.fom)
        .sort(dateDescending)
        .pop();

const dateDescending = (d1: string, d2: string): number => (somDato(d2).isBefore(somDato(d1)) ? -1 : 1);
