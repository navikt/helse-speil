import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { tabState, TabType } from '../../Tabs';
import { utbetalingTilSykmeldt } from '@utils/featureToggles';

export type Filter<T> = {
    key: string;
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
        key: 'UFORDELTE_SAKER',
        label: 'Ufordelte saker',
        active: false,
        function: (oppgave: Oppgave) => !oppgave.tildeling,
        column: 0,
    },
    {
        key: 'TILDELTE_SAKER',
        label: 'Tildelte saker',
        active: false,
        function: (oppgave: Oppgave) => !!oppgave.tildeling,
        column: 0,
    },
    {
        key: 'FØRSTEGANG',
        label: 'Førstegang.',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'førstegangsbehandling',
        column: 1,
    },
    {
        key: 'FORLENGELSE',
        label: 'Forlengelse.',
        active: false,
        function: (oppgave: Oppgave) =>
            oppgave.periodetype === 'forlengelse' || oppgave.periodetype === 'infotrygdforlengelse',
        column: 1,
    },
    {
        key: 'FORLENGELSE_IT',
        label: 'Forlengelse - IT',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'overgangFraIt',
        column: 1,
    },
    {
        key: 'STIKKPRØVER',
        label: 'Stikkprøver',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'stikkprøve',
        column: 1,
    },
    {
        key: 'RISK_QA',
        label: 'Risk QA',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'riskQa',
        column: 1,
    },
    {
        key: 'REVURDERING',
        label: 'Revurdering',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'revurdering',
        column: 1,
    },
    {
        key: 'BESLUTTER',
        label: 'Beslutter',
        active: false,
        function: (oppgave: Oppgave) => oppgave.erBeslutterOppgave,
        column: 1,
    },
    {
        key: 'RETUR',
        label: 'Retur',
        active: false,
        function: (oppgave: Oppgave) => oppgave.erReturOppgave,
        column: 1,
    },
    {
        key: 'EN_ARBEIDSGIVER',
        label: 'Én arbeidsgiver',
        active: false,
        function: (oppgave: Oppgave) => oppgave.inntektskilde === 'EN_ARBEIDSGIVER',
        column: 3,
    },
    {
        key: 'FLERE_ARBEIDSGIVERE',
        label: 'Flere arbeidsgivere',
        active: false,
        function: (oppgave: Oppgave) => oppgave.inntektskilde === 'FLERE_ARBEIDSGIVERE',
        column: 3,
    },
    {
        key: 'FORTROLIG_ADR',
        label: 'Fortrolig adr.',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'fortroligAdresse',
        column: 1,
    },
    {
        key: 'UTB_SYKMELDT',
        label: 'Utb. sykmeldt',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'utbetalingTilSykmeldt',
        column: 1,
    },
    {
        key: 'DELVIS_REFUSJON',
        label: 'Delvis refusjon',
        active: false,
        function: (oppgave: Oppgave) => oppgave.periodetype === 'delvisRefusjon',
        column: 1,
    },
].filter((item) => utbetalingTilSykmeldt || (item.label != 'Utb. sykmeldt' && item.label != 'Delvis refusjon'));

const storageKeyForFilters = (tab: TabType) => 'filtereForTab_' + tab;

const hentValgteFiltre = (tab: TabType, defaultFilters: Filter<Oppgave>[]) => {
    const filters = sessionStorage.getItem(storageKeyForFilters(tab));
    if (filters == null) return defaultFilters;

    const aktiveFiltre = JSON.parse(filters);

    return defaultFilters.map((f) => {
        return aktiveFiltre.includes(f.key) ? { ...f, active: true } : f;
    });
};

const makeFilterActive = (targetFilterLabel: string) => (it: Filter<Oppgave>) =>
    it.label === targetFilterLabel ? { ...it, active: true } : it;

const allFilters = atom<ActiveFiltersPerTab>({
    key: 'activeFiltersPerTab',
    default: {
        [TabType.TilGodkjenning]: hentValgteFiltre(
            TabType.TilGodkjenning,
            defaultFilters.map(makeFilterActive('Ufordelte saker')),
        ),
        [TabType.Mine]: hentValgteFiltre(TabType.Mine, defaultFilters),
        [TabType.Ventende]: hentValgteFiltre(TabType.Ventende, defaultFilters),
    },
});

const filtersState = selector<Filter<Oppgave>[]>({
    key: 'filtersState',
    get: ({ get }) => {
        const tab = get(tabState);
        return get(allFilters)[tab];
    },
    set: ({ get, set }, newValue) => {
        const tab = get(tabState);

        if (Array.isArray(newValue)) {
            const aktiveFiltre = newValue.filter((f) => f.active).map((f) => f.key);
            sessionStorage.setItem(storageKeyForFilters(tab), JSON.stringify(aktiveFiltre));
        }

        set(allFilters, (filters) => ({ ...filters, [tab]: newValue }));
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
