import { Utbetalingsdag } from 'internal-types';

export type UtbetalingstabellDag = Utbetalingsdag & {
    dagerIgjen?: number;
};
