import { SetRecoilState, atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { Egenskap } from '@io/graphql';
import { TabType, tabState } from '@oversikt/tabState';
import { harSpesialsaktilgang, kanFiltrerePåGosysEgenskap, kanSeTilkommenInntekt } from '@utils/featureToggles';

export type Filter = {
    key: string | Egenskap;
    label: string;
    status: FilterStatus;
    column: Oppgaveoversiktkolonne;
};

export enum FilterStatus {
    ON = 'ON',
    OFF = 'OFF',
    OUT = 'OUT',
}

export enum Oppgaveoversiktkolonne {
    TILDELING = 'TILDELING',
    PÅVENT = 'PÅVENT',
    STATUS = 'STATUS',
    PERIODETYPE = 'PERIODETYPE',
    OPPGAVETYPE = 'OPPGAVETYPE',
    MOTTAKER = 'MOTTAKER',
    EGENSKAPER = 'EGENSKAPER',
    ANTALLARBEIDSFORHOLD = 'ANTALLARBEIDSFORHOLD',
}

type ActiveFiltersPerTab = {
    [key in TabType]: Filter[];
};

const filters = [
    {
        key: 'TILDELTE_SAKER',
        label: 'Tildelte saker',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.TILDELING,
    },
    {
        key: Egenskap.PaVent,
        label: 'På vent',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.PÅVENT,
    },
    {
        key: Egenskap.Beslutter,
        label: 'Beslutter',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.STATUS,
    },
    {
        key: Egenskap.Retur,
        label: 'Retur',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.STATUS,
    },
    {
        key: Egenskap.Forstegangsbehandling,
        label: 'Førstegangsbehandling',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: Egenskap.Forlengelse,
        label: 'Forlengelse',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: Egenskap.OvergangFraIt,
        label: 'Forlengelse - IT',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: Egenskap.Soknad,
        label: 'Søknad',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.OPPGAVETYPE,
    },
    {
        key: Egenskap.Revurdering,
        label: 'Revurdering',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.OPPGAVETYPE,
    },
    {
        key: Egenskap.UtbetalingTilSykmeldt,
        label: 'Sykmeldt',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.UtbetalingTilArbeidsgiver,
        label: 'Arbeidsgiver',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.DelvisRefusjon,
        label: 'Begge',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.IngenUtbetaling,
        label: 'Ingen mottaker',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.Haster,
        label: 'Haster',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Vergemal,
        label: 'Vergemål',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Utland,
        label: 'Utland',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.EgenAnsatt,
        label: 'Egen ansatt',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Stikkprove,
        label: 'Stikkprøve',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.RiskQa,
        label: 'Risk QA',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },

    {
        key: Egenskap.FortroligAdresse,
        label: 'Fortrolig adresse',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Skjonnsfastsettelse,
        label: 'Skjønnsfastsettelse',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Tilbakedatert,
        label: 'Tilbakedatert',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Medlemskap,
        label: 'Medlemskap',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Gosys,
        label: 'Gosysvarsel',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Tilkommen,
        label: 'Tilkommen inntekt',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Spesialsak,
        label: '🌰',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.EnArbeidsgiver,
        label: 'En arbeidsgiver',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD,
    },
    {
        key: Egenskap.FlereArbeidsgivere,
        label: 'Flere arbeidsgivere',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD,
    },
];

export const getDefaultFilters = (grupper: string[], ident: string): Filter[] =>
    filters
        .filter((filter) => filter.key !== 'SPESIALSAK' || harSpesialsaktilgang(grupper))
        .filter((filter) => filter.key !== 'GOSYS' || kanFiltrerePåGosysEgenskap(ident, grupper))
        .filter((filter) => filter.key !== 'TILKOMMEN' || kanSeTilkommenInntekt(ident, grupper));

const storageKeyForFilters = (tab: TabType) => 'filtereForTab_' + tab;

const hentValgteFiltre = (tab: TabType, defaultFilters: Filter[]): Filter[] => {
    const filters = localStorage.getItem(storageKeyForFilters(tab));
    if (filters == null && tab === TabType.TilGodkjenning) return defaultFilters.map(filterOut('TILDELTE_SAKER'));
    if (filters == null && tab === TabType.Mine) return defaultFilters.map(filterOut('PA_VENT'));
    if (filters == null) {
        return defaultFilters;
    }

    const activeFilters: Filter[] = JSON.parse(filters);

    return defaultFilters.map(
        (defaultFilter) =>
            activeFilters.find((activeFilter) => defaultFilter.key === activeFilter.key) || defaultFilter,
    );
};

const filterOut = (key: string) => (it: Filter) => (it.key === key ? { ...it, status: FilterStatus.OUT } : it);

const allFilters = atom<ActiveFiltersPerTab>({
    key: 'activeFiltersPerTab',
    default: {
        [TabType.TilGodkjenning]: [],
        [TabType.Mine]: [],
        [TabType.Ventende]: [],
        [TabType.BehandletIdag]: [],
    },
});

export const hydrateAllFilters = (set: SetRecoilState, grupper: string[], ident: string) => {
    set(allFilters, (prevState) => ({
        ...prevState,
        [TabType.TilGodkjenning]: hentValgteFiltre(TabType.TilGodkjenning, getDefaultFilters(grupper, ident)),
        [TabType.Mine]: hentValgteFiltre(TabType.Mine, getDefaultFilters(grupper, ident)),
        [TabType.Ventende]: hentValgteFiltre(TabType.Ventende, getDefaultFilters(grupper, ident)),
        [TabType.BehandletIdag]: [],
    }));
};

const filtersState = selector<Filter[]>({
    key: 'filtersState',
    get: ({ get }) => {
        const tab = get(tabState);
        return get(allFilters)[tab];
    },
    set: ({ get, set }, newValue) => {
        const tab = get(tabState);

        if (Array.isArray(newValue)) {
            const aktiveFiltre = newValue.filter((f) => f.status !== FilterStatus.OFF);
            localStorage.setItem(storageKeyForFilters(tab), JSON.stringify(aktiveFiltre));
        }

        set(allFilters, (filters) => ({ ...filters, [tab]: newValue }));
    },
});

export const useFilterEndret = () => useRecoilValue(filterEndretState);
export const useSetFilterIkkeEndret = () => {
    const setFilterEndret = useSetRecoilState(filterEndretState);
    return () => setFilterEndret(false);
};

const filterEndretState = atom<boolean>({
    key: 'filterEndret',
    default: false,
});

export const useFilters = () => ({
    allFilters: useRecoilValue(filtersState),
    activeFilters: useRecoilValue(filtersState).filter((filter) => filter.status !== FilterStatus.OFF),
});

export const useSetMultipleFilters = () => {
    const setFilters = useSetRecoilState(filtersState);
    const setFilterEndret = useSetRecoilState(filterEndretState);
    return (filterStatus: FilterStatus, ...keys: string[]) => {
        setFilters((filters) => filters.map((it) => (keys.includes(it.key) ? { ...it, status: filterStatus } : it)));
        setFilterEndret(true);
    };
};

export const useToggleFilter = () => {
    const setFilters = useSetRecoilState(filtersState);
    const setFilterEndret = useSetRecoilState(filterEndretState);
    return (key: string, status: FilterStatus) => {
        setFilters((filters) => filters.map((it) => (it.key === key ? { ...it, status } : it)));
        setFilterEndret(true);
    };
};
