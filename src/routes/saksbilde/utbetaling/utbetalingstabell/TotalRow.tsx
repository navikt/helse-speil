import classNames from 'classnames';
import React from 'react';

import { Bold } from '@components/Bold';
import { Row } from '@saksbilde/table/Row';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { UtbetalingCell } from './UtbetalingCell';
import { getDagerMedUtbetaling, getTotalArbeidsgiverbeløp, getTotalPersonbeløp } from './dagerUtils';

import styles from './TotalRow.module.css';

interface TotalRowProps {
    dager: Array<Utbetalingstabelldag>;
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
            {overstyrer && <td />}
        </Row>
    );
});
