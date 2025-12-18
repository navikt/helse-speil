import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort, Table } from '@navikt/ds-react';

import rowStyles from '@saksbilde/table/Row.module.scss';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { UtbetalingCell } from './UtbetalingCell';
import { getDagerMedUtbetaling, getTotalArbeidsgiverbeløp, getTotalPersonbeløp } from './dagerUtils';

import styles from './TotalRow.module.css';

interface TotalRowProps {
    dager: Utbetalingstabelldag[];
    overstyrer?: boolean;
    erSelvstendigNæring: boolean;
}

export const TotalRow = React.memo(({ dager, overstyrer, erSelvstendigNæring }: TotalRowProps): ReactElement => {
    const utbetalingsdager = getDagerMedUtbetaling(dager);
    const arbeidsgiverbeløpTotal = getTotalArbeidsgiverbeløp(utbetalingsdager);
    const personbeløpTotal = getTotalPersonbeløp(utbetalingsdager);

    return (
        <Table.Row className={classNames(rowStyles.row, styles.TotalRow, overstyrer && styles.overstyrer)}>
            <Table.DataCell style={{ fontWeight: 'bold' }}>TOTAL</Table.DataCell>
            <Table.DataCell>
                <BodyShort weight="semibold">{utbetalingsdager.length} dager</BodyShort>
            </Table.DataCell>
            <Table.DataCell />
            <Table.DataCell />
            <Table.DataCell />
            {!erSelvstendigNæring && (
                <UtbetalingCell style={{ fontWeight: 'bold' }} utbetaling={arbeidsgiverbeløpTotal} />
            )}
            <UtbetalingCell style={{ fontWeight: 'bold' }} utbetaling={personbeløpTotal} />
            <Table.DataCell />
            <Table.DataCell />
            {overstyrer && <Table.DataCell />}
        </Table.Row>
    );
});

TotalRow.displayName = 'TotalRow';
