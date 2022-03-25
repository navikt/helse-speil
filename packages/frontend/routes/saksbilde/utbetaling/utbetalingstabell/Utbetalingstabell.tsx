import React, { useMemo } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { Bag, People } from '@navikt/ds-icons';

import { Flex } from '@components/Flex';
import { Tooltip } from '@components/Tooltip';
import { getFormattedDateString } from '@utils/date';
import { isBeregnetPeriode } from '@utils/typeguards';
import { useCurrentPerson } from '@state/personState';
import { useActivePeriod } from '@state/periodState';

import { Row } from '../../table/Row';
import { Header } from '../../table/Header';
import { DateCell } from './DateCell';
import { GradCell } from './GradCell';
import { TotalRow } from './TotalRow';
import { KildeCell } from './KildeCell';
import { DagtypeCell } from './DagtypeCell';
import { MerknaderCell } from './MerknaderCell';
import { TotalGradCell } from './TotalGradCell';
import { UtbetalingCell } from './UtbetalingCell';
import { GjenståendeDagerCell } from './GjenståendeDagerCell';

import styles from './Utbetalingstabell.module.css';

const useAlderVedSkjæringstidspunkt = (): number | null => {
    const birthDate = useCurrentPerson()?.personinfo.fodselsdato;
    const period = useActivePeriod();

    if (typeof birthDate === 'string' && isBeregnetPeriode(period)) {
        return dayjs(period.skjaeringstidspunkt).diff(birthDate, 'year');
    } else {
        return null;
    }
};

interface UtbetalingstabellProps {
    fom: DateString;
    tom: DateString;
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
    const formattedFom = getFormattedDateString(fom);
    const formattedTom = getFormattedDateString(tom);

    const dagerList: [string, UtbetalingstabellDag][] = useMemo(() => Array.from(dager.entries()), [dager]);

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
                            <Row
                                erAvvist={dag.erAvvist}
                                erAGP={dag.erAGP}
                                type={dag.type}
                                key={i}
                                markertDag={markerteDager?.get(key)}
                            >
                                <DateCell date={dag.dato} />
                                <DagtypeCell dag={dag} overstyrtDag={lokaleOverstyringer?.get(key)} />
                                <GradCell dag={dag} overstyrtDag={lokaleOverstyringer?.get(key)} />
                                <KildeCell
                                    dato={dag.dato}
                                    type={dag.type}
                                    kilde={dag.kilde.type}
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
            <Tooltip id="utbetalingstabell" />
        </section>
    );
};
