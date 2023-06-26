import { PåVentTable } from './påVent/PåVentTable';
import React from 'react';
import { useRecoilState } from 'recoil';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { FetchOppgaverQuery, OppgaveForOversiktsvisning } from '@io/graphql';

import { TabType, useAktivTab } from '../../tabState';
import { Pagination } from '../Pagination';
import { filterRows, useFilters, useSetMultipleFilters, useToggleFilter } from '../state/filter';
import { Pagination as PaginationType, usePagination } from '../state/pagination';
import { sortRows, sortering } from '../state/sortation';
import styles from '../table.module.css';
import { FilterChips } from './FilterChips';
import { MineSakerTable } from './mineSaker/MineSakerTable';
import { TilGodkjenningTable } from './tilGodkjenning/TilGodkjenningTable';

interface OppgaverTableProps {
    oppgaver: FetchOppgaverQuery['alleOppgaver'];
}

export const OppgaverTable: React.FC<OppgaverTableProps> = React.memo(({ oppgaver }) => {
    const tab = useAktivTab();
    const filters = useFilters();
    const [sort, setSort] = useRecoilState(sortering);
    const pagination = usePagination();
    const toggleFilter = useToggleFilter();
    const setMultipleFilters = useSetMultipleFilters();
    const readOnly = useIsReadOnlyOppgave();

    const activeFilters = filters.filter((it) => it.active);
    const filteredRows = filterRows(activeFilters, oppgaver);
    const sortedRows = sortRows(sort, filteredRows);
    const paginatedRows = paginateRows(pagination, sortedRows);

    return (
        <div className={styles.TableContainer}>
            <FilterChips
                activeFilters={activeFilters}
                setMultipleFilters={setMultipleFilters}
                toggleFilter={toggleFilter}
            />
            <div className={styles.Content}>
                <div className={styles.Scrollable}>
                    {tab === TabType.TilGodkjenning && (
                        <TilGodkjenningTable
                            filters={filters}
                            oppgaver={paginatedRows}
                            readOnly={readOnly}
                            sort={sort}
                            setSort={setSort}
                        />
                    )}
                    {tab === TabType.Mine && (
                        <MineSakerTable filters={filters} oppgaver={paginatedRows} sort={sort} setSort={setSort} />
                    )}
                    {tab === TabType.Ventende && (
                        <PåVentTable filters={filters} oppgaver={paginatedRows} sort={sort} setSort={setSort} />
                    )}
                </div>
            </div>
            <Pagination numberOfEntries={filteredRows.length} />
        </div>
    );
});

const paginateRows = (pagination: PaginationType | null, oppgaver: OppgaveForOversiktsvisning[]) => {
    return pagination ? oppgaver.slice(pagination.firstVisibleEntry, pagination.lastVisibleEntry + 1) : oppgaver;
};
