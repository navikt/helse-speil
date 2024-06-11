import React from 'react';

import { DateString } from '@/types/shared';
import { getFormattedDateString } from '@utils/date';

import styles from './DateCell.module.css';

interface DateCellProps {
    date: DateString;
    erOverstyrt?: boolean;
}

export const DateCell = ({ date, erOverstyrt }: DateCellProps) =>
    erOverstyrt ? (
        <td className={styles.datecell}>{getFormattedDateString(date)}</td>
    ) : (
        <td>{getFormattedDateString(date)}</td>
    );
