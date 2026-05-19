'use client';

import React, { ReactElement, useState } from 'react';

import { BodyShort, HStack, Pagination as NavPagination, SortState, Table, VStack } from '@navikt/ds-react';

import { fagomradeLabels, meldingstypeLabels, statusLabels } from '@/form-schemas/nyDialogmeldingSkjema';
import { useGetDialogmeldingOppgaver } from '@io/rest/generated/default/default';
import { ApiDialogmeldingOppgave } from '@io/rest/generated/sporhund.schemas';
import { DialogmeldingFilterChips } from '@oversikt/table/dialogmeldingTable/DialogmeldingFilterChips';
import { FilterStatus } from '@oversikt/table/state/filter';
import { getFormattedDatetimeString } from '@utils/date';

import { LinkRow } from '../LinkRow';
import {
    DialogmeldingKolonne,
    useDialogmeldingFilters,
    useSetMultipleDialogmeldingFilters,
    useToggleDialogmeldingFilter,
} from '../state/dialogmeldingFilter';
import { dialogmeldingLimit, useDialogmeldingPageState } from '../state/dialogmeldingPagination';

import paginationStyles from '../Pagination.module.css';
import styles from '../table.module.css';

type DialogmeldingSortKey = 'dato' | 'frist' | 'fagomrade' | 'soker' | 'meldingstype' | 'status';

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
                                        <Table.DataCell>{getFormattedDatetimeString(oppgave.dato)}</Table.DataCell>
                                        <Table.DataCell>{getFormattedDatetimeString(oppgave.frist)}</Table.DataCell>
                                        <Table.DataCell>{fagomradeLabels[oppgave.fagomrade]}</Table.DataCell>
                                        <Table.DataCell>{oppgave.soker}</Table.DataCell>
                                        <Table.DataCell>{meldingstypeLabels[oppgave.meldingstype]}</Table.DataCell>
                                        <Table.DataCell>{statusLabels[oppgave.status]}</Table.DataCell>
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
            <HStack className={paginationStyles.Pagination}>
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
            </HStack>
        </VStack>
    );
}

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
