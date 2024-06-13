import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

const harPersonutbetaling = (dag: Utbetalingstabelldag): boolean =>
    typeof dag.personbeløp === 'number' && dag.personbeløp > 0;
const harArbeidsgiverutbetaling = (dag: Utbetalingstabelldag): boolean =>
    typeof dag.arbeidsgiverbeløp === 'number' && dag.arbeidsgiverbeløp > 0;
export const getDagerMedUtbetaling = (dager: Array<Utbetalingstabelldag>): Array<Utbetalingstabelldag> =>
    dager
        .filter((dag) => harPersonutbetaling(dag) || harArbeidsgiverutbetaling(dag))
        .filter((dag) => !dag.erAvvist && !dag.erForeldet);
export const getTotalPersonbeløp = (dager: Array<Utbetalingstabelldag>): number =>
    dager.reduce((total, dag) => total + (dag.personbeløp ?? 0), 0);
export const getTotalArbeidsgiverbeløp = (dager: Array<Utbetalingstabelldag>): number =>
    dager.reduce((total, dag) => total + (dag.arbeidsgiverbeløp ?? 0), 0);
