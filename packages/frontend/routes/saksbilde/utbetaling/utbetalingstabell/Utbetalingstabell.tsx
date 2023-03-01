import { GjenståendeDagerCell } from './GjenståendeDagerCell';
import { useAlderVedSkjæringstidspunkt } from './useAlderVedSkjæringstidspunkt';
import classNames from 'classnames';
import React, { useMemo } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Sykmeldtikon } from '@components/ikoner/Sykmeldtikon';
import { getFormattedDateString } from '@utils/date';

import { Header } from '../../table/Header';
import { Row } from '../../table/Row';
import { DagtypeCell } from './DagtypeCell';
import { DateCell } from './DateCell';
import { GradCell } from './GradCell';
import { KildeCell } from './KildeCell';
import { MerknaderCell } from './MerknaderCell';
import { TotalGradCell } from './TotalGradCell';
import { TotalRow } from './TotalRow';
import { UtbetalingCell } from './UtbetalingCell';

import styles from './Utbetalingstabell.module.css';

interface UtbetalingstabellProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, UtbetalingstabellDag>;
    lokaleOverstyringer?: Map<string, UtbetalingstabellDag>;
    markerteDager?: Map<string, UtbetalingstabellDag>;
    overstyrer?: boolean;
}

export const helgetyper = ['SykHelg', 'FriskHelg', 'Feriehelg', 'Helg'];
export const erEksplisittHelg = (dagtype: Utbetalingstabelldagtype) => [...helgetyper].includes(dagtype);

export const Utbetalingstabell = ({
    fom,
    tom,
    dager,
    lokaleOverstyringer,
    markerteDager,
    overstyrer = false,
}: UtbetalingstabellProps) => {
    const formattedFom = getFormattedDateString(fom);
    const formattedTom = getFormattedDateString(tom);

    const dagerList: Array<UtbetalingstabellDag> = useMemo(() => Array.from(dager.values()), [dager]);

    const alderVedSkjæringstidspunkt = useAlderVedSkjæringstidspunkt();

    return (
        <section className={classNames(styles.Container, overstyrer && styles.overstyrer)}>
            <div className={styles.TableContainer}>
                <table
                    className={styles.Table}
                    aria-label={`Utbetalinger for sykmeldingsperiode fra ${formattedFom} til ${formattedTom}`}
                >
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
                            <Header scope="col" colSpan={1} className={styles.TableHeader}>
                                <Tooltip content="Arbeidsgiver">
                                    <div className={styles.HeaderContent}>
                                        <Arbeidsgiverikon alt="Arbeidsgiver" /> Utbetaling
                                    </div>
                                </Tooltip>
                            </Header>
                            <Header scope="col" colSpan={1}>
                                <Tooltip content="Sykmeldt">
                                    <Flex className={styles.HeaderContent}>
                                        <Sykmeldtikon alt="Sykmeldt" /> Utbetaling
                                    </Flex>
                                </Tooltip>
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
                        {dagerList.map((dag, i) => (
                            <Row
                                erAvvist={dag.erAvvist}
                                erAGP={dag.erAGP}
                                type={dag.type}
                                key={i}
                                markertDag={markerteDager?.get(dag.dato)}
                            >
                                <DateCell date={dag.dato} />
                                <DagtypeCell dag={dag} overstyrtDag={lokaleOverstyringer?.get(dag.dato)} />
                                <GradCell dag={dag} overstyrtDag={lokaleOverstyringer?.get(dag.dato)} />
                                <KildeCell
                                    dato={dag.dato}
                                    type={dag.type}
                                    kilde={dag.kilde.type}
                                    overstyringer={dag.overstyringer}
                                />
                                <TotalGradCell
                                    type={dag.type}
                                    totalGradering={dag.totalGradering}
                                    erOverstyrt={!!lokaleOverstyringer?.get(dag.dato)}
                                />
                                <UtbetalingCell
                                    utbetaling={dag.arbeidsgiverbeløp}
                                    erOverstyrt={!!lokaleOverstyringer?.get(dag.dato)}
                                />
                                <UtbetalingCell
                                    utbetaling={dag.personbeløp}
                                    erOverstyrt={!!lokaleOverstyringer?.get(dag.dato)}
                                />
                                <GjenståendeDagerCell
                                    gjenståendeDager={dag.dagerIgjen}
                                    erOverstyrt={!!lokaleOverstyringer?.get(dag.dato)}
                                />
                                <MerknaderCell
                                    style={{ width: '100%' }}
                                    dag={dag}
                                    alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt}
                                />
                            </Row>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
