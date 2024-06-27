import React, { ReactElement } from 'react';

import { Endringstrekant } from '@components/Endringstrekant';
import { Maybe } from '@io/graphql';
import { CellContent } from '@saksbilde/table/CellContent';
import { somPenger } from '@utils/locale';

import { Cell } from './Cell';

interface UtbetalingCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    erOverstyrt?: boolean;
    utbetaling?: Maybe<number>;
    erNyDag?: boolean;
}

export const UtbetalingCell = ({
    erOverstyrt,
    utbetaling,
    erNyDag = false,
    style,
}: UtbetalingCellProps): ReactElement => (
    <Cell italic={erOverstyrt} style={style}>
        {erOverstyrt && !erNyDag && <Endringstrekant />}
        <CellContent flexEnd>{utbetaling ? somPenger(utbetaling) : '-'}</CellContent>
    </Cell>
);
