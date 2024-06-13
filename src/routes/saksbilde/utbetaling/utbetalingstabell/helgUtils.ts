import { Utbetalingstabelldagtype } from '@/routes/saksbilde/utbetaling/utbetalingstabell/types';

export const helgetyper = ['SykHelg', 'FriskHelg', 'Feriehelg', 'Helg'];
export const erHelg = (dagtype: Utbetalingstabelldagtype) => [...helgetyper].includes(dagtype);
