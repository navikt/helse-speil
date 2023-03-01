import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';

import { CellContent } from '../../table/CellContent';
import { Cell } from './Cell';
import { helgetyper } from './Utbetalingstabell';

const dagtypeIsValid = (type: Utbetalingstabelldagtype): boolean =>
    [...helgetyper, 'Arbeid', 'Ferie', 'Permisjon'].every((it) => it !== type);

interface TotalGradProps {
    type: Utbetalingstabelldagtype;
    erOverstyrt?: boolean;
    totalGradering?: Maybe<number>;
}

export const TotalGradCell = ({ type, erOverstyrt, totalGradering }: TotalGradProps) => {
    const showTotalGradering = typeof totalGradering === 'number' && dagtypeIsValid(type);

    return (
        <Cell erOverstyrt={erOverstyrt}>
            {erOverstyrt && <Endringstrekant />}
            {showTotalGradering && (
                <CellContent justifyContent="flex-end">{`${Math.floor(totalGradering)} %`}</CellContent>
            )}
        </Cell>
    );
};
