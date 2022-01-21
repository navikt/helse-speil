import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';

import { Bag, People } from '@navikt/ds-icons';

import { Flex } from '../../../../components/Flex';
import { Tooltip } from '../../../../components/Tooltip';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { Header } from '../../table/Header';
import { Row } from '../../table/Row';
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

const Container = styled.section<{ overstyrer: boolean }>`
    display: flex;
    overflow-x: auto;
    padding-left: ${(props) => (props.overstyrer ? '3rem' : '2rem')};
`;

export const Table = styled.table`
    flex: 1;
    white-space: nowrap;
`;

const TabellContainer = styled.div`
    display: flex;
    flex: 1;
    width: 400px;
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
    markerteDager?: Map<string, UtbetalingstabellDag>;
    overstyrer?: boolean;
}

export const Utbetalingstabell = ({
    fom,
    tom,
    dager,
    lokaleOverstyringer,
    markerteDager,
    overstyrer = false,
}: UtbetalingstabellProps) => {
    const label = `Utbetalinger for sykmeldingsperiode fra ${fom.format(NORSK_DATOFORMAT)} til ${tom.format(
        NORSK_DATOFORMAT
    )}`;

    const dagerList: [string, UtbetalingstabellDag][] = useMemo(() => Array.from(dager.entries()), [dager]);

    return (
        <Container overstyrer={overstyrer}>
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
                                <Flex data-tip="Arbeidsgiver" alignItems="center">
                                    <Bag style={{ marginRight: '0.5rem' }} /> Utbetaling
                                </Flex>
                            </Header>
                            <Header scope="col" colSpan={1}>
                                <Flex data-tip="Sykmeldt" alignItems="center">
                                    <People style={{ marginRight: '0.5rem' }} /> Utbetaling
                                </Flex>
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
                        {dagerList.length > 0 && <TotalRow dager={dagerList} overstyrer={overstyrer} />}
                        {dagerList.map(([key, dag], i) => (
                            <Row type={dag.type} key={i} markertDag={markerteDager?.get(key)}>
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
                                    utbetaling={dag.arbeidsgiverbeløp}
                                    erOverstyrt={!!lokaleOverstyringer?.get(key)}
                                />
                                <UtbetalingCell
                                    utbetaling={dag.personbeløp}
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
            <Tooltip id="utbetalingstabell" />
        </Container>
    );
};
