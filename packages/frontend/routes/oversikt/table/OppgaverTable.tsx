import styled from '@emotion/styled';
import React from 'react';

import { useSetVedtaksperiodeReferanserForNotater } from '@hooks/useSetVedtaksperiodeReferanserForNotater';
import { useRemoveAlleVarsler } from '@state/varsler';
import { Filter, useFilters } from './state/filter';
import { usePagination } from './state/pagination';
import { useSortation } from './state/sortation';

import { TabType, useAktivTab } from '../tabs';
import { Body } from './Body';
import { FilterButton } from './FilterButton';
import { Header } from './Header';
import { LinkRow } from './LinkRow';
import { Pagination } from './Pagination';
import { SortButton } from './SortButton';
import { Table } from './Table';
import { BostedCell } from './rader/BostedCell';
import { InntektskildeCell } from './rader/InntektskildeCell';
import { OpprettetCell } from './rader/OpprettetCell';
import { SakstypeCell } from './rader/SakstypeCell';
import { StatusCell } from './rader/StatusCell';
import { SøkerCell } from './rader/SøkerCell';
import { TildelingCell } from './rader/TildelingCell';
import { NotatCell } from './rader/notat/NotatCell';
import { OptionsCell } from './rader/options/OptionsCell';
import { useReadOnlyOppgave } from '@hooks/useReadOnlyOppgave';
import { Cell } from './Cell';

const Container = styled.div`
    min-height: 300px;
`;

const ScrollableX = styled.div`
    margin: 0;
    padding: 0;
    height: calc(100% - 50px);
    width: 100%;
`;

const groupFiltersByColumn = (filters: Filter<Oppgave>[]): Filter<Oppgave>[][] => {
    const groups = filters.reduce((groups: { [key: string]: Filter<Oppgave>[] }, filter: Filter<Oppgave>) => {
        const key = `${filter.column}`;
        return groups[key] ? { ...groups, [key]: [...groups[key], filter] } : { ...groups, [key]: [filter] };
    }, {});

    return Object.values(groups);
};

export const OppgaverTable = React.memo(({ oppgaver }: { oppgaver: Oppgave[] }) => {
    const removeVarsler = useRemoveAlleVarsler();
    const pagination = usePagination();
    const sortation = useSortation();
    const filters = useFilters();
    const tab = useAktivTab();
    const readOnly = useReadOnlyOppgave();

    const activeFilters = filters.filter((it) => it.active);
    const groupedFilters = groupFiltersByColumn(activeFilters);

    const visibleRows =
        activeFilters.length > 0
            ? oppgaver.filter((oppgave) => groupedFilters.every((it) => it.some((it) => it.function(oppgave))))
            : oppgaver;

    const sortedRows = sortation ? [...visibleRows].sort(sortation.function) : visibleRows;

    const paginatedRows = pagination
        ? sortedRows.slice(pagination.firstVisibleEntry, pagination.lastVisibleEntry + 1)
        : sortedRows;

    const vedtaksperiodeIder = paginatedRows.map((t) => t.vedtaksperiodeId);
    useSetVedtaksperiodeReferanserForNotater(vedtaksperiodeIder);

    const onNavigate = () => removeVarsler();

    return (
        <Container>
            <ScrollableX>
                <Table
                    aria-label={
                        tab === TabType.TilGodkjenning
                            ? 'Saker som er klare for behandling'
                            : tab === TabType.Mine
                            ? 'Saker som er tildelt meg'
                            : 'Saker som er tildelt meg og satt på vent'
                    }
                >
                    <thead>
                        <tr>
                            <Header scope="col" colSpan={1}>
                                {tab === TabType.TilGodkjenning ? (
                                    <FilterButton filters={filters.filter((it) => it.column === 0)}>
                                        Tildelt
                                    </FilterButton>
                                ) : (
                                    'Tildelt'
                                )}
                            </Header>
                            <Header scope="col" colSpan={1}>
                                <FilterButton filters={filters.filter((it) => it.column === 1)}>Sakstype</FilterButton>
                            </Header>
                            <Header
                                scope="col"
                                colSpan={1}
                                aria-sort={sortation?.label === 'bosted' ? sortation.state : 'none'}
                            >
                                <SortButton
                                    label="bosted"
                                    onSort={(a: Oppgave, b: Oppgave) => a.boenhet.navn.localeCompare(b.boenhet.navn)}
                                    state={sortation?.label === 'bosted' ? sortation.state : 'none'}
                                >
                                    Bosted
                                </SortButton>
                            </Header>
                            <Header scope="col" colSpan={1}>
                                <FilterButton filters={filters.filter((it) => it.column === 3)}>
                                    Inntektskilde
                                </FilterButton>
                            </Header>
                            <Header
                                scope="col"
                                colSpan={1}
                                aria-sort={sortation?.label === 'status' ? sortation.state : 'none'}
                            >
                                <SortButton
                                    label="status"
                                    onSort={(a: Oppgave, b: Oppgave) => a.antallVarsler - b.antallVarsler}
                                    state={sortation?.label === 'status' ? sortation.state : 'none'}
                                >
                                    Status
                                </SortButton>
                            </Header>
                            <Header scope="col" colSpan={1}>
                                Søker
                            </Header>
                            <Header
                                scope="col"
                                colSpan={1}
                                aria-sort={sortation?.label === 'opprettet' ? sortation.state : 'none'}
                            >
                                <SortButton
                                    label="opprettet"
                                    onSort={(a: Oppgave, b: Oppgave) =>
                                        new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime()
                                    }
                                    state={sortation?.label === 'opprettet' ? sortation.state : 'none'}
                                >
                                    Opprettet
                                </SortButton>
                            </Header>
                            <Header scope="col" colSpan={1} aria-label="valg" />
                            <Header scope="col" colSpan={1} aria-label="notater" />
                        </tr>
                    </thead>
                    <Body>
                        {paginatedRows.map((it) => (
                            <LinkRow onNavigate={onNavigate} aktørId={it.aktørId} key={it.oppgavereferanse}>
                                <TildelingCell oppgave={it} kanTildeles={!readOnly} />
                                <SakstypeCell
                                    type={it.periodetype}
                                    erBeslutterOppgave={it.erBeslutterOppgave}
                                    erReturOppgave={it.erReturOppgave}
                                />
                                <BostedCell stedsnavn={it.boenhet.navn} />
                                <InntektskildeCell type={it.inntektskilde} />
                                <StatusCell numberOfWarnings={it.antallVarsler} />
                                <SøkerCell personinfo={it.personinfo} />
                                <OpprettetCell date={it.opprettet} />
                                <OptionsCell oppgave={it} personinfo={it.personinfo} />
                                {it.tildeling?.påVent ? (
                                    <NotatCell
                                        vedtaksperiodeId={it.vedtaksperiodeId}
                                        personinfo={it.personinfo}
                                        erPåVent={it.tildeling.påVent}
                                    />
                                ) : (
                                    <Cell />
                                )}
                            </LinkRow>
                        ))}
                    </Body>
                </Table>
            </ScrollableX>
            <Pagination numberOfEntries={visibleRows.length} />
        </Container>
    );
});
