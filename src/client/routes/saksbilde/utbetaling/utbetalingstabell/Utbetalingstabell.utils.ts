import { Dagtype, Sykdomsdag, Utbetalingsdag } from 'internal-types';

import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const calculateNewDagerIgjen = (dag: Utbetalingsdag, dagerIgjen: number) =>
    dag.type === Dagtype.Syk && dagerIgjen > 0 ? dagerIgjen - 1 : dagerIgjen;

export const withDagerIgjen = (dager: Utbetalingsdag[], totaltAntallDagerIgjen: number): UtbetalingstabellDag[] =>
    dager.length > 0
        ? dager
              .slice(1)
              .reduce(
                  (alle, it, i) => [...alle, { ...it, dagerIgjen: calculateNewDagerIgjen(it, alle[i].dagerIgjen) }],
                  [{ ...dager[0], dagerIgjen: calculateNewDagerIgjen(dager[0], totaltAntallDagerIgjen) }]
              )
        : [];

export const getMatchingSykdomsdag = (utbetalingsdag: Utbetalingsdag, sykdomstidslinje: Sykdomsdag[]): Sykdomsdag =>
    sykdomstidslinje.find(({ dato }) => dato.isSame(utbetalingsdag.dato)) ??
    (() => {
        const dato = utbetalingsdag.dato.format(NORSK_DATOFORMAT);
        throw Error(`Utbetalingsdag ${dato} har ikke tilsvarende sykdomsdag i sykdomstidslinjen.`);
    })();
