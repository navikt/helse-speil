import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { OppgaveForOversiktsvisning, Oppgavetype, Periodetype } from '@io/graphql';

import { TabType, tabState } from '../../Tabs';

export type Filter<T> = {
    key: string;
    label: string;
    function: (value: T) => boolean;
    active: boolean;
    column: number;
};

type ActiveFiltersPerTab = {
    [key in TabType]: Filter<OppgaveForOversiktsvisning>[];
};

const defaultFilters: Filter<OppgaveForOversiktsvisning>[] = [
    {
        key: 'UFORDELTE_SAKER',
        label: 'Ufordelte saker',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => !oppgave.tildeling,
        column: 0,
    },
    {
        key: 'TILDELTE_SAKER',
        label: 'Tildelte saker',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => !!oppgave.tildeling,
        column: 0,
    },
    {
        key: 'FØRSTEGANG',
        label: 'Førstegang.',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.periodetype === Periodetype.Forstegangsbehandling,
        column: 1,
    },
    {
        key: 'FORLENGELSE',
        label: 'Forlengelse.',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) =>
            oppgave.periodetype === Periodetype.Forlengelse || oppgave.periodetype === Periodetype.Infotrygdforlengelse,
        column: 1,
    },
    {
        key: 'FORLENGELSE_IT',
        label: 'Forlengelse - IT',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.periodetype === Periodetype.OvergangFraIt,
        column: 1,
    },
    {
        key: 'SØKNAD',
        label: 'Søknad',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.type === Oppgavetype.Soknad,
        column: 2,
    },
    {
        key: 'STIKKPRØVER',
        label: 'Stikkprøver',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.type === Oppgavetype.Stikkprove,
        column: 2,
    },
    {
        key: 'RISK_QA',
        label: 'Risk QA',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.type === Oppgavetype.RiskQa,
        column: 2,
    },
    {
        key: 'REVURDERING',
        label: 'Revurdering',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.type === Oppgavetype.Revurdering,
        column: 2,
    },
    {
        key: 'BESLUTTER',
        label: 'Beslutter',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.erBeslutter,
        column: 3,
    },
    {
        key: 'RETUR',
        label: 'Retur',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.erRetur,
        column: 3,
    },
    {
        key: 'INGEN_EGENSKAPER',
        label: 'Ingen',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => !oppgave.erRetur && !oppgave.erBeslutter,
        column: 3,
    },
    {
        key: 'EN_ARBEIDSGIVER',
        label: 'Én arbeidsgiver',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => !oppgave.flereArbeidsgivere,
        column: 5,
    },
    {
        key: 'FLERE_ARBEIDSGIVERE',
        label: 'Flere arbeidsgivere',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.flereArbeidsgivere,
        column: 5,
    },
    {
        key: 'FORTROLIG_ADR',
        label: 'Fortrolig adr.',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.type === Oppgavetype.FortroligAdresse,
        column: 2,
    },
    {
        key: 'UTB_SYKMELDT',
        label: 'Utb. sykmeldt',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.type === Oppgavetype.UtbetalingTilSykmeldt,
        column: 2,
    },
    {
        key: 'DELVIS_REFUSJON',
        label: 'Delvis refusjon',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.type === Oppgavetype.DelvisRefusjon,
        column: 2,
    },
];

const storageKeyForFilters = (tab: TabType) => 'filtereForTab_' + tab;

const hentValgteFiltre = (tab: TabType, defaultFilters: Filter<OppgaveForOversiktsvisning>[]) => {
    const filters = sessionStorage.getItem(storageKeyForFilters(tab));
    if (filters == null) return defaultFilters;

    const aktiveFiltre = JSON.parse(filters);

    return defaultFilters.map((f) => {
        return aktiveFiltre.includes(f.key) ? { ...f, active: true } : f;
    });
};

const makeFilterActive = (targetFilterLabel: string) => (it: Filter<OppgaveForOversiktsvisning>) =>
    it.label === targetFilterLabel ? { ...it, active: true } : it;

const allFilters = atom<ActiveFiltersPerTab>({
    key: 'activeFiltersPerTab',
    default: {
        [TabType.TilGodkjenning]: hentValgteFiltre(
            TabType.TilGodkjenning,
            defaultFilters.map(makeFilterActive('Ufordelte saker'))
        ),
        [TabType.Mine]: hentValgteFiltre(TabType.Mine, defaultFilters),
        [TabType.Ventende]: hentValgteFiltre(TabType.Ventende, defaultFilters),
        [TabType.BehandletIdag]: [],
    },
});

const filtersState = selector<Filter<OppgaveForOversiktsvisning>[]>({
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
