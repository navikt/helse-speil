import { WritableAtom, atom, useAtom, useAtomValue } from 'jotai';
import { SetStateAction } from 'react';

import { ApiAktivSaksbehandler, ApiEgenskap } from '@io/rest/generated/spesialist.schemas';
import { TabType, tabState } from '@oversikt/tabState';
import { atomWithLocalStorage } from '@state/jotai';

export type Filter = {
    key: string | ApiEgenskap;
    label: string;
    status: FilterStatus;
    column: Oppgaveoversiktkolonne;
};

export enum FilterStatus {
    PLUS = 'PLUS',
    MINUS = 'MINUS',
    OFF = 'OFF',
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
    INNTEKTSFORHOLD = 'INNTEKTSFORHOLD',
}

type FiltersPerTab = {
    [key in TabType]: Filter[];
};

const filters = [
    {
        key: 'TILDELTE_SAKER',
        label: 'Tildelte oppgaver',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.TILDELING,
    },
    {
        key: ApiEgenskap.PA_VENT,
        label: 'På vent',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.PÅVENT,
    },
    {
        key: ApiEgenskap.BESLUTTER,
        label: 'Beslutter',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.STATUS,
    },
    {
        key: ApiEgenskap.RETUR,
        label: 'Retur',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.STATUS,
    },
    {
        key: ApiEgenskap.FORSTEGANGSBEHANDLING,
        label: 'Førstegangsbehandling',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: ApiEgenskap.FORLENGELSE,
        label: 'Forlengelse',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: ApiEgenskap.OVERGANG_FRA_IT,
        label: 'Forlengelse - IT',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: ApiEgenskap.SOKNAD,
        label: 'Søknad',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.OPPGAVETYPE,
    },
    {
        key: ApiEgenskap.REVURDERING,
        label: 'Revurdering',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.OPPGAVETYPE,
    },
    {
        key: ApiEgenskap.UTBETALING_TIL_SYKMELDT,
        label: 'Sykmeldt',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER,
        label: 'Arbeidsgiver',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: ApiEgenskap.DELVIS_REFUSJON,
        label: 'Begge',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: ApiEgenskap.INGEN_UTBETALING,
        label: 'Ingen mottaker',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: ApiEgenskap.HASTER,
        label: 'Haster',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.VERGEMAL,
        label: 'Vergemål',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.UTLAND,
        label: 'Utland',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.EGEN_ANSATT,
        label: 'Egen ansatt',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.STIKKPROVE,
        label: 'Stikkprøve',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.RISK_QA,
        label: 'Risk QA',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },

    {
        key: ApiEgenskap.FORTROLIG_ADRESSE,
        label: 'Fortrolig adresse',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.SKJONNSFASTSETTELSE,
        label: 'Skjønnsfastsettelse',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.TILBAKEDATERT,
        label: 'Tilbakedatert',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.MANGLER_IM,
        label: 'Mangler IM',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.MEDLEMSKAP,
        label: 'Medlemskap',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.GOSYS,
        label: 'Gosysvarsel',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.GRUNNBELOPSREGULERING,
        label: 'Grunnbeløpsregulering',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: ApiEgenskap.EN_ARBEIDSGIVER,
        label: 'Ett inntektsforhold',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD,
    },
    {
        key: ApiEgenskap.FLERE_ARBEIDSGIVERE,
        label: 'Flere inntektsforhold',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD,
    },
    {
        key: ApiEgenskap.SELVSTENDIG_NAERINGSDRIVENDE,
        label: 'Selvstendig',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.INNTEKTSFORHOLD,
    },
    {
        key: ApiEgenskap.ARBEIDSTAKER,
        label: 'Arbeidstaker',
        status: FilterStatus.OFF,
        column: Oppgaveoversiktkolonne.INNTEKTSFORHOLD,
    },
];

export const getDefaultFilters = (): Filter[] => filters.filter((filter) => filter);

const filtersPerTab = atomWithLocalStorage<FiltersPerTab>('filtersPerTab', {
    [TabType.TilGodkjenning]: filters,
    [TabType.Mine]: filters,
    [TabType.Ventende]: filters,
    [TabType.BehandletIdag]: filters,
});

export function hydrateFilters(): [WritableAtom<FiltersPerTab, [SetStateAction<FiltersPerTab>], void>, FiltersPerTab] {
    // Denne er plassert inne i hydrate-funksjonen for å unngå at den blir kalt ifm. server-side rendering
    const hentFiltreForTab = (tab: TabType, defaultFilters: Filter[]): Filter[] => {
        const filtersFromStorage = localStorage.getItem('filtersPerTab');
        if (filtersFromStorage == null) return defaultFilters;

        const filtersForThisTab: Filter[] = JSON.parse(filtersFromStorage)[tab];

        return defaultFilters.map((defaultFilter) => {
            const stored = filtersForThisTab.find((f) => f.key === defaultFilter.key);

            if (!stored) return defaultFilter;

            return {
                ...stored,
                label: stored.label !== defaultFilter.label ? defaultFilter.label : stored.label,
                column: stored.column !== defaultFilter.column ? defaultFilter.column : stored.column,
            };
        });
    };

    return [
        filtersPerTab,
        {
            [TabType.TilGodkjenning]: hentFiltreForTab(TabType.TilGodkjenning, getDefaultFilters()),
            [TabType.Mine]: hentFiltreForTab(TabType.Mine, getDefaultFilters()),
            [TabType.Ventende]: hentFiltreForTab(TabType.Ventende, getDefaultFilters()),
            [TabType.BehandletIdag]: [],
        },
    ];
}

const filtersState = atom(
    (get) => get(filtersPerTab)[get(tabState)],
    (get, set, newFilters: Filter[]) => {
        void set(filtersPerTab, (filters) => ({ ...filters, [get(tabState)]: newFilters }));
    },
);

export const useFilters = () => ({
    allFilters: useAtomValue(filtersState),
    activeFilters: useAtomValue(filtersState).filter((filter) => filter.status !== FilterStatus.OFF),
});

export const useAllFilters = () => useAtomValue(filtersState);

export const useSetMultipleFilters = () => {
    const [filters, setFilters] = useAtom(filtersState);
    return (filterStatus: FilterStatus, ...keys: string[]) => {
        setFilters(filters.map((it) => (keys.includes(it.key) ? { ...it, status: filterStatus } : it)));
    };
};

export const useToggleFilter = () => {
    const [filters, setFilters] = useAtom(filtersState);
    return (key: string, status: FilterStatus, label?: string) => {
        setFilters(
            filters.map((filter) =>
                filter.key === key
                    ? {
                          ...filter,
                          ...(label ? { label } : {}),
                          status,
                      }
                    : filter,
            ),
        );
    };
};

export const valgtSaksbehandlerAtom = atomWithLocalStorage<ApiAktivSaksbehandler | null>(
    'filterValgtSaksbehandler',
    null,
);
