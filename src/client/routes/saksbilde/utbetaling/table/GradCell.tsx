import { Dagtype } from 'internal-types';
import React from 'react';

import { CellContainer } from './CellContainer';

const dagtypeIsValid = (type: Dagtype): boolean =>
    [Dagtype.Helg, Dagtype.Arbeidsdag, Dagtype.Ferie, Dagtype.Permisjon].every((it) => it !== type);

interface GradCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    type: Dagtype;
    grad?: number;
}

export const GradCell = ({ type, grad, ...rest }: GradCellProps) => (
    <td {...rest}>
        <CellContainer>{dagtypeIsValid(type) && !!grad && `${grad} %`}</CellContainer>
    </td>
);
