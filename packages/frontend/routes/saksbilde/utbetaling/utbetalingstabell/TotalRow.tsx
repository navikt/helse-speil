import classNames from 'classnames';
import React from 'react';

import { Bold } from '@components/Bold';

import { Row } from '../../table/Row';
import { UtbetalingCell } from './UtbetalingCell';

import styles from './TotalRow.module.css';

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

interface TotalRowProps {
    dager: Array<UtbetalingstabellDag>;
    overstyrer?: boolean;
}

export const TotalRow = React.memo(({ dager, overstyrer }: TotalRowProps) => {
    const utbetalingsdager = getDagerMedUtbetaling(dager);
    const arbeidsgiverbeløpTotal = getTotalArbeidsgiverbeløp(utbetalingsdager);
    const personbeløpTotal = getTotalPersonbeløp(utbetalingsdager);

    return (
        <Row className={classNames(styles.TotalRow, overstyrer && styles.overstyrer)}>
            <td style={{ fontWeight: 'bold' }}>TOTAL</td>
            <td>
                <Bold>{utbetalingsdager.length} dager</Bold>
            </td>
            <td />
            <td />
            <td />
            <UtbetalingCell style={{ fontWeight: 'bold' }} utbetaling={arbeidsgiverbeløpTotal} />
            <UtbetalingCell style={{ fontWeight: 'bold' }} utbetaling={personbeløpTotal} />
            <td />
            <td />
        </Row>
    );
});
