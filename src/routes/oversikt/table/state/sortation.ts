import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { SortState } from '@navikt/ds-react';

import { Maybe, OppgaveTilBehandling } from '@io/graphql';
import { TabType, tabState } from '@oversikt/tabState';
import { atomWithLocalStorage } from '@state/jotai';

export enum SortKey {
    Saksbehandler = 'saksbehandler',
    SøknadMottatt = 'søknadMottatt',
    Opprettet = 'opprettet',
    Søker = 'søker',
    Tidsfrist = 'tidsfrist',
}

const defaultSortation: SortState = {
    orderBy: SortKey.Opprettet,
    direction: 'ascending',
};

type SorteringPerTab = { [key in TabType]: SortState };

const sorteringPerTab = atomWithLocalStorage<SorteringPerTab>('sorteringPerTab', {
    [TabType.TilGodkjenning]: defaultSortation,
    [TabType.Mine]: defaultSortation,
    [TabType.Ventende]: defaultSortation,
    [TabType.BehandletIdag]: defaultSortation,
});

const sortering = atom(
    (get) => get(sorteringPerTab)[get(tabState)],
    (get, set, newValue: SortState) =>
        set(sorteringPerTab, (prevState) => ({ ...prevState, [get(tabState)]: newValue })),
);

export const useSorteringValue = () => useAtomValue(sortering);

export const useSetSortering = () => {
    const setSortering = useSetAtom(sortering);
    return (sort: SortState, sortKey: SortKey) => {
        const sortState: SortState = {
            orderBy: sortKey,
            direction: sort.direction === 'descending' ? 'ascending' : 'descending',
        };

        setSortering(sortState);
    };
};

type DateSortKeyPerTab = { [key in TabType]: SortKey };

const dateSortKeyPerTab = atomWithLocalStorage<DateSortKeyPerTab>('dateSortKeyPerTab', {
    [TabType.TilGodkjenning]: SortKey.Opprettet,
    [TabType.Mine]: SortKey.Opprettet,
    [TabType.Ventende]: SortKey.Opprettet,
    [TabType.BehandletIdag]: SortKey.Opprettet,
});

const dateSortKey = atom(
    (get) => get(dateSortKeyPerTab)[get(tabState)],
    (get, set, newValue: SortKey) =>
        set(dateSortKeyPerTab, (prevState) => ({ ...prevState, [get(tabState)]: newValue })),
);
export const useDateSortState = () => useAtom(dateSortKey);
export const useDateSortValue = () => useAtomValue(dateSortKey);

export const getVisningsDato = (oppgave: OppgaveTilBehandling, sorteringsnøkkel: SortKey): Maybe<string> => {
    switch (sorteringsnøkkel) {
        case SortKey.SøknadMottatt:
            return oppgave.opprinneligSoknadsdato;
        case SortKey.Tidsfrist:
            return oppgave?.tidsfrist ?? null;
        case SortKey.Opprettet:
        default:
            return oppgave.opprettet;
    }
};
