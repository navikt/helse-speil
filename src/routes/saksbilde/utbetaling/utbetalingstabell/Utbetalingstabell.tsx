import { useParams } from 'next/navigation';
import { ReactElement, useMemo } from 'react';

import { HStack, Table } from '@navikt/ds-react';

import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Sykmeldtikon } from '@components/ikoner/Sykmeldtikon';
import { ApiGraderteAndreYtelser } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { useGetPerson } from '@io/rest/generated/personer/personer';
import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { Row } from '@saksbilde/table/Row';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { getFormattedDateString } from '@utils/date';
import { useSkalSeGraderteAndreYtelser } from '@utils/featureToggles';
import { cn } from '@utils/tw';

import { AndreYtelserCell } from './AndreYtelserCell';
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
import { endringerForDato } from './graderteAndreYtelserEndringer';
import { useAlderVedSkjæringstidspunkt } from './useAlderVedSkjæringstidspunkt';

import styles from './Utbetalingstabell.module.css';

interface UtbetalingstabellProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, Utbetalingstabelldag>;
    lokaleOverstyringer?: Map<string, Utbetalingstabelldag>;
    markerteDager?: Map<string, Utbetalingstabelldag>;
    overstyrer?: boolean;
    harRadmarkering?: boolean;
    slettSisteNyeDag?: () => void;
    person: ApiSaksbildePerson;
    erSelvstendigNæring: boolean;
    graderteAndreYtelser?: ApiGraderteAndreYtelser;
}

