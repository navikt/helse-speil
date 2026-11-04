import { ReactElement } from 'react';

import { HStack, Table } from '@navikt/ds-react';

import { EndringsloggGraderteAndreYtelser } from '@components/endringslogg/EndringsloggGraderteAndreYtelser';
import { EndringsloggKildeButton } from '@components/endringslogg/EndringsloggKildeButton';
import { ApiGraderteAndreYtelserDag } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { CellContent } from '@saksbilde/table/CellContent';
import { Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

import { GraderteAndreYtelserEndring } from './graderteAndreYtelserEndringer';
import { erHelgDagtype } from './helgUtils';

interface AndreYtelserCellProps {
    dagtype: Utbetalingstabelldagtype;
    graderteAndreYtelserDag?: ApiGraderteAndreYtelserDag;
    endringer?: GraderteAndreYtelserEndring[];
}

export function AndreYtelserCell({
    dagtype,
    graderteAndreYtelserDag,
    endringer = [],
}: AndreYtelserCellProps): ReactElement {
    return (
        <Table.DataCell>
            <CellContent flexEnd>
                {!erHelgDagtype(dagtype) && (
                    <HStack gap="space-8" align="center" wrap={false}>
                        {visningstekst(graderteAndreYtelserDag)}
                        {endringer.length > 0 && (
                            <EndringsloggKildeButton
                                renderEndringslogg={(onOpenChange) => (
                                    <EndringsloggGraderteAndreYtelser
                                        endringer={endringer}
                                        onOpenChange={onOpenChange}
                                    />
                                )}
                            />
                        )}
                    </HStack>
                )}
            </CellContent>
        </Table.DataCell>
    );
}

function visningstekst(graderteAndreYtelserDag?: ApiGraderteAndreYtelserDag): string {
    const grader = Object.values(graderteAndreYtelserDag?.andreYtelserGrader ?? {});
    if (grader.length === 0) return '-';
    return `${grader.reduce((sum, grad) => sum + grad, 0)} %`;
}
