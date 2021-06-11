import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Dagtype, Utbetalingsdag } from 'internal-types';
import React from 'react';

import { Row } from '../../table/Row';
import { TotalText } from './TotalText';
import { UtbetalingCell } from './UtbetalingCell';

const Container = styled(Row)`
    background-color: var(--navds-layout-background-gray);

    > td {
        border-bottom-color: #b7b1a9;
    }
`;

interface TotalRowProps {
    utbetalingstidslinje: Utbetalingsdag[];
    maksdato?: Dayjs;
    gjenståendeDager?: number;
}

export const TotalRow = ({ utbetalingstidslinje, maksdato, gjenståendeDager = 0 }: TotalRowProps) => {
    const utbetalingsdager = utbetalingstidslinje
        .filter(({ utbetaling }) => utbetaling && utbetaling > 0)
        .filter(({ type }) => type !== Dagtype.Avvist) as Required<Utbetalingsdag>[];

    const totalUtbetaling = utbetalingsdager.reduce((total, { utbetaling }) => total + utbetaling, 0);

    const numberOfDaysLeft = maksdato
        ? gjenståendeDager +
          utbetalingstidslinje
              .filter(({ type }) => type === Dagtype.Syk)
              .filter(({ dato }) => dato.isSameOrBefore(maksdato)).length
        : 0;

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
                <TotalText>{numberOfDaysLeft}</TotalText>
            </td>
            <td />
        </Container>
    );
};
