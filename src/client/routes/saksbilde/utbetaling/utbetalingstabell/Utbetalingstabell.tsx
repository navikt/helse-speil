import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Dagtype, Overstyring, Sykdomsdag } from 'internal-types';
import React, { useState } from 'react';

import { Tidslinjeperiode } from '../../../../modell/utbetalingshistorikkelement';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { Header } from '../../table/Header';
import { Row } from '../../table/Row';
import { Table } from '../../table/Table';
import { DagEndrer } from './DagEndrer';
import { DateCell } from './DateCell';
import { GjenståendeDagerCell } from './GjenståendeDagerCell';
import { GradCell } from './GradCell';
import { KildeCell } from './KildeCell';
import { MerknaderCell } from './MerknaderCell';
import { TotalGradCell } from './TotalGradCell';
import { TotalRow } from './TotalRow';
import { UtbetalingCell } from './UtbetalingCell';
import { UtbetalingsdagCell } from './UtbetalingsdagCell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';
import { getMatchingSykdomsdag, withDagerIgjen } from './Utbetalingstabell.utils';
import { VelgRadCell } from './VelgRadCell';

const Container = styled.section`
    display: flex;
`;

const TabellContainer = styled.div`
    flex: 1;
    width: 400px;
    margin: 2rem 2rem 2rem 0;
    height: 100%;
    overflow-x: scroll;
    > table {
        overflow-y: hidden;
    }
    * {
        box-sizing: border-box;
    }
`;

const getOverstyringMatchingDate = (date: Dayjs, overstyringer: Overstyring[]): Overstyring | undefined =>
    overstyringer.find(({ overstyrteDager }) => overstyrteDager.find((it) => it.dato.isSame(date)));

interface UtbetalingstabellProps {
    periode: Tidslinjeperiode;
    overstyringer: Overstyring[];
    gjenståendeDager?: number;
    maksdato?: Dayjs;
}

export const Utbetalingstabell = ({ periode, gjenståendeDager, maksdato, overstyringer }: UtbetalingstabellProps) => {
    const fom = periode.fom.format(NORSK_DATOFORMAT);
    const tom = periode.tom.format(NORSK_DATOFORMAT);

    const [markerteDager, setMarkerteDager] = useState<UtbetalingstabellDag[]>([]);

    const antallDagerIgjen = maksdato
        ? periode.utbetalingstidslinje.filter((it) => it.type === Dagtype.Syk && it.dato.isSameOrBefore(maksdato))
              .length + (gjenståendeDager ?? 0)
        : gjenståendeDager ?? 0;

    const utbetalingsdager = gjenståendeDager
        ? withDagerIgjen(periode.utbetalingstidslinje, antallDagerIgjen)
        : periode.utbetalingstidslinje;

    const rader: [UtbetalingstabellDag, Sykdomsdag, Overstyring | undefined][] = utbetalingsdager.map((it) => [
        it,
        getMatchingSykdomsdag(it, periode.sykdomstidslinje),
        getOverstyringMatchingDate(it.dato, overstyringer),
    ]);

    return (
        <>
            <DagEndrer />
            <Container>
                <TabellContainer>
                    <Table aria-label={`Utbetalinger for sykmeldingsperiode fra ${fom} til ${tom}`}>
                        <thead>
                            <tr>
                                <th />
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
                                    Kilde
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
                                utbetalingstidslinje={periode.utbetalingstidslinje}
                                maksdato={maksdato}
                                gjenståendeDager={gjenståendeDager}
                            />
                            {rader.map(([utbetalingsdag, sykdomsdag, maybeOverstyring], i) => (
                                <Row type={utbetalingsdag.type} key={i}>
                                    <VelgRadCell
                                        index={i}
                                        onChange={(checked: boolean) =>
                                            checked
                                                ? setMarkerteDager((prevState) => [...prevState, utbetalingsdag])
                                                : setMarkerteDager((prevState) =>
                                                      prevState.filter((dag) => !dag.dato.isSame(utbetalingsdag.dato))
                                                  )
                                        }
                                    />
                                    <DateCell date={utbetalingsdag.dato} />
                                    <UtbetalingsdagCell
                                        typeUtbetalingsdag={utbetalingsdag.type}
                                        typeSykdomsdag={sykdomsdag.type}
                                    />
                                    <GradCell type={utbetalingsdag.type} grad={utbetalingsdag.gradering} />
                                    <KildeCell
                                        type={sykdomsdag.type}
                                        kilde={sykdomsdag.kilde}
                                        overstyring={maybeOverstyring}
                                    />
                                    <TotalGradCell
                                        type={utbetalingsdag.type}
                                        totalGradering={utbetalingsdag.totalGradering}
                                    />
                                    <UtbetalingCell utbetaling={utbetalingsdag.utbetaling} />
                                    <GjenståendeDagerCell gjenståendeDager={utbetalingsdag.dagerIgjen} />
                                    <MerknaderCell
                                        style={{ width: '100%' }}
                                        dag={utbetalingsdag}
                                        isMaksdato={
                                            maksdato !== undefined && utbetalingsdag.dato.isSame(maksdato, 'day')
                                        }
                                    />
                                </Row>
                            ))}
                        </tbody>
                    </Table>
                </TabellContainer>
            </Container>
        </>
    );
};
