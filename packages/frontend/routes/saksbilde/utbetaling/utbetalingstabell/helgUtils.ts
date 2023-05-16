export const helgetyper = ['SykHelg', 'FriskHelg', 'Feriehelg', 'Helg'];
export const erEksplisittHelg = (dagtype: Utbetalingstabelldagtype) => [...helgetyper].includes(dagtype);
