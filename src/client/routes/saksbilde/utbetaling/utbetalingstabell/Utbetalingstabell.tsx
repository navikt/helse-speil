import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';

import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { Header } from '../../table/Header';
import { Row } from '../../table/Row';
import { Table } from '../../table/Table';
import { DagtypeCell } from './DagtypeCell';
import { DateCell } from './DateCell';
import { GjenståendeDagerCell } from './GjenståendeDagerCell';
import { GradCell } from './GradCell';
import { KildeCell } from './KildeCell';
import { MerknaderCell } from './MerknaderCell';
import { TotalGradCell } from './TotalGradCell';
import { TotalRow } from './TotalRow';
import { UtbetalingCell } from './UtbetalingCell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const Container = styled.section`
    display: flex;
    overflow-x: scroll;
`;

const TabellContainer = styled.div`
    flex: 1;
    width: 400px;
    margin: 2rem;
    height: max-content;

    > table {
        overflow-y: hidden;
    }

    * {
        box-sizing: border-box;
    }
`;

interface UtbetalingstabellProps {
    fom: Dayjs;
    tom: Dayjs;
    dager: Map<string, UtbetalingstabellDag>;
    lokaleOverstyringer?: Map<string, UtbetalingstabellDag>;
}

export const Utbetalingstabell = ({ fom, tom, dager, lokaleOverstyringer }: UtbetalingstabellProps) => {
    const label = `Utbetalinger for sykmeldingsperiode fra ${fom.format(NORSK_DATOFORMAT)} til ${tom.format(
        NORSK_DATOFORMAT
    )}`;

    const dagerList: [string, UtbetalingstabellDag][] = useMemo(() => Array.from(dager.entries()), [dager]);

    return (
        <Container>
            <TabellContainer>
                <Table aria-label={label}>
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
                        {dagerList.length > 0 && <TotalRow dager={dagerList} />}
                        {dagerList.map(([key, dag], i) => (
                            <Row type={dag.type} key={i}>
                                <DateCell date={dag.dato} />
                                <DagtypeCell
                                    typeUtbetalingsdag={dag.type}
                                    typeSykdomsdag={dag.sykdomsdag.type}
                                    overstyrtDag={lokaleOverstyringer?.get(key)}
                                />
                                <GradCell
                                    type={dag.type}
                                    grad={dag.gradering}
                                    overstyrtDag={lokaleOverstyringer?.get(key)}
                                />
                                <KildeCell
                                    type={dag.sykdomsdag.type}
                                    kilde={dag.sykdomsdag.kilde}
                                    overstyringer={dag.overstyringer}
                                />
                                <TotalGradCell
                                    type={dag.type}
                                    totalGradering={dag.totalGradering}
                                    erOverstyrt={!!lokaleOverstyringer?.get(key)}
                                />
                                <UtbetalingCell
                                    utbetaling={dag.utbetaling}
                                    erOverstyrt={!!lokaleOverstyringer?.get(key)}
                                />
                                <GjenståendeDagerCell
                                    gjenståendeDager={dag.dagerIgjen}
                                    erOverstyrt={!!lokaleOverstyringer?.get(key)}
                                />
                                <MerknaderCell style={{ width: '100%' }} dag={dag} isMaksdato={dag.isMaksdato} />
                            </Row>
                        ))}
                    </tbody>
                </Table>
            </TabellContainer>
        </Container>
    );
};
