import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';
import { Maybe } from '@utils/ts';

import { CellContent } from '../../table/CellContent';
import { Cell } from './Cell';

interface GjenståendeDagerCellProps {
    gjenståendeDager?: Maybe<number>;
    erOverstyrt?: boolean;
    erNyDag?: boolean;
}

export const GjenståendeDagerCell = ({ gjenståendeDager, erOverstyrt, erNyDag = false }: GjenståendeDagerCellProps) => (
    <Cell italic={erOverstyrt}>
        {erOverstyrt && !erNyDag && <Endringstrekant />}
        <CellContent flexEnd>{gjenståendeDager ?? '-'}</CellContent>
    </Cell>
);
