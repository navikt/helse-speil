import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';

import { CellContent } from '../../table/CellContent';
import { helgetyper } from './Utbetalingstabell';

const dagtypeIsValid = (type: Utbetalingstabelldagtype): boolean =>
    [...helgetyper, 'Arbeid', 'Ferie', 'Permisjon'].every((it) => it !== type);

const renderGrad = (grad?: Maybe<number>): string | false => typeof grad === 'number' && `${Math.floor(grad)} %`;

interface GradCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    dag: UtbetalingstabellDag;
    overstyrtDag?: UtbetalingstabellDag;
}

export const GradCell: React.FC<GradCellProps> = ({ dag, overstyrtDag, ...rest }) => {
    const gradErOverstyrt = overstyrtDag && overstyrtDag.grad !== dag.grad;
    const overstyringstekst = typeof dag.grad === 'number' ? `Endret fra ${dag.grad} %` : 'Endret fra dag uten grad';

    return (
        <td {...rest}>
            {gradErOverstyrt && <Endringstrekant text={overstyringstekst} />}
            <CellContent justifyContent="flex-end">
                {dagtypeIsValid(overstyrtDag?.type ?? dag.type) && renderGrad(overstyrtDag?.grad ?? dag.grad)}
            </CellContent>
        </td>
    );
};
