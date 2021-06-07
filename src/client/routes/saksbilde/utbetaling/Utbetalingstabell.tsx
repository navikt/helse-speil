import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Dagtype, Periode, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import React from 'react';

import { NORSK_DATOFORMAT } from '../../../utils/date';

import { UtbetalingstabellDag } from './Utbetalingstabell.types';
import { getMatchingSykdomsdag, withDagerIgjen } from './Utbetalingstabell.utils';
import { Header } from './table/Header';
import { Table } from './table/Table';
import { TotalRow } from './table/TotalRow';
import { UtbetalingsoversiktRow } from './table/UtbetalingsoversiktRow';

const Container = styled.section`
    flex: 1;
    padding: 2rem 0;
`;

interface UtbetalingstabellProps {
    periode: Periode;
    sykdomstidslinje: Sykdomsdag[];
    utbetalingstidslinje: Utbetalingsdag[];
    gjenståendeDager?: number;
    maksdato?: Dayjs;
}

export const Utbetalingstabell = ({
    periode,
    sykdomstidslinje,
    utbetalingstidslinje,
    gjenståendeDager,
    maksdato,
}: UtbetalingstabellProps) => {
    const fom = periode.fom.format(NORSK_DATOFORMAT);
    const tom = periode.tom.format(NORSK_DATOFORMAT);

    const antallDagerIgjen = maksdato
        ? utbetalingstidslinje.filter((it) => it.type === Dagtype.Syk && it.dato.isSameOrBefore(maksdato)).length +
          (gjenståendeDager ?? 0)
        : gjenståendeDager ?? 0;

    const utbetalingsdager = gjenståendeDager
        ? withDagerIgjen(utbetalingstidslinje, antallDagerIgjen)
        : utbetalingstidslinje;

    return (
        <Container>
            <Table aria-label={`Utbetalinger for sykmeldingsperiode fra ${fom} til ${tom}`}>
                <thead>
                    <tr>
                        <Header />
                        <Header>Dato</Header>
                        <Header>Utbet. dager</Header>
                        <Header>Grad</Header>
                        <Header>Total grad</Header>
                        <Header>Utbetaling</Header>
                        <Header>Dager igjen</Header>
                        <Header>Merknader</Header>
                    </tr>
                </thead>
                <tbody>
                    <TotalRow
                        utbetalingstidslinje={utbetalingstidslinje}
                        maksdato={maksdato}
                        gjenståendeDager={gjenståendeDager}
                    />
                    {utbetalingsdager
                        .map((it) => [it, getMatchingSykdomsdag(it, sykdomstidslinje)])
                        .map(([utbetalingsdag, sykdomsdag]: [UtbetalingstabellDag, Sykdomsdag], i) => (
                            <UtbetalingsoversiktRow
                                key={i}
                                utbetalingsdag={utbetalingsdag}
                                sykdomsdag={sykdomsdag}
                                isMaksdato={maksdato !== undefined && utbetalingsdag.dato.isSame(maksdato, 'day')}
                                gjenståendeDager={utbetalingsdag.dagerIgjen}
                            />
                        ))}
                </tbody>
            </Table>
        </Container>
    );
};
