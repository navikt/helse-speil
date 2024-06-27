import classNames from 'classnames';
import React, { ReactElement, useMemo } from 'react';

import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { Row } from '@saksbilde/table/Row';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { getFormattedDateString } from '@utils/date';

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
}: UtbetalingstabellProps): ReactElement => {
    const formattedFom = getFormattedDateString(fom);
    const formattedTom = getFormattedDateString(tom);

    const dagerList: Array<Utbetalingstabelldag> = useMemo(() => Array.from(dager.values()), [dager]);

    const alderVedSkjæringstidspunkt = useAlderVedSkjæringstidspunkt();

    return (
        <section className={classNames(styles.container, overstyrer && styles.overstyrer)}>
            <div className={styles.tableContainer}>
                <table
                    className={styles.table}
                    aria-label={`Utbetalinger for sykmeldingsperiode fra ${formattedFom} til ${formattedTom}`}
                >
                    <thead>
                        <tr>
                            <th className={styles.header} scope="col" colSpan={1}>
                                Dato
                            </th>
                            <th className={styles.header} scope="col" colSpan={1}>
                                Dagtype
                            </th>
                            <th className={styles.header} scope="col" colSpan={1}>
                                Grad
                            </th>
                            <th className={styles.header} scope="col" colSpan={1}>
                                Kilde
                            </th>
                            <th className={styles.header} scope="col" colSpan={1}>
                                Total grad
                            </th>
                            <th className={styles.header} scope="col" colSpan={1}>
                                <ArbeidsgiverikonMedTooltip className={styles.headerContent}>
                                    Refusjon
                                </ArbeidsgiverikonMedTooltip>
                            </th>
                            <th className={styles.header} scope="col" colSpan={1}>
                                <SykmeldtikonMedTooltip className={styles.headerContent}>
                                    Utbetaling
                                </SykmeldtikonMedTooltip>
                            </th>
                            <th className={styles.header} scope="col" colSpan={1}>
                                Dager igjen
                            </th>
                            <th className={styles.header} scope="col" colSpan={1}>
                                Merknader
                            </th>
                            {overstyrer && <th className={styles.header} scope="col" colSpan={1} />}
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
