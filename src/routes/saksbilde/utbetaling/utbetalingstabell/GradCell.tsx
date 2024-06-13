import React, { ReactElement } from 'react';

import { Utbetalingstabelldag, Utbetalingstabelldagtype } from '@/routes/saksbilde/utbetaling/utbetalingstabell/types';
import { Endringstrekant } from '@components/Endringstrekant';
import { Maybe } from '@utils/ts';

import { CellContent } from '../../table/CellContent';
import { helgetyper } from './helgUtils';

const dagtypeIsValid = (type: Utbetalingstabelldagtype): boolean =>
    [...helgetyper, 'Arbeid', 'Ferie', 'Permisjon'].every((it) => it !== type);

const renderGrad = (grad?: Maybe<number>): string | false => typeof grad === 'number' && `${Math.floor(grad)} %`;

interface GradCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    tabelldag: Utbetalingstabelldag;
    overstyrtDag?: Utbetalingstabelldag;
}

export const GradCell = ({ tabelldag, overstyrtDag, ...rest }: GradCellProps): ReactElement => {
    const gradErOverstyrt = overstyrtDag && overstyrtDag.grad !== tabelldag.grad;
    const overstyringstekst =
        typeof tabelldag.grad === 'number' ? `Endret fra ${tabelldag.grad} %` : 'Endret fra dag uten grad';

    return (
        <td {...rest}>
            {gradErOverstyrt && <Endringstrekant text={overstyringstekst} />}
            <CellContent flexEnd>
                {dagtypeIsValid(overstyrtDag?.dag.speilDagtype ?? tabelldag.dag.speilDagtype) &&
                    renderGrad(overstyrtDag?.grad ?? tabelldag.grad)}
            </CellContent>
        </td>
    );
};
