import { Dag, Dagtype, Sykdomsdag, Utbetalingsdag } from 'internal-types';

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

export const getMatchingSykdomsdag = (utbetalingsdag: Utbetalingsdag, sykdomstidslinje: Sykdomsdag[]): Dag =>
    sykdomstidslinje.find(({ dato }) => dato.isSame(utbetalingsdag.dato)) ?? utbetalingsdag;
