import React from 'react';

import { Overstyringsindikator } from './Overstyringsindikator';

interface GjenståendeDagerCellProps {
    gjenståendeDager?: number;
    erOverstyrt?: boolean;
}

export const GjenståendeDagerCell = ({ gjenståendeDager, erOverstyrt }: GjenståendeDagerCellProps) => (
    <td>
        {erOverstyrt && <Overstyringsindikator />}
        {gjenståendeDager}
    </td>
);