export const Utbetalingstabell = ({
    fom,
    tom,
    dager,
    lokaleOverstyringer,
    markerteDager,
    overstyrer = false,
    harRadmarkering = false,
    slettSisteNyeDag,
    person,
    erSelvstendigNæring,
    graderteAndreYtelser,
}: UtbetalingstabellProps): ReactElement => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: apiPerson } = useGetPerson(personPseudoId);
    const visAndreYtelser = useSkalSeGraderteAndreYtelser();
    const graderteAndreYtelserPerDato = new Map(graderteAndreYtelser?.dager.map((dag) => [dag.dato, dag]));

    const formattedFom = getFormattedDateString(fom);
    const formattedTom = getFormattedDateString(tom);

    const dagerList: Utbetalingstabelldag[] = useMemo(() => Array.from(dager.values()), [dager]);

    const alderVedSkjæringstidspunkt = useAlderVedSkjæringstidspunkt(person, apiPerson?.fødselsdato);

    return (
        <section className={cn(styles.container, harRadmarkering && styles.radmarkering)}>
            <div className={styles.tableContainer}>
                <Table aria-label={`Utbetalinger for sykmeldingsperiode fra ${formattedFom} til ${formattedTom}`}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader className={styles.header} scope="col" colSpan={1}>
                                Dato
                            </Table.ColumnHeader>
                            <Table.ColumnHeader className={styles.header} scope="col" colSpan={1}>
                                Dagtype
                            </Table.ColumnHeader>
                            <Table.ColumnHeader className={styles.header} scope="col" colSpan={1}>
                                Grad
                            </Table.ColumnHeader>
                            {visAndreYtelser && (
                                <Table.ColumnHeader className={styles.header} scope="col" colSpan={1}>
                                    Andre ytelser
                                </Table.ColumnHeader>
                            )}
                            <Table.ColumnHeader className={styles.header} scope="col" colSpan={1}>
                                Kilde
                            </Table.ColumnHeader>
                            <Table.ColumnHeader className={styles.header} scope="col" colSpan={1}>
                                Total grad
                            </Table.ColumnHeader>
                            {!erSelvstendigNæring && (
                                <Table.ColumnHeader className={styles.header} scope="col" colSpan={1}>
                                    <HStack align="center" gap="space-8" wrap={false}>
                                        <Arbeidsgiverikon />
                                        Refusjon
                                    </HStack>
                                </Table.ColumnHeader>
                            )}
                            <Table.ColumnHeader className={styles.header} scope="col" colSpan={1}>
                                <HStack align="center" gap="space-8" wrap={false}>
                                    <Sykmeldtikon />
                                    Utbetaling
                                </HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader className={styles.header} scope="col" colSpan={1}>
                                Dager igjen
                            </Table.ColumnHeader>
                            <Table.ColumnHeader className={styles.header} scope="col" colSpan={1}>
                                Merknader
                            </Table.ColumnHeader>
                            {overstyrer && <Table.HeaderCell className={styles.header} scope="col" colSpan={1} />}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {dagerList.length > 0 && (
                            <TotalRow
                                dager={dagerList}
                                overstyrer={overstyrer}
                                erSelvstendigNæring={erSelvstendigNæring}
                                visAndreYtelser={visAndreYtelser}
                            />
                        )}
                        {dagerList.map((tabelldag, i) => {
                            const overstyrtDag = lokaleOverstyringer?.get(tabelldag.dato);
                            const endretFordeling = overstyrtDag?.gradertAnnenYtelse;
                            // Ved gradert annen ytelse er det bare total grad og beløp som kan endres, og bare når sykdomsgraden endres
                            const utbetalingErEndret = endretFordeling
                                ? endretFordeling.sykdomsgrad !== tabelldag.totalGradering
                                : !!overstyrtDag;
                            return (
                                <Row
                                    key={i}
                                    dag={tabelldag}
                                    erMarkert={markerteDager?.get(tabelldag.dato) !== undefined}
                                    erOverstyrt={overstyrtDag !== undefined}
                                    overstyrer={overstyrer}
                                >
                                    <DateCell date={tabelldag.dato} />
                                    <DagtypeCell tabelldag={tabelldag} overstyrtDag={overstyrtDag} />
                                    <GradCell tabelldag={tabelldag} overstyrtDag={overstyrtDag} />
                                    {visAndreYtelser && (
                                        <AndreYtelserCell
                                            dagtype={tabelldag.dag.speilDagtype}
                                            graderteAndreYtelserDag={graderteAndreYtelserPerDato.get(tabelldag.dato)}
                                            endringer={endringerForDato(graderteAndreYtelser, tabelldag.dato)}
                                            endretFordeling={endretFordeling}
                                        />
                                    )}
                                    <KildeCell
                                        type={tabelldag.dag.speilDagtype}
                                        kilde={tabelldag.kilde.type}
                                        overstyringer={tabelldag.overstyringer}
                                    />
                                    <TotalGradCell
                                        type={tabelldag.dag.speilDagtype}
                                        totalGradering={
                                            endretFordeling ? endretFordeling.sykdomsgrad : tabelldag.totalGradering
                                        }
                                        erOverstyrt={utbetalingErEndret}
                                        erNyDag={tabelldag.erNyDag}
                                    />
                                    {!erSelvstendigNæring && (
                                        <UtbetalingCell
                                            utbetaling={tabelldag.arbeidsgiverbeløp}
                                            erOverstyrt={utbetalingErEndret}
                                            erNyDag={tabelldag.erNyDag}
                                        />
                                    )}
                                    <UtbetalingCell
                                        utbetaling={tabelldag.personbeløp}
                                        erOverstyrt={utbetalingErEndret}
                                        erNyDag={tabelldag.erNyDag}
                                    />
                                    <GjenståendeDagerCell
                                        gjenståendeDager={tabelldag.dagerIgjen}
                                        erOverstyrt={!endretFordeling && !!overstyrtDag}
                                        erNyDag={tabelldag.erNyDag}
                                    />
                                    <MerknaderCell
                                        style={{ width: '100%' }}
                                        dag={tabelldag}
                                        alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt}
                                        graderteAndreYtelserDag={
                                            visAndreYtelser
                                                ? graderteAndreYtelserPerDato.get(tabelldag.dato)
                                                : undefined
                                        }
                                        endretYtelsetype={
                                            endretFordeling ? overstyrtDag?.dag.gradertAnnenYtelsetype : undefined
                                        }
                                    />
                                    {overstyrer && (
                                        <SlettNyDagCell
                                            slettSisteNyeDag={slettSisteNyeDag}
                                            nyDag={
                                                tabelldag.kilde.type === 'SAKSBEHANDLER' &&
                                                tabelldag.kilde.id == undefined
                                            }
                                            visSlettKnapp={i === 0}
                                        />
                                    )}
                                </Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </div>
        </section>
    );
};
