import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';
import { somPenger } from '@utils/locale';

import { CellContent } from '../../table/CellContent';
import { Cell } from './Cell';

interface UtbetalingCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    erOverstyrt?: boolean;
    utbetaling?: Maybe<number>;
    erNyDag?: boolean;
}

export const UtbetalingCell = ({ erOverstyrt, utbetaling, erNyDag = false, style }: UtbetalingCellProps) => (
    <Cell erOverstyrt={erOverstyrt} style={style}>
        {erOverstyrt && !erNyDag && <Endringstrekant />}
        <CellContent flexEnd>{utbetaling ? somPenger(utbetaling) : '-'}</CellContent>
    </Cell>
);
