import { PåVentTable } from './påVent/PåVentTable';
import React from 'react';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { FetchOppgaverQuery, OppgaveForOversiktsvisning } from '@io/graphql';

import { TabType, useAktivTab } from '../../tabState';
import { Pagination } from '../Pagination';
import { Filter, useFilters, useSetMultipleFilters, useToggleFilter } from '../state/filter';
import { usePagination } from '../state/pagination';
import styles from '../table.module.css';
import { FilterChips } from './FilterChips';
import { MineSakerTable } from './mineSaker/MineSakerTable';
import { TilGodkjenningTable } from './tilGodkjenning/TilGodkjenningTable';

interface OppgaverTableProps {
    oppgaver: FetchOppgaverQuery['alleOppgaver'];
}

export const OppgaverTable: React.FC<OppgaverTableProps> = React.memo(({ oppgaver }) => {
    const pagination = usePagination();
    const filters = useFilters();
    const toggleFilter = useToggleFilter();
    const setMultipleFilters = useSetMultipleFilters();
    const tab = useAktivTab();
    const readOnly = useIsReadOnlyOppgave();

    const activeFilters = filters.filter((it) => it.active);
    const groupedFilters = groupFiltersByColumn(activeFilters);

    const filteredRows =
        activeFilters.length > 0
            ? (oppgaver.filter((oppgave) =>
                  groupedFilters.every((it) => it.some((it) => it.function(oppgave as OppgaveForOversiktsvisning))),
              ) as Array<OppgaveForOversiktsvisning>)
            : (oppgaver as Array<OppgaveForOversiktsvisning>);

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
                            filteredRows={filteredRows}
                            pagination={pagination}
                            readOnly={readOnly}
                        />
                    )}
                    {tab === TabType.Mine && (
                        <MineSakerTable filters={filters} filteredRows={filteredRows} pagination={pagination} />
                    )}
                    {tab === TabType.Ventende && (
                        <PåVentTable filters={filters} filteredRows={filteredRows} pagination={pagination} />
                    )}
                </div>
            </div>
            <Pagination numberOfEntries={filteredRows.length} />
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
