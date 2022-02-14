import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';

import { Cell } from './Cell';

interface GjenståendeDagerCellProps {
    gjenståendeDager?: number;
    erOverstyrt?: boolean;
}

export const GjenståendeDagerCell = ({ gjenståendeDager, erOverstyrt }: GjenståendeDagerCellProps) => (
    <Cell erOverstyrt={erOverstyrt}>
        {erOverstyrt && <Endringstrekant />}
        {gjenståendeDager}
    </Cell>
);
