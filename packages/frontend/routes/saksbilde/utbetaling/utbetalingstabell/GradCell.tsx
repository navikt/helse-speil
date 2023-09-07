import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';

import { CellContent } from '../../table/CellContent';
import { helgetyper } from './helgUtils';

const dagtypeIsValid = (type: Utbetalingstabelldagtype): boolean =>
    [...helgetyper, 'Arbeid', 'Ferie', 'Permisjon'].every((it) => it !== type);

const renderGrad = (grad?: Maybe<number>): string | false => typeof grad === 'number' && `${Math.floor(grad)} %`;

interface GradCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    tabelldag: Utbetalingstabelldag;
    overstyrtDag?: Utbetalingstabelldag;
}

export const GradCell: React.FC<GradCellProps> = ({ tabelldag, overstyrtDag, ...rest }) => {
    const gradErOverstyrt = overstyrtDag && overstyrtDag.grad !== tabelldag.grad;
    const overstyringstekst =
        typeof tabelldag.grad === 'number' ? `Endret fra ${tabelldag.grad} %` : 'Endret fra dag uten grad';

    return (
        <td {...rest}>
            {gradErOverstyrt && <Endringstrekant text={overstyringstekst} />}
            <CellContent justifyContent="flex-end">
                {dagtypeIsValid(overstyrtDag?.dag.speilDagtype ?? tabelldag.dag.speilDagtype) &&
                    renderGrad(overstyrtDag?.grad ?? tabelldag.grad)}
            </CellContent>
        </td>
    );
};
