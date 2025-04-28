import { Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

export const helgetyper = ['SykHelg', 'FriskHelg', 'Feriehelg', 'Helg'];
export const erHelgDagtype = (dagtype: Utbetalingstabelldagtype) => [...helgetyper].includes(dagtype);
