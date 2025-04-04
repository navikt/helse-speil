import { WritableAtom, atom, useAtom, useAtomValue } from 'jotai';
import { SetStateAction } from 'react';

import { Egenskap } from '@io/graphql';
import { TabType, tabState } from '@oversikt/tabState';
import { atomWithLocalStorage } from '@state/jotai';
import { kanFiltrerePåGosysEgenskap, kanSeTilkommenInntekt } from '@utils/featureToggles';

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

type FiltersPerTab = {
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
        key: Egenskap.ManglerIm,
        label: 'Mangler IM',
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
        .filter((filter) => filter.key !== Egenskap.Gosys || kanFiltrerePåGosysEgenskap(ident, grupper))
        .filter((filter) => filter.key !== Egenskap.Tilkommen || kanSeTilkommenInntekt(ident, grupper));

const filtersPerTab = atomWithLocalStorage<FiltersPerTab>('filtersPerTab', {
    [TabType.TilGodkjenning]: filters,
    [TabType.Mine]: filters,
    [TabType.Ventende]: filters,
    [TabType.BehandletIdag]: filters,
});

export function hydrateFilters(
    grupper: string[],
    ident: string,
): [WritableAtom<FiltersPerTab, [SetStateAction<FiltersPerTab>], void>, FiltersPerTab] {
    // Denne er plassert inne i hydrate-funksjonen for å unngå at den blir kalt ifm. server-side rendering
    const hentFiltreForTab = (tab: TabType, defaultFilters: Filter[]): Filter[] => {
        const filtersFromStorage = localStorage.getItem('filtersPerTab');
        if (filtersFromStorage == null) return defaultFilters;

        const filtersForThisTab: Filter[] = JSON.parse(filtersFromStorage)[tab];

        return defaultFilters.map(
            (defaultFilter) => filtersForThisTab.find((filter) => defaultFilter.key === filter.key) || defaultFilter,
        );
    };

    return [
        filtersPerTab,
        {
            [TabType.TilGodkjenning]: hentFiltreForTab(TabType.TilGodkjenning, getDefaultFilters(grupper, ident)),
            [TabType.Mine]: hentFiltreForTab(TabType.Mine, getDefaultFilters(grupper, ident)),
            [TabType.Ventende]: hentFiltreForTab(TabType.Ventende, getDefaultFilters(grupper, ident)),
            [TabType.BehandletIdag]: [],
        },
    ];
}

const filtersState = atom(
    (get) => get(filtersPerTab)[get(tabState)],
    (get, set, newFilters: Filter[]) => {
        set(filtersPerTab, (filters) => ({ ...filters, [get(tabState)]: newFilters }));
    },
);

export const useFilters = () => ({
    allFilters: useAtomValue(filtersState),
    activeFilters: useAtomValue(filtersState).filter((filter) => filter.status !== FilterStatus.OFF),
});

export const useSetMultipleFilters = () => {
    const [filters, setFilters] = useAtom(filtersState);
    return (filterStatus: FilterStatus, ...keys: string[]) => {
        setFilters(filters.map((it) => (keys.includes(it.key) ? { ...it, status: filterStatus } : it)));
    };
};

export const useToggleFilter = () => {
    const [filters, setFilters] = useAtom(filtersState);
    return (key: string, status: FilterStatus) => {
        setFilters(filters.map((it) => (it.key === key ? { ...it, status } : it)));
    };
};
