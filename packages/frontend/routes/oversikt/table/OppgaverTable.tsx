import { SøkerCell } from './rader/SøkerCell';
import React from 'react';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useSyncNotater } from '@state/notater';

import { TabType, useAktivTab } from '../Tabs';
import { Cell } from './Cell';
import { FilterButton } from './FilterButton';
import { Header } from './Header';
import { LinkRow } from './LinkRow';
import { Pagination } from './Pagination';
import { SortButton } from './SortButton';
import { BostedCell } from './rader/BostedCell';
import { InntektskildeCell } from './rader/InntektskildeCell';
import { OpprettetCell } from './rader/OpprettetCell';
import { SakstypeCell } from './rader/SakstypeCell';
import { StatusCell } from './rader/StatusCell';
import { TildelingCell } from './rader/TildelingCell';
import { NotatCell } from './rader/notat/NotatCell';
import { OptionsCell } from './rader/options/OptionsCell';
import { Filter, useFilters } from './state/filter';
import { usePagination } from './state/pagination';
import { useSortation } from './state/sortation';

import styles from './table.module.css';

const groupFiltersByColumn = (filters: Filter<Oppgave>[]): Filter<Oppgave>[][] => {
    const groups = filters.reduce((groups: { [key: string]: Filter<Oppgave>[] }, filter: Filter<Oppgave>) => {
        const key = `${filter.column}`;
        return groups[key] ? { ...groups, [key]: [...groups[key], filter] } : { ...groups, [key]: [filter] };
    }, {});

    return Object.values(groups);
};

export const OppgaverTable = React.memo(({ oppgaver }: { oppgaver: Oppgave[] }) => {
    const pagination = usePagination();
    const sortation = useSortation();
    const filters = useFilters();
    const tab = useAktivTab();
    const readOnly = useIsReadOnlyOppgave();

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
    useSyncNotater(vedtaksperiodeIder);

    return (
        <div className={styles.TableContainer}>
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
                                    <FilterButton filters={filters.filter((it) => it.column === 1)}>
                                        Sakstype
                                    </FilterButton>
                                </Header>
                                <Header
                                    scope="col"
                                    colSpan={1}
                                    aria-sort={sortation?.label === 'bosted' ? sortation.state : 'none'}
                                >
                                    <SortButton
                                        label="bosted"
                                        onSort={(a: Oppgave, b: Oppgave) =>
                                            a.boenhet.navn.localeCompare(b.boenhet.navn)
                                        }
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
                                            new Date(a.sistSendt ?? a.opprettet).getTime() -
                                            new Date(b.sistSendt ?? b.opprettet).getTime()
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
                        <tbody>
                            {paginatedRows.map((it) => (
                                <LinkRow aktørId={it.aktørId} key={it.oppgavereferanse}>
                                    <TildelingCell oppgave={it} kanTildeles={!readOnly} />
                                    <SakstypeCell
                                        type={it.periodetype}
                                        erBeslutterOppgave={it.erBeslutterOppgave}
                                        erReturOppgave={it.erReturOppgave}
                                    />
                                    <BostedCell stedsnavn={it.boenhet.navn} />
                                    <InntektskildeCell type={it.inntektskilde} />
                                    <StatusCell numberOfWarnings={it.antallVarsler} />
                                    <SøkerCell name={it.personinfo} />
                                    <OpprettetCell date={it.sistSendt ?? it.opprettet} />
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
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination numberOfEntries={visibleRows.length} />
        </div>
    );
});
