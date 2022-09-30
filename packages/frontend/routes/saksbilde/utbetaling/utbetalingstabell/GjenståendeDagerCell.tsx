import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';

import { CellContent } from '../../table/CellContent';
import { Cell } from './Cell';

interface GjenståendeDagerCellProps {
    gjenståendeDager?: Maybe<number>;
    erOverstyrt?: boolean;
}

export const GjenståendeDagerCell = ({ gjenståendeDager, erOverstyrt }: GjenståendeDagerCellProps) => (
    <Cell erOverstyrt={erOverstyrt}>
        {erOverstyrt && <Endringstrekant />}
        <CellContent justifyContent="flex-end">{gjenståendeDager ?? '-'}</CellContent>
    </Cell>
);
