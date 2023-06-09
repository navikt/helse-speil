import { SortState } from '@navikt/ds-react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

export enum SortKey {
    Saksbehandler = 'saksbehandler',
    SøknadMottatt = 'søknadMottatt',
    Opprettet = 'opprettet',
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
            return filteredRows
                .slice()
                .sort((a, b) =>
                    sort.direction === 'ascending' ? saksbehandlerSortFunction(a, b) : saksbehandlerSortFunction(b, a),
                );
        case SortKey.Opprettet:
            return filteredRows
                .slice()
                .sort((a, b) =>
                    sort.direction === 'ascending' ? opprettetSortFunction(a, b) : opprettetSortFunction(b, a),
                );
        case SortKey.SøknadMottatt:
            return filteredRows
                .slice()
                .sort((a, b) =>
                    sort.direction === 'ascending' ? søknadMottattSortFunction(a, b) : søknadMottattSortFunction(b, a),
                );
    }
};

export const opprettetSortFunction = (a: OppgaveForOversiktsvisning, b: OppgaveForOversiktsvisning) =>
    new Date(a.sistSendt ?? a.opprettet).getTime() - new Date(b.sistSendt ?? b.opprettet).getTime();

export const saksbehandlerSortFunction = (a: OppgaveForOversiktsvisning, b: OppgaveForOversiktsvisning) => {
    if (!a.tildeling) return 1;
    if (!b.tildeling) return -1;
    if (a.tildeling.navn > b.tildeling.navn) return 1;
    if (a.tildeling.navn < b.tildeling.navn) return -1;
    return 0;
};

export const søknadMottattSortFunction = (a: OppgaveForOversiktsvisning, b: OppgaveForOversiktsvisning) =>
    new Date(a.opprinneligSoknadsdato).getTime() - new Date(b.opprinneligSoknadsdato).getTime();
