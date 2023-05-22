import React from 'react';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { FetchOppgaverQuery, OppgaveForOversiktsvisning } from '@io/graphql';
import { useSyncNotater } from '@state/notater';

import { TabType, useAktivTab } from '../../tabState';
import { Pagination } from '../Pagination';
import { Filter, useFilters, useSetMultipleFilters, useToggleFilter } from '../state/filter';
import { usePagination } from '../state/pagination';
import { useSortation } from '../state/sortation';
import styles from '../table.module.css';
import { DropdownHeaderRow } from './DropdownHeaderRow';
import { FilterChips } from './FilterChips';
import { OppgaveRow } from './OppgaveRow';
import { SortHeaderRow } from './SortHeaderRow';

interface OppgaverTableProps {
    oppgaver: FetchOppgaverQuery['alleOppgaver'];
}

export const OppgaverTable: React.FC<OppgaverTableProps> = React.memo(({ oppgaver }) => {
    const pagination = usePagination();
    const sortation = useSortation();
    const filters = useFilters();
    const toggleFilter = useToggleFilter();
    const setMultipleFilters = useSetMultipleFilters();
    const tab = useAktivTab();
    const readOnly = useIsReadOnlyOppgave();

    const activeFilters = filters.filter((it) => it.active);
    const groupedFilters = groupFiltersByColumn(activeFilters);

    const visibleRows =
        activeFilters.length > 0
            ? (oppgaver.filter((oppgave) =>
                  groupedFilters.every((it) => it.some((it) => it.function(oppgave as OppgaveForOversiktsvisning))),
              ) as Array<OppgaveForOversiktsvisning>)
            : (oppgaver as Array<OppgaveForOversiktsvisning>);

    const sortedRows = [...(visibleRows as Array<OppgaveForOversiktsvisning>)].sort(sortation.function);

    const paginatedRows = pagination
        ? sortedRows.slice(pagination.firstVisibleEntry, pagination.lastVisibleEntry + 1)
        : sortedRows;

    const vedtaksperiodeIder = paginatedRows.map((t) => t.vedtaksperiodeId);
    useSyncNotater(vedtaksperiodeIder);

    return (
        <div className={styles.TableContainer}>
            {activeFilters.length > 0 && (
                <FilterChips
                    activeFilters={activeFilters}
                    setMultipleFilters={setMultipleFilters}
                    toggleFilter={toggleFilter}
                />
            )}
            <div className={styles.Content}>
                <div className={styles.Scrollable}>
                    <table
                        className={styles.Table}
                        aria-label={
                            tab === TabType.TilGodkjenning
                                ? 'Saker som er klare for behandling'
                                : tab === TabType.Mine
                                ? 'Saker som er tildelt meg'
                                : 'Saker som er tildelt meg og satt på vent'
                        }
                    >
                        <thead>
                            <DropdownHeaderRow tab={tab} filters={filters} />
                            <SortHeaderRow sortation={sortation} />
                        </thead>
                        <tbody>
                            {paginatedRows.map((oppgave) => (
                                <OppgaveRow key={oppgave.id} oppgave={oppgave} readOnly={readOnly} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination numberOfEntries={visibleRows.length} />
        </div>
    );
});

const groupFiltersByColumn = (
    filters: Filter<OppgaveForOversiktsvisning>[],
): Filter<OppgaveForOversiktsvisning>[][] => {
    const groups = filters.reduce(
        (
            groups: { [key: string]: Filter<OppgaveForOversiktsvisning>[] },
            filter: Filter<OppgaveForOversiktsvisning>,
        ) => {
            const key = `${filter.column}`;
            return groups[key] ? { ...groups, [key]: [...groups[key], filter] } : { ...groups, [key]: [filter] };
        },
        {},
    );

    return Object.values(groups);
};
