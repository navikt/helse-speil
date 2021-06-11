import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Dagtype, Periode, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import React from 'react';

import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { Header } from '../../table/Header';
import { Table } from '../../table/Table';
import { TotalRow } from './TotalRow';
import { UtbetalingsoversiktRow } from './UtbetalingsoversiktRow';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';
import { getMatchingSykdomsdag, withDagerIgjen } from './Utbetalingstabell.utils';

const Container = styled.section`
    flex: 1;
    padding: 2rem 0;
    overflow-x: scroll;
    margin: 0;
    height: 100%;
    width: 400px;
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
                        <Header scope="col" colSpan={1}>
                            Dato
                        </Header>
                        <Header scope="col" colSpan={1}>
                            Utbet. dager
                        </Header>
                        <Header scope="col" colSpan={1}>
                            Grad
                        </Header>
                        <Header scope="col" colSpan={1}>
                            Total grad
                        </Header>
                        <Header scope="col" colSpan={1}>
                            Utbetaling
                        </Header>
                        <Header scope="col" colSpan={1}>
                            Dager igjen
                        </Header>
                        <Header scope="col" colSpan={1}>
                            Merknader
                        </Header>
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
