import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';
import { somPenger } from '@utils/locale';

import { CellContent } from '../../table/CellContent';
import { Cell } from './Cell';

interface UtbetalingCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    erOverstyrt?: boolean;
    utbetaling?: Maybe<number>;
}

export const UtbetalingCell = ({ erOverstyrt, utbetaling, style }: UtbetalingCellProps) => (
    <Cell erOverstyrt={erOverstyrt} style={style}>
        {erOverstyrt && <Endringstrekant />}
        <CellContent justifyContent="flex-end">{utbetaling ? somPenger(utbetaling) : '-'}</CellContent>
    </Cell>
);
