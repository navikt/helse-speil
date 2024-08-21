import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

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

export const TotalRow = React.memo(({ dager, overstyrer }: TotalRowProps): ReactElement => {
    const utbetalingsdager = getDagerMedUtbetaling(dager);
    const arbeidsgiverbeløpTotal = getTotalArbeidsgiverbeløp(utbetalingsdager);
    const personbeløpTotal = getTotalPersonbeløp(utbetalingsdager);

    return (
        <Row className={classNames(styles.TotalRow, overstyrer && styles.overstyrer)}>
            <Table.DataCell style={{ fontWeight: 'bold' }}>TOTAL</Table.DataCell>
            <Table.DataCell>
                <Bold>{utbetalingsdager.length} dager</Bold>
            </Table.DataCell>
            <Table.DataCell />
            <Table.DataCell />
            <Table.DataCell />
            <UtbetalingCell style={{ fontWeight: 'bold' }} utbetaling={arbeidsgiverbeløpTotal} />
            <UtbetalingCell style={{ fontWeight: 'bold' }} utbetaling={personbeløpTotal} />
            <Table.DataCell />
            <Table.DataCell />
            {overstyrer && <Table.DataCell />}
        </Row>
    );
});
