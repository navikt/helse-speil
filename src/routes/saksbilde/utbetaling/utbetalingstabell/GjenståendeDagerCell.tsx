import React, { ReactElement } from 'react';

import { Endringstrekant } from '@components/Endringstrekant';
import { CellContent } from '@saksbilde/table/CellContent';

import { Cell } from './Cell';

interface GjenståendeDagerCellProps {
    gjenståendeDager?: number | null;
    erOverstyrt?: boolean;
    erNyDag?: boolean;
}

export const GjenståendeDagerCell = ({
    gjenståendeDager,
    erOverstyrt,
    erNyDag = false,
}: GjenståendeDagerCellProps): ReactElement => (
    <Cell italic={erOverstyrt}>
        {erOverstyrt && !erNyDag && <Endringstrekant />}
        <CellContent flexEnd>{gjenståendeDager ?? '-'}</CellContent>
    </Cell>
);
