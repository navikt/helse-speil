import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';

import { Cell } from './Cell';
import { CellContent } from '../../table/CellContent';

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
