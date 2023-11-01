import classNames from 'classnames';
import React, { useMemo } from 'react';

import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { getFormattedDateString } from '@utils/date';

import { Header } from '../../table/Header';
import { Row } from '../../table/Row';
import { DagtypeCell } from './DagtypeCell';
import { DateCell } from './DateCell';
import { GjenståendeDagerCell } from './GjenståendeDagerCell';
import { GradCell } from './GradCell';
import { KildeCell } from './KildeCell';
import { MerknaderCell } from './MerknaderCell';
import { SlettNyDagCell } from './SlettNyDagCell';
import { TotalGradCell } from './TotalGradCell';
import { TotalRow } from './TotalRow';
import { UtbetalingCell } from './UtbetalingCell';
import { useAlderVedSkjæringstidspunkt } from './useAlderVedSkjæringstidspunkt';

import styles from './Utbetalingstabell.module.css';

interface UtbetalingstabellProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, Utbetalingstabelldag>;
    lokaleOverstyringer?: Map<string, Utbetalingstabelldag>;
    markerteDager?: Map<string, Utbetalingstabelldag>;
    overstyrer?: boolean;
    slettSisteNyeDag?: () => void;
}

export const Utbetalingstabell = ({
    fom,
    tom,
    dager,
    lokaleOverstyringer,
    markerteDager,
    overstyrer = false,
    slettSisteNyeDag,
}: UtbetalingstabellProps) => {
    const formattedFom = getFormattedDateString(fom);
    const formattedTom = getFormattedDateString(tom);

    const dagerList: Array<Utbetalingstabelldag> = useMemo(() => Array.from(dager.values()), [dager]);

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
                                Dagtype
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
                                <ArbeidsgiverikonMedTooltip className={styles.HeaderContent}>
                                    Refusjon
                                </ArbeidsgiverikonMedTooltip>
                            </Header>
                            <Header scope="col" colSpan={1}>
                                <SykmeldtikonMedTooltip className={styles.HeaderContent}>
                                    Utbetaling
                                </SykmeldtikonMedTooltip>
                            </Header>
                            <Header scope="col" colSpan={1}>
                                Dager igjen
                            </Header>
                            <Header scope="col" colSpan={1}>
                                Merknader
                            </Header>
                            {overstyrer && <Header scope="col" colSpan={1} />}
                        </tr>
                    </thead>
                    <tbody>
                        {dagerList.length > 0 && <TotalRow dager={dagerList} overstyrer={overstyrer} />}
                        {dagerList.map((tabelldag, i) => (
                            <Row
                                erAvvist={
                                    lokaleOverstyringer?.get(tabelldag.dato)
                                        ? false
                                        : tabelldag.erAvvist || tabelldag.erForeldet
                                }
                                erAGP={tabelldag.erAGP}
                                type={tabelldag.dag.speilDagtype}
                                key={i}
                                markertDag={markerteDager?.get(tabelldag.dato)}
                                nyDag={tabelldag.erNyDag ?? false}
                                erHelg={tabelldag?.erHelg ?? false}
                            >
                                <DateCell date={tabelldag.dato} />
                                <DagtypeCell
                                    tabelldag={tabelldag}
                                    overstyrtDag={lokaleOverstyringer?.get(tabelldag.dato)}
                                />
                                <GradCell
                                    tabelldag={tabelldag}
                                    overstyrtDag={lokaleOverstyringer?.get(tabelldag.dato)}
                                />
                                <KildeCell
                                    type={tabelldag.dag.speilDagtype}
                                    kilde={tabelldag.kilde.type}
                                    overstyringer={tabelldag.overstyringer}
                                />
                                <TotalGradCell
                                    type={tabelldag.dag.speilDagtype}
                                    totalGradering={tabelldag.totalGradering}
                                    erOverstyrt={!!lokaleOverstyringer?.get(tabelldag.dato)}
                                    erNyDag={tabelldag.erNyDag}
                                />
                                <UtbetalingCell
                                    utbetaling={tabelldag.arbeidsgiverbeløp}
                                    erOverstyrt={!!lokaleOverstyringer?.get(tabelldag.dato)}
                                    erNyDag={tabelldag.erNyDag}
                                />
                                <UtbetalingCell
                                    utbetaling={tabelldag.personbeløp}
                                    erOverstyrt={!!lokaleOverstyringer?.get(tabelldag.dato)}
                                    erNyDag={tabelldag.erNyDag}
                                />
                                <GjenståendeDagerCell
                                    gjenståendeDager={tabelldag.dagerIgjen}
                                    erOverstyrt={!!lokaleOverstyringer?.get(tabelldag.dato)}
                                    erNyDag={tabelldag.erNyDag}
                                />
                                <MerknaderCell
                                    style={{ width: '100%' }}
                                    dag={tabelldag}
                                    alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt}
                                />
                                {overstyrer && (
                                    <SlettNyDagCell
                                        slettSisteNyeDag={slettSisteNyeDag}
                                        nyDag={
                                            tabelldag.kilde.type === 'SAKSBEHANDLER' && tabelldag.kilde.id == undefined
                                        }
                                        visSlettKnapp={i === 0}
                                    />
                                )}
                            </Row>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
