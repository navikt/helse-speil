import { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { ApiGraderteAndreYtelserDag } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { CellContent } from '@saksbilde/table/CellContent';
import { Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

import { erHelgDagtype } from './helgUtils';

interface AndreYtelserCellProps {
    dagtype: Utbetalingstabelldagtype;
    graderteAndreYtelserDag?: ApiGraderteAndreYtelserDag;
}

export function AndreYtelserCell({ dagtype, graderteAndreYtelserDag }: AndreYtelserCellProps): ReactElement {
    return (
        <Table.DataCell>
            <CellContent flexEnd>{!erHelgDagtype(dagtype) && visningstekst(graderteAndreYtelserDag)}</CellContent>
        </Table.DataCell>
    );
}

function visningstekst(graderteAndreYtelserDag?: ApiGraderteAndreYtelserDag): string {
    const grader = Object.values(graderteAndreYtelserDag?.andreYtelserGrader ?? {});
    if (grader.length === 0) return '-';
    return `${grader.reduce((sum, grad) => sum + grad, 0)} %`;
}
