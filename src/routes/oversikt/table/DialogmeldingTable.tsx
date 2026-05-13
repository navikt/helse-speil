'use client';

import React, { ReactElement, useState } from 'react';

import { BodyShort, Chips, Pagination as NavPagination, SortState, Table, VStack } from '@navikt/ds-react';

import { useGetDialogmeldingOppgaver } from '@io/rest/generated/default/default';
import { ApiDialogmeldingOppgave } from '@io/rest/generated/sporhund.schemas';
import { FilterStatus } from '@oversikt/table/state/filter';
import { cn } from '@utils/tw';

import { LinkRow } from './LinkRow';
import {
    DialogmeldingKolonne,
    useDialogmeldingFilters,
    useSetMultipleDialogmeldingFilters,
    useToggleDialogmeldingFilter,
} from './state/dialogmeldingFilter';
import { dialogmeldingLimit, useDialogmeldingPageState } from './state/dialogmeldingPagination';

import styles from './table.module.css';

type DialogmeldingSortKey = 'dato' | 'frist' | 'fagomrade' | 'soker' | 'meldingstype' | 'status';

function sortOppgaver(oppgaver: ApiDialogmeldingOppgave[], sort: SortState): ApiDialogmeldingOppgave[] {
    const key = sort.orderBy as DialogmeldingSortKey;
    const direction = sort.direction === 'ascending' ? 1 : -1;

    return [...oppgaver].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        return aVal < bVal ? -direction : aVal > bVal ? direction : 0;
    });
}

function filterOppgaver(
    oppgaver: ApiDialogmeldingOppgave[],
    activeFilters: { key: string; status: FilterStatus; column: string }[],
): ApiDialogmeldingOppgave[] {
    if (activeFilters.length === 0) return oppgaver;

    const columnMapping: Record<string, keyof ApiDialogmeldingOppgave> = {
        [DialogmeldingKolonne.FAGOMRADE]: 'fagomrade',
        [DialogmeldingKolonne.MELDINGSTYPE]: 'meldingstype',
        [DialogmeldingKolonne.STATUS]: 'status',
    };

    const plusFilters = activeFilters.filter((f) => f.status === FilterStatus.PLUS);
    const minusFilters = activeFilters.filter((f) => f.status === FilterStatus.MINUS);

    return oppgaver.filter((oppgave) => {
        const matchesPlus =
            plusFilters.length === 0 ||
            plusFilters.some((f) => {
                const field = columnMapping[f.column];
                return field && oppgave[field] === f.key;
            });

        const matchesMinus = minusFilters.every((f) => {
            const field = columnMapping[f.column];
            return field && oppgave[field] !== f.key;
        });

        return matchesPlus && matchesMinus;
    });
}

export function DialogmeldingTable(): ReactElement {
    const [sort, setSort] = useState<SortState>({ orderBy: 'dato', direction: 'descending' });
    const { activeFilters } = useDialogmeldingFilters();
    const toggleFilter = useToggleDialogmeldingFilter();
    const setMultipleFilters = useSetMultipleDialogmeldingFilters();
    const [currentPage, setCurrentPage] = useDialogmeldingPageState();

    const { data: oppgaver = [] } = useGetDialogmeldingOppgaver();

    const filtered = filterOppgaver(oppgaver, activeFilters);
    const sorted = sortOppgaver(filtered, sort);
    const antallOppgaver = sorted.length;
    const numberOfPages = Math.ceil(antallOppgaver / dialogmeldingLimit) || 1;
    const paginated = sorted.slice((currentPage - 1) * dialogmeldingLimit, currentPage * dialogmeldingLimit);

    const handleSort = (sortKey: DialogmeldingSortKey) => {
        setSort((prev) => ({
            orderBy: sortKey,
            direction: prev.orderBy === sortKey && prev.direction === 'ascending' ? 'descending' : 'ascending',
        }));
    };

    return (
        <VStack paddingBlock="space-16 space-0" className={styles.TableContainer}>
            <DialogmeldingFilterChips
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                setMultipleFilters={setMultipleFilters}
            />
            <div className={styles.Content}>
                <div className={styles.Scrollable}>
                    <Table
                        aria-label="Dialogmeldinger"
                        zebraStripes
                        sort={sort}
                        onSortChange={(sortKey) => handleSort(sortKey as DialogmeldingSortKey)}
                    >
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader sortKey="dato" sortable>
                                    Dato
                                </Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="frist" sortable>
                                    Frist
                                </Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="fagomrade" sortable>
                                    Fagområde
                                </Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="soker" sortable>
                                    Søker
                                </Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="meldingstype" sortable>
                                    Meldingstype
                                </Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="status" sortable>
                                    Status
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {paginated.length > 0 ? (
                                paginated.map((oppgave) => (
                                    <LinkRow
                                        key={oppgave.id}
                                        personPseudoId={oppgave.personPseudoId}
                                        subPath={`dialogmelding/${oppgave.id}`}
                                    >
                                        <Table.DataCell>{oppgave.dato}</Table.DataCell>
                                        <Table.DataCell>{oppgave.frist}</Table.DataCell>
                                        <Table.DataCell>{oppgave.fagomrade}</Table.DataCell>
                                        <Table.DataCell>{oppgave.soker}</Table.DataCell>
                                        <Table.DataCell>{oppgave.meldingstype}</Table.DataCell>
                                        <Table.DataCell>{oppgave.status}</Table.DataCell>
                                    </LinkRow>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.DataCell colSpan={6}>Ingen dialogmeldinger å vise</Table.DataCell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            <div className={styles.Pagination}>
                <NavPagination
                    page={currentPage}
                    onPageChange={setCurrentPage}
                    count={numberOfPages}
                    siblingCount={2}
                    prevNextTexts
                />
                {antallOppgaver > 0 && (
                    <BodyShort>
                        Viser {(currentPage - 1) * dialogmeldingLimit + 1} til{' '}
                        {Math.min(currentPage * dialogmeldingLimit, antallOppgaver)} av {antallOppgaver} oppgaver
                    </BodyShort>
                )}
            </div>
        </VStack>
    );
}

interface DialogmeldingFilterChipsProps {
    activeFilters: { key: string; label: string; status: FilterStatus }[];
    toggleFilter: (key: string, status: FilterStatus) => void;
    setMultipleFilters: (filterStatus: FilterStatus, ...keys: string[]) => void;
}

const DialogmeldingFilterChips = ({
    activeFilters,
    toggleFilter,
    setMultipleFilters,
}: DialogmeldingFilterChipsProps): ReactElement => {
    if (activeFilters.length > 0) {
        return (
            <Chips className="mx-3 mt-1 mb-2">
                {activeFilters.map((filter) => (
                    <Chips.Removable
                        className={cn({
                            'bg-ax-bg-danger-strong hover:bg-ax-bg-danger-strong-hover':
                                filter.status === FilterStatus.MINUS,
                        })}
                        key={filter.key}
                        onClick={() => toggleFilter(filter.key, FilterStatus.OFF)}
                    >
                        {filter.label}
                    </Chips.Removable>
                ))}
                <Chips.Removable
                    onClick={() => setMultipleFilters(FilterStatus.OFF, ...activeFilters.map((f) => f.key))}
                    data-color="neutral"
                >
                    Nullstill alle
                </Chips.Removable>
            </Chips>
        );
    }

    return (
        <Chips className="mx-3 mt-1 mb-2">
            <Chips.Toggle className="cursor-default" checkmark={false}>
                Ingen aktive filter
            </Chips.Toggle>
        </Chips>
    );
};
