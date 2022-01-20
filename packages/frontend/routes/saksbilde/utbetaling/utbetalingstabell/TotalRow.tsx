import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Row } from '../../table/Row';
import { UtbetalingCell } from './UtbetalingCell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const Container = styled(Row)<{ overstyrer?: boolean }>`
    > td {
        border-color: ${(props) => (props.overstyrer ? 'transparent' : '#3e3832')};
    }
`;

const TotalText = styled(BodyShort)`
    font-weight: 600;
    white-space: nowrap;
`;

interface TotalRowProps {
    dager: [string, UtbetalingstabellDag][];
    overstyrer?: boolean;
}

export const TotalRow = React.memo(({ dager, overstyrer }: TotalRowProps) => {
    const utbetalingsdager = dager
        .filter(
            ([_, { personbeløp, arbeidsgiverbeløp }]) =>
                (personbeløp && personbeløp > 0) || (arbeidsgiverbeløp && arbeidsgiverbeløp > 0)
        )
        .filter(([_, { type }]) => type !== 'Avslått') as [string, Required<UtbetalingstabellDag>][];

    const arbeidsgiverbeløpTotal = utbetalingsdager.reduce(
        (total, [_, { arbeidsgiverbeløp }]) => total + arbeidsgiverbeløp,
        0
    );
    const personbeløpTotal = utbetalingsdager.reduce((total, [_, { personbeløp }]) => total + personbeløp, 0);

    const dagerIgjenPåSluttenAvPerioden = dager[dager.length - 1][1].dagerIgjen;

    const dagerIgjenPåStartenAvPerioden = (dagerIgjenPåSluttenAvPerioden ?? 0) + utbetalingsdager.length;

    return (
        <Container overstyrer={overstyrer}>
            <td style={{ fontWeight: 'bold' }}>TOTAL</td>
            <td>
                <TotalText as="p">{utbetalingsdager.length} dager</TotalText>
            </td>
            <td />
            <td />
            <td />
            <UtbetalingCell style={{ fontWeight: 'bold' }} utbetaling={arbeidsgiverbeløpTotal} />
            <UtbetalingCell style={{ fontWeight: 'bold' }} utbetaling={personbeløpTotal} />
            <td>
                <TotalText as="p">{dagerIgjenPåStartenAvPerioden}</TotalText>
            </td>
            <td />
        </Container>
    );
});
