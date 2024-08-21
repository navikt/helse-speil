import React, { ReactElement } from 'react';

import { Button, Table } from '@navikt/ds-react';

import { CellContent } from '@saksbilde/table/CellContent';

interface SlettNydagCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    slettSisteNyeDag?: () => void;
    nyDag: boolean;
    visSlettKnapp: boolean;
}

export const SlettNyDagCell = ({
    slettSisteNyeDag,
    nyDag,
    visSlettKnapp,
    ...rest
}: SlettNydagCellProps): ReactElement => (
    <Table.DataCell {...rest}>
        <CellContent>
            {nyDag && visSlettKnapp && slettSisteNyeDag !== undefined && (
                <Button onClick={slettSisteNyeDag} size="small" variant="tertiary">
                    Slett
                </Button>
            )}
        </CellContent>
    </Table.DataCell>
);
