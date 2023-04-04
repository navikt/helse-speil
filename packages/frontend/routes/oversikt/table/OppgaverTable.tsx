import { SøkerCell } from './rader/SøkerCell';
import React from 'react';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { FetchOppgaverQuery, OppgaveForOversiktsvisning, Periodetype } from '@io/graphql';
import { useSyncNotater } from '@state/notater';

import { TabType, useAktivTab } from '../Tabs';
import { Cell } from './Cell';
import { FilterButton } from './FilterButton';
import { Header } from './Header';
import { LinkRow } from './LinkRow';
import { Pagination } from './Pagination';
import { SortableHeader } from './SortableHeader';
import { DatoCell } from './rader/DatoCell';
import { EgenskaperCell } from './rader/EgenskaperCell';
import { InntektskildeCell } from './rader/InntektskildeCell';
import { MottakerCell } from './rader/MottakerCell';
import { OppgavetypeCell } from './rader/OppgavetypeCell';
import { PeriodetypeCell } from './rader/PeriodetypeCell';
import { TildelingCell } from './rader/TildelingCell';
import { NotatCell } from './rader/notat/NotatCell';
import { OptionsCell } from './rader/options/OptionsCell';
import { Filter, useFilters } from './state/filter';
import { usePagination } from './state/pagination';
import { opprettetSortation, saksbehandlerSortation, useSortation } from './state/sortation';

import styles from './table.module.css';

const groupFiltersByColumn = (
    filters: Filter<OppgaveForOversiktsvisning>[]
): Filter<OppgaveForOversiktsvisning>[][] => {
    const groups = filters.reduce(
        (
            groups: { [key: string]: Filter<OppgaveForOversiktsvisning>[] },
            filter: Filter<OppgaveForOversiktsvisning>
        ) => {
            const key = `${filter.column}`;
            return groups[key] ? { ...groups, [key]: [...groups[key], filter] } : { ...groups, [key]: [filter] };
        },
        {}
    );

    return Object.values(groups);
};

interface OppgaverTableProps {
    oppgaver: FetchOppgaverQuery['alleOppgaver'];
}

export const OppgaverTable: React.FC<OppgaverTableProps> = React.memo(({ oppgaver }) => {
    const pagination = usePagination();
    const sortation = useSortation();
    const filters = useFilters();
    const tab = useAktivTab();
    const readOnly = useIsReadOnlyOppgave();

    const activeFilters = filters.filter((it) => it.active);
    const groupedFilters = groupFiltersByColumn(activeFilters);

    const visibleRows =
        activeFilters.length > 0
            ? (oppgaver.filter((oppgave) =>
                  groupedFilters.every((it) => it.some((it) => it.function(oppgave as OppgaveForOversiktsvisning)))
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
                            <tr className={styles.DropdownHeader}>
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
                                        Periodetype
                                    </FilterButton>
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <FilterButton filters={filters.filter((it) => it.column === 2)}>
                                        Oppgavetype
                                    </FilterButton>
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <FilterButton filters={filters.filter((it) => it.column === 3)}>
                                        Mottaker
                                    </FilterButton>
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <FilterButton filters={filters.filter((it) => it.column === 4)}>
                                        Egenskaper
                                    </FilterButton>
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    <FilterButton filters={filters.filter((it) => it.column === 5)}>
                                        Inntektskilde
                                    </FilterButton>
                                </Header>
                            </tr>
                            <tr className={styles.SortHeader}>
                                <SortableHeader
                                    sortation={sortation}
                                    sortKey={saksbehandlerSortation.sortKey}
                                    onSort={saksbehandlerSortation.function}
                                >
                                    Saksbehandler
                                </SortableHeader>
                                <Header scope="col" colSpan={1}>
                                    Periodetype
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Oppgavetype
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Mottaker
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Egenskaper
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Inntektskilde
                                </Header>
                                <Header scope="col" colSpan={1}>
                                    Søker
                                </Header>
                                <SortableHeader
                                    sortation={sortation}
                                    sortKey={opprettetSortation.sortKey}
                                    onSort={opprettetSortation.function}
                                >
                                    Opprettet
                                </SortableHeader>
                                <SortableHeader
                                    sortation={sortation}
                                    sortKey="søknadMottatt"
                                    onSort={(a, b) =>
                                        new Date(a.opprinneligSoknadsdato).getTime() -
                                        new Date(b.opprinneligSoknadsdato).getTime()
                                    }
                                >
                                    Søknad mottatt
                                </SortableHeader>
                                <td aria-label="valg" />
                                <td aria-label="notater" />
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRows.map((it) => (
                                <LinkRow aktørId={it.aktorId} key={it.id}>
                                    <TildelingCell oppgave={it} kanTildeles={!readOnly} />
                                    <PeriodetypeCell type={it.periodetype ?? Periodetype.Forstegangsbehandling} />
                                    <OppgavetypeCell oppgavetype={it.type} />
                                    <MottakerCell mottaker={it.mottaker} />
                                    <EgenskaperCell
                                        erBeslutter={
                                            it.erBeslutter || it.totrinnsvurdering?.erBeslutteroppgave === true
                                        }
                                        erRetur={it.erRetur || it.totrinnsvurdering?.erRetur === true}
                                    />
                                    <InntektskildeCell flereArbeidsgivere={it.flereArbeidsgivere} />
                                    <SøkerCell name={it.personinfo} />
                                    <DatoCell date={it.sistSendt ?? it.opprettet} />
                                    <DatoCell date={it.opprinneligSoknadsdato ?? it.opprettet} />
                                    <OptionsCell oppgave={it} personinfo={it.personinfo} />
                                    {it.tildeling?.reservert ? (
                                        <NotatCell
                                            vedtaksperiodeId={it.vedtaksperiodeId}
                                            personinfo={it.personinfo}
                                            erPåVent={it.tildeling.reservert}
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
