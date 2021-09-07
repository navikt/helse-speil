import styled from '@emotion/styled';
import { Dagtype, Utbetalingsdag } from 'internal-types';
import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { Row } from '../../table/Row';
import { UtbetalingCell } from './UtbetalingCell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const Container = styled(Row)`
    > td {
        background-color: var(--navds-layout-background-gray);
        border-bottom-color: #b7b1a9;
    }
`;

const TotalText = styled(Element)`
    white-space: nowrap;
`;

interface TotalRowProps {
    dager: [string, Utbetalingsdag][];
    dagerIgjen: number;
}

export const TotalRow = React.memo(({ dager, dagerIgjen }: TotalRowProps) => {
    const utbetalingsdager = dager
        .filter(([_, { utbetaling }]) => utbetaling && utbetaling > 0)
        .filter(([_, { type }]) => type !== Dagtype.Avvist) as [string, Required<UtbetalingstabellDag>][];

    const totalUtbetaling = utbetalingsdager.reduce((total, [_, { utbetaling }]) => total + utbetaling, 0);

    return (
        <Container>
            <td>TOTAL</td>
            <td>
                <TotalText>{utbetalingsdager.length} dager</TotalText>
            </td>
            <td />
            <td />
            <td />
            <UtbetalingCell style={{ fontWeight: 'bold' }} utbetaling={totalUtbetaling} />
            <td>
                <TotalText>{dagerIgjen}</TotalText>
            </td>
            <td />
        </Container>
    );
});
