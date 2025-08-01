import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { CellContent } from '@saksbilde/table/CellContent';
import { Utbetalingstabelldag, Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

import { helgetyper } from './helgUtils';

const dagtypeIsValid = (type: Utbetalingstabelldagtype): boolean =>
    [...helgetyper, 'Arbeid', 'Ferie', 'Permisjon'].every((it) => it !== type);

const renderGrad = (grad?: number | null): string | false => typeof grad === 'number' && `${Math.floor(grad)} %`;

interface GradCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    tabelldag: Utbetalingstabelldag;
    overstyrtDag?: Utbetalingstabelldag;
}

export const GradCell = ({ tabelldag, overstyrtDag, ...rest }: GradCellProps): ReactElement => {
    const gradErOverstyrt = overstyrtDag && overstyrtDag.grad !== tabelldag.grad;
    const overstyringstekst =
        typeof tabelldag.grad === 'number' ? `Endret fra ${tabelldag.grad} %` : 'Endret fra dag uten grad';

    return (
        <Table.DataCell {...rest}>
            {gradErOverstyrt && <Endringstrekant text={overstyringstekst} />}
            <CellContent flexEnd>
                {dagtypeIsValid(overstyrtDag?.dag.speilDagtype ?? tabelldag.dag.speilDagtype) &&
                    renderGrad(overstyrtDag?.grad ?? tabelldag.grad)}
            </CellContent>
        </Table.DataCell>
    );
};
