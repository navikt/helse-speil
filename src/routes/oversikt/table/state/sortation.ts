import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { SortState } from '@navikt/ds-react';

import { Maybe, OppgaveTilBehandling } from '@io/graphql';
import { TabType, tabState } from '@oversikt/tabState';

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

const sorteringPerTab = atomWithStorage<SorteringPerTab>('sorteringPerTab', {
    [TabType.TilGodkjenning]: defaultSortation,
    [TabType.Mine]: defaultSortation,
    [TabType.Ventende]: defaultSortation,
    [TabType.BehandletIdag]: defaultSortation,
});

const sorteringEndret = atom(false);

export const useSorteringEndret = () => useAtomValue(sorteringEndret);
export const useSetSorteringIkkeEndret = () => {
    const setEndret = useSetAtom(sorteringEndret);
    return () => {
        setEndret(false);
    };
};

const sortering = atom(
    (get) => get(sorteringPerTab)[get(tabState)],
    (get, set, newValue: SortState) =>
        set(sorteringPerTab, (prevState) => ({ ...prevState, [get(tabState)]: newValue })),
);

export const useSorteringState = () => useAtomValue(sortering);
export const useSetSortering = () => {
    const setSortering = useSetAtom(sortering);
    return (sortering: SortState) => {
        setSortering(sortering);
    };
};

export const useUpdateSort = () => {
    const setSorteringEndret = useSetAtom(sorteringEndret);
    return (sort: SortState, setSort: (state: SortState) => void, sortKey: SortKey) => {
        const sortState = {
            orderBy: sortKey,
            direction: sort.direction === 'descending' ? 'ascending' : 'descending',
        } as SortState;

        setSort(sortState);
        setSorteringEndret(true);
    };
};

const dateSortKey = atomWithStorage<SortKey>('dateSortKey', SortKey.Opprettet);
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
