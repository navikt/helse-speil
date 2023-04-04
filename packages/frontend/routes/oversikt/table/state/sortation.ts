import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { TabType, tabState } from '../../Tabs';

export type SortationState = 'ascending' | 'descending' | 'none';

export type Sortation<T> = {
    sortKey: string;
    function: (a: T, b: T) => number;
    state: SortationState;
};

type SortationPerTab = { [key in TabType]: Sortation<OppgaveForOversiktsvisning> };

const opprettetSortFunction = (a: OppgaveForOversiktsvisning, b: OppgaveForOversiktsvisning) =>
    new Date(a.sistSendt ?? a.opprettet).getTime() - new Date(b.sistSendt ?? b.opprettet).getTime();

export const opprettetSortation: Sortation<OppgaveForOversiktsvisning> = {
    sortKey: 'opprettet',
    function: opprettetSortFunction,
    state: 'ascending',
};

const saksbehandlerSortFunction = (a: OppgaveForOversiktsvisning, b: OppgaveForOversiktsvisning) => {
    if (!a.tildeling) return 1;
    if (!b.tildeling) return -1;
    if (a.tildeling.navn > b.tildeling.navn) return 1;
    if (a.tildeling.navn < b.tildeling.navn) return -1;
    return 0;
};

export const saksbehandlerSortation: Sortation<OppgaveForOversiktsvisning> = {
    sortKey: 'saksbehandler',
    function: saksbehandlerSortFunction,
    state: 'ascending',
};

const initialSortation: Sortation<OppgaveForOversiktsvisning> = opprettetSortation;

const sortationPerTab = atom<SortationPerTab>({
    key: 'sortationsPerTab',
    default: {
        [TabType.TilGodkjenning]: initialSortation,
        [TabType.Mine]: initialSortation,
        [TabType.Ventende]: initialSortation,
        [TabType.BehandletIdag]: initialSortation,
    },
});

const sortation = selector<Sortation<OppgaveForOversiktsvisning>>({
    key: 'sortation',
    get: ({ get }) => {
        const tab = get(tabState);
        return get(sortationPerTab)[tab];
    },
    set: ({ get, set }, newValue) => {
        const tab = get(tabState);
        set(sortationPerTab, (sortation) => ({ ...sortation, [tab]: newValue }));
    },
});

export const useSortation = () => useRecoilValue(sortation);

export const useSetSortation = () => useSetRecoilState(sortation);
