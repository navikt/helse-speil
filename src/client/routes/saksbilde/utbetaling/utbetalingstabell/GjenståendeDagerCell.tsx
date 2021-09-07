import React from 'react';

import { Overstyringsindikator } from '../../../../components/Overstyringsindikator';

import { Cell } from './Cell';

interface GjenståendeDagerCellProps {
    gjenståendeDager?: number;
    erOverstyrt?: boolean;
}

export const GjenståendeDagerCell = ({ gjenståendeDager, erOverstyrt }: GjenståendeDagerCellProps) => (
    <Cell erOverstyrt={erOverstyrt}>
        {erOverstyrt && <Overstyringsindikator />}
        {gjenståendeDager}
    </Cell>
);
