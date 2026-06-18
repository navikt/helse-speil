'use client';

import React, { ReactElement, useState } from 'react';

import { BodyShort, HStack, Pagination as NavPagination, SortState, Table, VStack } from '@navikt/ds-react';

import { fagomradeLabels, statusLabels } from '@/form-schemas/nyDialogmeldingSkjema';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { useGetDialogmeldingOppgaver } from '@io/rest/generated/default/default';
import { ApiDialogmeldingOppgave, ApiNavn } from '@io/rest/generated/sporhund.schemas';
import { DialogmeldingBodySkeleton } from '@oversikt/table/dialogmeldingTable/DialogmeldingBodySkeleton';
import { DialogmeldingFilterChips } from '@oversikt/table/dialogmeldingTable/DialogmeldingFilterChips';
import { FilterStatus } from '@oversikt/table/state/filter';
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date';
import { capitalizeName } from '@utils/locale';

import { LinkRow } from '../LinkRow';
import {
    DialogmeldingKolonne,
    useDialogmeldingFilters,
    useSetMultipleDialogmeldingFilters,
    useToggleDialogmeldingFilter,
} from '../state/dialogmeldingFilter';
import { dialogmeldingLimit, useDialogmeldingPageState } from '../state/dialogmeldingPagination';

type DialogmeldingSortKey = 'sisteAktivitet' | 'frist' | 'fagomrade' | 'soker' | 'fodselsdato' | 'status';

export function DialogmeldingTable(): ReactElement {
    const [sort, setSort] = useState<SortState>({ orderBy: 'sisteAktivitet', direction: 'descending' });
    const { activeFilters } = useDialogmeldingFilters();
    const toggleFilter = useToggleDialogmeldingFilter();
    const setMultipleFilters = useSetMultipleDialogmeldingFilters();
    const [currentPage, setCurrentPage] = useDialogmeldingPageState();

    const { data: oppgaver = [], isPending } = useGetDialogmeldingOppgaver();

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
        <VStack paddingBlock="space-16 space-0" className="h-full overflow-auto">
            <DialogmeldingFilterChips
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                setMultipleFilters={setMultipleFilters}
            />
            <div className="flex-1 overflow-auto text-ax-text-neutral [scrollbar-width:none]">
                <div className="h-[calc(100%-50px)] w-full">
                    <Table
                        aria-label="Dialogmeldinger"
                        zebraStripes
                        sort={sort}
                        onSortChange={(sortKey) => handleSort(sortKey as DialogmeldingSortKey)}
                    >
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader sortKey="sisteAktivitet" sortable className="w-50">
                                    Siste aktivitet
                                </Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="frist" sortable className="w-36">
                                    Frist
                                </Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="fagomrade" sortable className="w-74">
                                    Fagområde
                                </Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="soker" sortable className="w-120">
                                    Søker
                                </Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="fodselsdato" sortable className="w-36">
                                    Fødselsdato
                                </Table.ColumnHeader>
                                <Table.ColumnHeader sortKey="status" sortable className="w-36">
                                    Status
                                </Table.ColumnHeader>
                                <Table.ColumnHeader />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {isPending ? (
                                <DialogmeldingBodySkeleton />
                            ) : paginated.length > 0 ? (
                                paginated.map((oppgave) => (
                                    <LinkRow
                                        key={oppgave.conversationRef}
                                        personPseudoId={oppgave.personPseudoId}
                                        subPath={`dialogmelding/${oppgave.conversationRef}`}
                                    >
                                        <Table.DataCell>
                                            {getFormattedDatetimeString(oppgave.sisteAktivitetTidspunkt)}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {getFormattedDateString(oppgave.fristTidspunkt)}
                                        </Table.DataCell>
                                        <Table.DataCell>{fagomradeLabels[oppgave.fagomrade]}</Table.DataCell>
                                        <Table.DataCell>
                                            <span className="block w-120 truncate">
                                                <AnonymizableTextWithEllipsis style={{ width: 200 }}>
                                                    {formatSøkernavn(oppgave.soker.navn)}
                                                </AnonymizableTextWithEllipsis>
                                            </span>
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <AnonymizableTextWithEllipsis>
                                                {getFormattedDateString(oppgave.soker.fodselsdato)}
                                            </AnonymizableTextWithEllipsis>
                                        </Table.DataCell>
                                        <Table.DataCell>{statusLabels[oppgave.status]}</Table.DataCell>
                                        <Table.DataCell />
                                    </LinkRow>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.DataCell colSpan={7}>Ingen dialogmeldinger å vise</Table.DataCell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            <HStack className="mt-4 shrink-0 items-center justify-between">
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
    const sortValueGetters: Record<DialogmeldingSortKey, (oppgave: ApiDialogmeldingOppgave) => string> = {
        sisteAktivitet: (oppgave) => oppgave.sisteAktivitetTidspunkt,
        frist: (oppgave) => oppgave.fristTidspunkt,
        fagomrade: (oppgave) => oppgave.fagomrade,
        soker: (oppgave) => formatSøkernavn(oppgave.soker.navn),
        fodselsdato: (oppgave) => oppgave.soker.fodselsdato.slice(-2),
        status: (oppgave) => oppgave.status,
    };

    return [...oppgaver].sort((a, b) => {
        const aVal = sortValueGetters[key](a);
        const bVal = sortValueGetters[key](b);
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
        [DialogmeldingKolonne.STATUS]: 'status',
    };

    const plusFilters = activeFilters.filter((f) => f.status === FilterStatus.PLUS);
    const minusFilters = activeFilters.filter((f) => f.status === FilterStatus.MINUS);

    return oppgaver.filter((oppgave) => {
        const matchesPlus =
            plusFilters.length === 0 ||
            plusFilters.every((f) => {
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

function formatSøkernavn({ fornavn, mellomnavn, etternavn }: ApiNavn): string {
    return capitalizeName(`${etternavn}, ${fornavn}${mellomnavn ? ` ${mellomnavn}` : ''}`);
}
