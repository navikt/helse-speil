import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { FetchOppgaverQuery, Mottaker, OppgaveForOversiktsvisning, Oppgavetype, Periodetype } from '@io/graphql';

import { TabType, tabState } from '../../tabState';

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

export const defaultFilters: Filter<OppgaveForOversiktsvisning>[] = [
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
        label: 'Førstegangsbehandling',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.periodetype === Periodetype.Forstegangsbehandling,
        column: 1,
    },
    {
        key: 'FORLENGELSE',
        label: 'Forlengelse',
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
        function: (oppgave: OppgaveForOversiktsvisning) =>
            oppgave.type === Oppgavetype.Soknad ||
            oppgave.type === Oppgavetype.UtbetalingTilSykmeldt ||
            oppgave.type === Oppgavetype.DelvisRefusjon,
        column: 2,
    },
    {
        key: 'STIKKPRØVER',
        label: 'Stikkprøve',
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
        key: 'SYKMELDT_MOTTAKER',
        label: 'Sykmeldt',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.mottaker === Mottaker.Sykmeldt,
        column: 3,
    },
    {
        key: 'ARBEIDSGIVER_MOTTAKER',
        label: 'Arbeidsgiver',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.mottaker === Mottaker.Arbeidsgiver,
        column: 3,
    },
    {
        key: 'BEGGE_MOTTAKER',
        label: 'Begge',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.mottaker === Mottaker.Begge,
        column: 3,
    },
    {
        key: 'INGEN_MOTTAKER',
        label: 'Ingen mottaker',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.mottaker === null,
        column: 3,
    },
    {
        key: 'BESLUTTER',
        label: 'Beslutter',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.totrinnsvurdering?.erBeslutteroppgave === true,
        column: 4,
    },
    {
        key: 'RETUR',
        label: 'Retur',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.totrinnsvurdering?.erRetur === true,
        column: 4,
    },
    {
        key: 'HASTER',
        label: 'Haster',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.haster === true,
        column: 4,
    },
    {
        key: 'VERGEMÅL',
        label: 'Vergemål',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.harVergemal === true,
        column: 4,
    },
    {
        key: 'UTLAND',
        label: 'Utland',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.tilhorerEnhetUtland === true,
        column: 4,
    },
    {
        key: 'NØTTESAK',
        label: '🌰',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.spesialsak === true,
        column: 4,
    },
    {
        key: 'INGEN_EGENSKAPER',
        label: 'Ingen egenskaper',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) =>
            !(oppgave.totrinnsvurdering?.erRetur ?? false) &&
            !(oppgave.totrinnsvurdering?.erBeslutteroppgave ?? false) &&
            !oppgave.haster &&
            !oppgave.harVergemal &&
            !oppgave.tilhorerEnhetUtland &&
            !oppgave.spesialsak,
        column: 4,
    },
    {
        key: 'EN_ARBEIDSGIVER',
        label: 'En arbeidsgiver',
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
        label: 'Fortrolig adresse',
        active: false,
        function: (oppgave: OppgaveForOversiktsvisning) => oppgave.type === Oppgavetype.FortroligAdresse,
        column: 2,
    },
];

const groupFiltersByColumn = (
    filters: Filter<OppgaveForOversiktsvisning>[],
): Filter<OppgaveForOversiktsvisning>[][] => {
    const groups = filters.reduce(
        (
            groups: { [key: string]: Filter<OppgaveForOversiktsvisning>[] },
            filter: Filter<OppgaveForOversiktsvisning>,
        ) => {
            const key = `${filter.column}`;
            return groups[key] ? { ...groups, [key]: [...groups[key], filter] } : { ...groups, [key]: [filter] };
        },
        {},
    );

    return Object.values(groups);
};

export const filterRows = (
    activeFilters: Filter<OppgaveForOversiktsvisning>[],
    oppgaver: FetchOppgaverQuery['alleOppgaver'],
) => {
    const groupedFilters = groupFiltersByColumn(activeFilters);

    return activeFilters.length > 0
        ? (oppgaver.filter((oppgave) =>
              groupedFilters.every((it) => it.some((it) => it.function(oppgave as OppgaveForOversiktsvisning))),
          ) as Array<OppgaveForOversiktsvisning>)
        : (oppgaver as Array<OppgaveForOversiktsvisning>);
};

const storageKeyForFilters = (tab: TabType) => 'filtereForTab_' + tab;

const hentValgteFiltre = (tab: TabType, defaultFilters: Filter<OppgaveForOversiktsvisning>[]) => {
    const filters = localStorage.getItem(storageKeyForFilters(tab));
    if (filters == null && tab === TabType.TilGodkjenning)
        return defaultFilters.map(makeFilterActive('Ufordelte saker'));
    if (filters == null) {
        return defaultFilters;
    }

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
        [TabType.TilGodkjenning]: hentValgteFiltre(TabType.TilGodkjenning, defaultFilters),
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
            localStorage.setItem(storageKeyForFilters(tab), JSON.stringify(aktiveFiltre));
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
