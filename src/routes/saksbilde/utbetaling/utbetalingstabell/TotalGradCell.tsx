import React, { ReactElement } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { CellContent } from '@saksbilde/table/CellContent';
import { Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

import { Cell } from './Cell';
import { helgetyper } from './helgUtils';

const dagtypeIsValid = (type: Utbetalingstabelldagtype): boolean =>
    [...helgetyper, 'Arbeid', 'Ferie', 'Permisjon'].every((it) => it !== type);

interface TotalGradProps {
    type: Utbetalingstabelldagtype;
    erOverstyrt?: boolean;
    totalGradering?: number | null;
    erNyDag?: boolean;
}

export const TotalGradCell = ({ type, erOverstyrt, totalGradering, erNyDag = false }: TotalGradProps): ReactElement => {
    const showTotalGradering = typeof totalGradering === 'number' && dagtypeIsValid(type);

    return (
        <Cell italic={erOverstyrt}>
            {erOverstyrt && !erNyDag && <Endringstrekant />}
            {showTotalGradering && (
                <Tooltip content={`${totalGradering.toFixed(2).replace('.', ',')} %`} placement="right">
                    <span>
                        <CellContent flexEnd>{`${Math.floor(totalGradering)} %`}</CellContent>
                    </span>
                </Tooltip>
            )}
        </Cell>
    );
};
