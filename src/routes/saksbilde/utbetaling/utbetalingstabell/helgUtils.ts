import { Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

export const helgetyper = ['SykHelg', 'FriskHelg', 'Feriehelg', 'Helg'];
export const erHelg = (dagtype: Utbetalingstabelldagtype) => [...helgetyper].includes(dagtype);
