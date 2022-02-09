import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { tabState, TabType } from '../../tabs';
import { utbetalingTilSykmeldt } from '../../../../featureToggles';

export type Filter<T> = {
    label: string;
    function: (value: T) => boolean;
    active: boolean;
    column: number;
};

type ActiveFiltersPerTab = {
    [key in TabType]: Filter<Oppgave>[];
};

const defaultFilters: Filter<Oppgave>[] = [
    {
        label: 'Ufordelte saker',
        active: false,
        function: (oppgave: Oppgave) => !oppgave.tildeling,
        column: 0,
    },
    {
        label: 'Tildelte saker',
        active: false,
        function: (oppgave: Oppgave) => !!oppgave.tildeling,
        column: 0,
    },
    {
        label: 'Førstegang.',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'førstegangsbehandling',
        column: 1,
    },
    {
        label: 'Forlengelse.',
        active: false,
        function: (oppgave: Oppgave) =>
            oppgave.periodetype === 'forlengelse' || oppgave.periodetype === 'infotrygdforlengelse',
        column: 1,
    },
    {
        label: 'Forlengelse - IT',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'overgangFraIt',
        column: 1,
    },
    {
        label: 'Stikkprøver',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'stikkprøve',
        column: 1,
    },
    {
        label: 'Risk QA',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'riskQa',
        column: 1,
    },
    {
        label: 'Revurdering',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'revurdering',
        column: 1,
    },
    {
        label: 'Én arbeidsgiver',
        active: false,
        function: (oppgave: Oppgave) => oppgave.inntektskilde === 'EN_ARBEIDSGIVER',
        column: 3,
    },
    {
        label: 'Flere arbeidsgivere',
        active: false,
        function: (oppgave: Oppgave) => oppgave.inntektskilde === 'FLERE_ARBEIDSGIVERE',
        column: 3,
    },
    {
        label: 'Fortrolig adr.',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'fortroligAdresse',
        column: 1,
    },
    {
        label: 'Utb. sykmeldt',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'utbetalingTilSykmeldt',
        column: 1,
    },
    {
        label: 'Delvis refusjon',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'delvisRefusjon',
        column: 1,
    },
].filter((item) => utbetalingTilSykmeldt || (item.label != 'Utb. sykmeldt' && item.label != 'Delvis refusjon'));

const makeFilterActive = (targetFilterLabel: string) => (it: Filter<Oppgave>) =>
    it.label === targetFilterLabel ? { ...it, active: true } : it;

const activeFiltersPerTab = atom<ActiveFiltersPerTab>({
    key: 'activeFiltersPerTab',
    default: {
        [TabType.TilGodkjenning]: defaultFilters.map(makeFilterActive('Ufordelte saker')),
        [TabType.Mine]: defaultFilters,
        [TabType.Ventende]: defaultFilters,
    },
});

const filtersState = selector<Filter<Oppgave>[]>({
    key: 'filtersState',
    get: ({ get }) => {
        const tab = get(tabState);
        return get(activeFiltersPerTab)[tab];
    },
    set: ({ get, set }, newValue) => {
        const tab = get(tabState);
        set(activeFiltersPerTab, (filters) => ({ ...filters, [tab]: newValue }));
    },
});

export const useFilters = () => useRecoilValue(filtersState);

export const useSetMultipleFilters = () => {
    const setFilters = useSetRecoilState(filtersState);
    return (state: boolean, ...labels: string[]) => {
        setFilters((filters) => filters.map((it) => (labels.includes(it.label) ? { ...it, active: state } : it)));
    };
};

export const useToggleFilter = () => {
    const setFilters = useSetRecoilState(filtersState);
    return (label: string) =>
        setFilters((filters) => filters.map((it) => (it.label === label ? { ...it, active: !it.active } : it)));
};
