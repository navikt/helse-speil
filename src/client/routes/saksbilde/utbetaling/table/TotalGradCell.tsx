import { Dagtype } from 'internal-types';
import React from 'react';

import { CellContainer } from './CellContainer';

const dagtypeIsValid = (type: Dagtype): boolean =>
    [Dagtype.Helg, Dagtype.Arbeidsdag, Dagtype.Ferie, Dagtype.Permisjon].every((it) => it !== type);

interface TotalGradProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    type: Dagtype;
    totalGradering?: number;
}

export const TotalGradCell = ({ type, totalGradering, ...rest }: TotalGradProps) => {
    const showTotalGradering = totalGradering && dagtypeIsValid(type);

    return (
        <td {...rest}>
            <CellContainer>{showTotalGradering && `${totalGradering} %`}</CellContainer>
        </td>
    );
};
