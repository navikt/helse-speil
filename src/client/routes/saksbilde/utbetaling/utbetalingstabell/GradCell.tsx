import { Dagtype } from 'internal-types';
import React from 'react';

import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const dagtypeIsValid = (type: Dagtype): boolean =>
    [Dagtype.Helg, Dagtype.Arbeidsdag, Dagtype.Ferie, Dagtype.Permisjon].every((it) => it !== type);

const renderGrad = (grad?: number): string | false => !!grad && `${grad} %`;

interface GradCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    type: Dagtype;
    grad?: number;
    overstyrtDag?: UtbetalingstabellDag;
}

export const GradCell: React.FC<GradCellProps> = ({ type, grad, overstyrtDag, ...rest }) => (
    <td {...rest}>{dagtypeIsValid(overstyrtDag?.type ?? type) && renderGrad(overstyrtDag?.gradering ?? grad)}</td>
);
