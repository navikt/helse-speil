import { Dayjs } from 'dayjs';
import React from 'react';

import { NORSK_DATOFORMAT } from '../../../../utils/date';

interface DateCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    date: Dayjs;
}

export const DateCell = ({ date, ...rest }: DateCellProps) => <td {...rest}>{date.format(NORSK_DATOFORMAT)}</td>;
