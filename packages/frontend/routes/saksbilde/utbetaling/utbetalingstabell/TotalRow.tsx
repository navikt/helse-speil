import styled from '@emotion/styled';
import React from 'react';

import { Bold } from '@components/Bold';

import { Row } from '../../table/Row';
import { UtbetalingCell } from './UtbetalingCell';

const Container = styled(Row)<{ overstyrer?: boolean }>`
    > td {
        border-color: ${(props) => (props.overstyrer ? 'transparent' : '#3e3832')};
    }
`;

const TotalText = styled(Bold)`
    white-space: nowrap;
`;

const harPersonutbetaling = (dag: UtbetalingstabellDag): boolean =>
    typeof dag.personbeløp === 'number' && dag.personbeløp > 0;

const harArbeidsgiverutbetaling = (dag: UtbetalingstabellDag): boolean =>
    typeof dag.arbeidsgiverbeløp === 'number' && dag.arbeidsgiverbeløp > 0;

const getDagerMedUtbetaling = (dager: Array<UtbetalingstabellDag>): Array<UtbetalingstabellDag> =>
    dager
        .filter((dag) => harPersonutbetaling(dag) || harArbeidsgiverutbetaling(dag))
        .filter((dag) => dag.type !== 'Avslått');

const getTotalPersonbeløp = (dager: Array<UtbetalingstabellDag>): number =>
    dager.reduce((total, dag) => total + (dag.personbeløp ?? 0), 0);

const getTotalArbeidsgiverbeløp = (dager: Array<UtbetalingstabellDag>): number =>
    dager.reduce((total, dag) => total + (dag.arbeidsgiverbeløp ?? 0), 0);

interface TotalRowProps {
    dager: Array<UtbetalingstabellDag>;
    overstyrer?: boolean;
}

export const TotalRow = React.memo(({ dager, overstyrer }: TotalRowProps) => {
    const utbetalingsdager = getDagerMedUtbetaling(dager);
    const arbeidsgiverbeløpTotal = getTotalArbeidsgiverbeløp(utbetalingsdager);
    const personbeløpTotal = getTotalPersonbeløp(utbetalingsdager);

    const dagerIgjenPåSluttenAvPerioden = dager[dager.length - 1]?.dagerIgjen ?? 0;

    const dagerIgjenPåStartenAvPerioden = (dagerIgjenPåSluttenAvPerioden ?? 0) + utbetalingsdager.length;

    return (
        <Container overstyrer={overstyrer}>
            <td style={{ fontWeight: 'bold' }}>TOTAL</td>
            <td>
                <TotalText>{utbetalingsdager.length} dager</TotalText>
            </td>
            <td />
            <td />
            <td />
            <UtbetalingCell style={{ fontWeight: 'bold' }} utbetaling={arbeidsgiverbeløpTotal} />
            <UtbetalingCell style={{ fontWeight: 'bold' }} utbetaling={personbeløpTotal} />
            <td>
                <TotalText>{dagerIgjenPåStartenAvPerioden}</TotalText>
            </td>
            <td />
        </Container>
    );
});
