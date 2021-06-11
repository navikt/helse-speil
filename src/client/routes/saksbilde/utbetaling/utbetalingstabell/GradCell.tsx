import { Dagtype } from 'internal-types';
import React from 'react';

const dagtypeIsValid = (type: Dagtype): boolean =>
    [Dagtype.Helg, Dagtype.Arbeidsdag, Dagtype.Ferie, Dagtype.Permisjon].every((it) => it !== type);

interface GradCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    type: Dagtype;
    grad?: number;
}

export const GradCell = ({ type, grad, ...rest }: GradCellProps) => (
    <td {...rest}>{dagtypeIsValid(type) && !!grad && `${grad} %`}</td>
);
