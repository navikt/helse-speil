import { ReactElement } from 'react';

import { HStack, Table } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { EndringsloggGraderteAndreYtelser } from '@components/endringslogg/EndringsloggGraderteAndreYtelser';
import { EndringsloggKildeButton } from '@components/endringslogg/EndringsloggKildeButton';
import { ApiGraderteAndreYtelserDag } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { CellContent } from '@saksbilde/table/CellContent';
import { GradertAnnenYtelse, Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

import { GraderteAndreYtelserEndring } from './graderteAndreYtelserEndringer';
import { samletGrad } from './graderteAndreYtelserUtils';
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
    const lagretGrad = lagretSamletGrad(graderteAndreYtelserDag);
    const endretGrad = endretFordeling ? samletGrad(endretFordeling.andreYtelserGrader) : undefined;
    const fordelingErEndret = endretGrad !== undefined && endretGrad !== lagretGrad;

    return (
        <Table.DataCell>
            {fordelingErEndret && <Endringstrekant />}
            <CellContent flexEnd>
                {!erHelgDagtype(dagtype) && (
                    <HStack gap="space-8" align="center" wrap={false}>
                        {visningstekst(endretGrad ?? lagretGrad)}
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

function lagretSamletGrad(graderteAndreYtelserDag?: ApiGraderteAndreYtelserDag): number | null {
    const grader = graderteAndreYtelserDag?.andreYtelserGrader ?? {};
    return Object.keys(grader).length === 0 ? null : samletGrad(grader);
}

function visningstekst(grad: number | null): string {
    return grad === null ? '-' : `${grad} %`;
}
