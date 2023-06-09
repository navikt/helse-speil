import { SortState } from '@navikt/ds-react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

export enum SortKey {
    Saksbehandler = 'saksbehandler',
    SøknadMottatt = 'søknadMottatt',
    Opprettet = 'opprettet',
    Søker = 'søker',
}

export const defaultSortation: SortState = {
    orderBy: SortKey.Opprettet,
    direction: 'ascending',
};

export const updateSort = (
    sort: SortState | undefined,
    setSort: (state: SortState | undefined) => void,
    sortKey: SortKey,
) => {
    setSort(
        sort && sortKey === sort.orderBy && sort.direction === 'descending'
            ? undefined
            : {
                  orderBy: sortKey,
                  direction:
                      sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending',
              },
    );
};

export const sortRows = (sort: SortState, filteredRows: OppgaveForOversiktsvisning[]): OppgaveForOversiktsvisning[] => {
    switch (sort.orderBy as SortKey) {
        case SortKey.Saksbehandler:
            return sortFilteredRows(filteredRows, sort, saksbehandlerSortFunction);
        case SortKey.Opprettet:
            return sortFilteredRows(filteredRows, sort, opprettetSortFunction);
        case SortKey.SøknadMottatt:
            return sortFilteredRows(filteredRows, sort, søknadMottattSortFunction);
        case SortKey.Søker:
            return sortFilteredRows(filteredRows, sort, søkerSortFunction);
    }
};

type OppgaveSortFunctionType = (a: OppgaveForOversiktsvisning, b: OppgaveForOversiktsvisning) => number;

const sortFilteredRows = (
    filteredRows: OppgaveForOversiktsvisning[],
    sort: SortState,
    sortFunction: OppgaveSortFunctionType,
): OppgaveForOversiktsvisning[] =>
    filteredRows.slice().sort((a, b) => (sort.direction === 'ascending' ? sortFunction(a, b) : sortFunction(b, a)));

export const opprettetSortFunction: OppgaveSortFunctionType = (
    a: OppgaveForOversiktsvisning,
    b: OppgaveForOversiktsvisning,
) => new Date(a.sistSendt ?? a.opprettet).getTime() - new Date(b.sistSendt ?? b.opprettet).getTime();

export const saksbehandlerSortFunction: OppgaveSortFunctionType = (
    a: OppgaveForOversiktsvisning,
    b: OppgaveForOversiktsvisning,
) => {
    if (!a.tildeling) return 1;
    if (!b.tildeling) return -1;
    if (a.tildeling.navn > b.tildeling.navn) return 1;
    if (a.tildeling.navn < b.tildeling.navn) return -1;
    return 0;
};

export const søknadMottattSortFunction: OppgaveSortFunctionType = (
    a: OppgaveForOversiktsvisning,
    b: OppgaveForOversiktsvisning,
) => new Date(a.opprinneligSoknadsdato).getTime() - new Date(b.opprinneligSoknadsdato).getTime();

export const søkerSortFunction: OppgaveSortFunctionType = (
    a: OppgaveForOversiktsvisning,
    b: OppgaveForOversiktsvisning,
) => {
    if (!a.navn) return 1;
    if (!b.navn) return -1;
    if (a.navn.etternavn > b.navn.etternavn) return 1;
    if (a.navn.etternavn < b.navn.etternavn) return -1;
    return 0;
};
