import classNames from 'classnames';
import { ReactElement } from 'react';

import { SortState, Table, VStack } from '@navikt/ds-react';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { Pagination } from '@oversikt/table/Pagination';
import { FilterChips } from '@oversikt/table/oppgaverTable/FilterChips';
import { IngenMatchendeFiltre } from '@oversikt/table/oppgaverTable/IngenMatchendeFiltre';
import { TilGodkjenningOppgaveRow } from '@oversikt/table/oppgaverTable/tilGodkjenning/TilGodkjenningOppgaveRow';
import { TilGodkjenningTableHeader } from '@oversikt/table/oppgaverTable/tilGodkjenning/TilGodkjenningTableHeader';
import { useFilters, useSetMultipleFilters, useToggleFilter } from '@oversikt/table/state/filter';
import { SortKey, useSetSortering } from '@oversikt/table/state/sortation';
import { useTildelteOppgaverFeed } from '@state/tildelteOppgaver';

import { OppgaverTableError } from './OppgaverTableError';
import { OppgaverTableSkeleton } from './OppgaverTableSkeleton';

import styles from './table.module.css';

interface TildelteOppgaverTableProps {
    sort: SortState;
}

export const TildelteOppgaverTable = ({ sort }: TildelteOppgaverTableProps): ReactElement => {
    const { oppgaver, antallOppgaver, error, loading, fetchMore } = useTildelteOppgaverFeed();
    const setSortering = useSetSortering();
    const { activeFilters } = useFilters();
    const toggleFilter = useToggleFilter();
    const setMultipleFilters = useSetMultipleFilters();

    const harIkkeHentetOppgaverForGjeldendeQuery = oppgaver === undefined && loading;

    useLoadingToast({ isLoading: harIkkeHentetOppgaverForGjeldendeQuery, message: 'Henter oppgaver' });

    if (harIkkeHentetOppgaverForGjeldendeQuery) {
        return <OppgaverTableSkeleton />;
    }

    if (error) {
        return <OppgaverTableError />;
    }

    return (
        <VStack paddingBlock="4 0" className={classNames(styles.TableContainer, loading && styles.Loading)}>
            <FilterChips
                activeFilters={activeFilters}
                setMultipleFilters={setMultipleFilters}
                toggleFilter={toggleFilter}
            />

            <div className={styles.Content}>
                <div className={styles.Scrollable}>
                    <Table
                        sort={sort}
                        onSortChange={(sortKey: string | undefined) =>
                            sortKey && setSortering(sort, sortKey as SortKey)
                        }
                        className={styles.Table}
                        aria-label="Oppgaver som er klare for behandling"
                        zebraStripes
                    >
                        <TilGodkjenningTableHeader />
                        <Table.Body>
                            {oppgaver !== undefined && oppgaver.length > 0 ? (
                                oppgaver.map((oppgave) => (
                                    <TilGodkjenningOppgaveRow key={oppgave.id} oppgave={oppgave} />
                                ))
                            ) : (
                                <IngenMatchendeFiltre />
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            <Pagination
                antallOppgaver={antallOppgaver}
                fetchMore={(offset: number) => void fetchMore({ variables: { offset } })}
            />
        </VStack>
    );
};
