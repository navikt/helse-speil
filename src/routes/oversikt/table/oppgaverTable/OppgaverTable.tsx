import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { OppgaveTilBehandling } from '@io/graphql';
import { TabType, useAktivTab } from '@oversikt/tabState';

import { Pagination } from '../Pagination';
import { useFilters, useSetMultipleFilters, useToggleFilter } from '../state/filter';
import { useSetSortering, useSorteringState } from '../state/sortation';
import { FilterChips } from './FilterChips';
import { MineSakerTable } from './mineSaker/MineSakerTable';
import { PåVentTable } from './påVent/PåVentTable';
import { TilGodkjenningTable } from './tilGodkjenning/TilGodkjenningTable';

import styles from '../table.module.css';

interface OppgaverTableProps {
    oppgaver: OppgaveTilBehandling[];
    loading: boolean;
    antallOppgaver: number;
    numberOfPages: number;
    currentPage: number;
    limit: number;
    setPage: (newPage: number) => void;
}

export const OppgaverTable = React.memo(
    ({
        oppgaver,
        loading,
        antallOppgaver,
        numberOfPages,
        currentPage,
        limit,
        setPage,
    }: OppgaverTableProps): ReactElement => {
        const tab = useAktivTab();
        const { activeFilters } = useFilters();
        const sort = useSorteringState();
        const setSort = useSetSortering();
        const toggleFilter = useToggleFilter();
        const setMultipleFilters = useSetMultipleFilters();

        return (
            <div className={classNames(styles.TableContainer, loading && styles.Loading)}>
                <FilterChips
                    activeFilters={activeFilters}
                    setMultipleFilters={setMultipleFilters}
                    toggleFilter={toggleFilter}
                />
                <div className={styles.Content}>
                    <div className={styles.Scrollable}>
                        {tab === TabType.TilGodkjenning && (
                            <TilGodkjenningTable oppgaver={oppgaver} sort={sort} setSort={setSort} />
                        )}
                        {tab === TabType.Mine && <MineSakerTable oppgaver={oppgaver} sort={sort} setSort={setSort} />}
                        {tab === TabType.Ventende && <PåVentTable oppgaver={oppgaver} sort={sort} setSort={setSort} />}
                    </div>
                </div>
                <Pagination
                    numberOfEntries={antallOppgaver}
                    numberOfPages={numberOfPages}
                    currentPage={currentPage}
                    limit={limit}
                    setPage={setPage}
                />
            </div>
        );
    },
);
