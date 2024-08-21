import React from 'react';

import { Table } from '@navikt/ds-react';

import { DateString } from '@typer/shared';
import { getFormattedDateString } from '@utils/date';

import styles from './DateCell.module.css';

interface DateCellProps {
    date: DateString;
    erOverstyrt?: boolean;
}

export const DateCell = ({ date, erOverstyrt }: DateCellProps) =>
    erOverstyrt ? (
        <Table.DataCell className={styles.datecell}>{getFormattedDateString(date)}</Table.DataCell>
    ) : (
        <Table.DataCell>{getFormattedDateString(date)}</Table.DataCell>
    );
