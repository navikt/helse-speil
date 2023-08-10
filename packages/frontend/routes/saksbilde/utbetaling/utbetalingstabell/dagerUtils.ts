const harPersonutbetaling = (dag: UtbetalingstabellDag): boolean =>
    typeof dag.personbeløp === 'number' && dag.personbeløp > 0;
const harArbeidsgiverutbetaling = (dag: UtbetalingstabellDag): boolean =>
    typeof dag.arbeidsgiverbeløp === 'number' && dag.arbeidsgiverbeløp > 0;
export const getDagerMedUtbetaling = (dager: Array<UtbetalingstabellDag>): Array<UtbetalingstabellDag> =>
    dager
        .filter((dag) => harPersonutbetaling(dag) || harArbeidsgiverutbetaling(dag))
        .filter((dag) => dag.type !== 'Avslått');
export const getTotalPersonbeløp = (dager: Array<UtbetalingstabellDag>): number =>
    dager.reduce((total, dag) => total + (dag.personbeløp ?? 0), 0);
export const getTotalArbeidsgiverbeløp = (dager: Array<UtbetalingstabellDag>): number =>
    dager.reduce((total, dag) => total + (dag.arbeidsgiverbeløp ?? 0), 0);
