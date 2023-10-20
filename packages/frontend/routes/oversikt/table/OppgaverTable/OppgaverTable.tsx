import React from 'react';
import { useRecoilState } from 'recoil';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { OppgaveTilBehandling } from '@io/graphql';

import { TabType, useAktivTab } from '../../tabState';
import { Pagination } from '../Pagination';
import { useFilters, useSetMultipleFilters, useToggleFilter } from '../state/filter';
import { sortering } from '../state/sortation';
import { FilterChips } from './FilterChips';
import { MineSakerTable } from './mineSaker/MineSakerTable';
import { PåVentTable } from './påVent/PåVentTable';
import { TilGodkjenningTable } from './tilGodkjenning/TilGodkjenningTable';

import styles from '../table.module.css';

interface OppgaverTableProps {
    oppgaver: OppgaveTilBehandling[];
    antallOppgaver: number;
    numberOfPages: number;
    currentPage: number;
    limit: number;
    setPage: (newPage: number) => void;
}

export const OppgaverTable: React.FC<OppgaverTableProps> = React.memo(
    ({ oppgaver, antallOppgaver, numberOfPages, currentPage, limit, setPage }) => {
        const tab = useAktivTab();
        const { allFilters, activeFilters } = useFilters();
        const [sort, setSort] = useRecoilState(sortering);
        const toggleFilter = useToggleFilter();
        const setMultipleFilters = useSetMultipleFilters();
        const readOnly = useIsReadOnlyOppgave();

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
                                filters={allFilters}
                                oppgaver={oppgaver}
                                readOnly={readOnly}
                                sort={sort}
                                setSort={setSort}
                            />
                        )}
                        {tab === TabType.Mine && (
                            <MineSakerTable filters={allFilters} oppgaver={oppgaver} sort={sort} setSort={setSort} />
                        )}
                        {tab === TabType.Ventende && (
                            <PåVentTable filters={allFilters} oppgaver={oppgaver} sort={sort} setSort={setSort} />
                        )}
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
