import React from 'react';

import { Endringstrekant } from '../../../../components/Endringstrekant';

import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const dagtypeIsValid = (type: Dag['type']): boolean =>
    ['Helg', 'Arbeidsdag', 'Ferie', 'Permisjon'].every((it) => it !== type);

const renderGrad = (grad?: number): string | false => !!grad && `${grad} %`;

interface GradCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    type: Dag['type'];
    grad?: number;
    overstyrtDag?: UtbetalingstabellDag;
}

export const GradCell: React.FC<GradCellProps> = ({ type, grad, overstyrtDag, ...rest }) => {
    const gradErOverstyrt = overstyrtDag && overstyrtDag.gradering !== grad;
    const overstyringstekst = grad === undefined || grad === null ? 'Endret fra dag uten grad' : `Endret fra ${grad} %`;
    return (
        <td {...rest}>
            {gradErOverstyrt && <Endringstrekant text={overstyringstekst} />}
            {dagtypeIsValid(overstyrtDag?.type ?? type) && renderGrad(overstyrtDag?.gradering ?? grad)}
        </td>
    );
};
