import { ReactElement } from 'react';

import { HStack, Table } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { EndringsloggGraderteAndreYtelser } from '@components/endringslogg/EndringsloggGraderteAndreYtelser';
import { EndringsloggKildeButton } from '@components/endringslogg/EndringsloggKildeButton';
import { ApiGraderteAndreYtelserDag } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { CellContent } from '@saksbilde/table/CellContent';
import { GradertAnnenYtelse, Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

import { GraderteAndreYtelserEndring } from './graderteAndreYtelserEndringer';
import { erHelgDagtype } from './helgUtils';

interface AndreYtelserCellProps {
    dagtype: Utbetalingstabelldagtype;
    graderteAndreYtelserDag?: ApiGraderteAndreYtelserDag;
    endringer?: GraderteAndreYtelserEndring[];
    endretFordeling?: GradertAnnenYtelse | null;
}

export function AndreYtelserCell({
    dagtype,
    graderteAndreYtelserDag,
    endringer = [],
    endretFordeling,
}: AndreYtelserCellProps): ReactElement {
    const lagretGrad = samletGrad(graderteAndreYtelserDag);
    const fordelingErEndret = !!endretFordeling && endretFordeling.andreYtelseGrad !== lagretGrad;

    return (
        <Table.DataCell>
            {fordelingErEndret && <Endringstrekant />}
            <CellContent flexEnd>
                {!erHelgDagtype(dagtype) && (
                    <HStack gap="space-8" align="center" wrap={false}>
                        {visningstekst(endretFordeling ? endretFordeling.andreYtelseGrad : lagretGrad)}
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

function samletGrad(graderteAndreYtelserDag?: ApiGraderteAndreYtelserDag): number | null {
    const grader = Object.values(graderteAndreYtelserDag?.andreYtelserGrader ?? {});
    if (grader.length === 0) return null;
    return grader.reduce((sum, grad) => sum + grad, 0);
}

function visningstekst(grad: number | null): string {
    return grad === null ? '-' : `${grad} %`;
}
