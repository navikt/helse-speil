import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { Egenskap } from '@io/graphql';
import { harSpesialsaktilgang } from '@utils/featureToggles';

import { TabType, tabState } from '../../tabState';

export type Filter = {
    key: string | Egenskap;
    label: string;
    active: boolean;
    column: Oppgaveoversiktkolonne;
};

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

export const defaultFilters: Filter[] = [
    {
        key: 'UFORDELTE_SAKER',
        label: 'Ufordelte saker',
        active: false,
        column: Oppgaveoversiktkolonne.TILDELING,
    },
    {
        key: 'TILDELTE_SAKER',
        label: 'Tildelte saker',
        active: false,
        column: Oppgaveoversiktkolonne.TILDELING,
    },
    {
        key: Egenskap.PaVent,
        label: 'På vent',
        active: false,
        column: Oppgaveoversiktkolonne.PÅVENT,
    },
    {
        key: 'IKKE_PA_VENT',
        label: 'Ikke på vent',
        active: false,
        column: Oppgaveoversiktkolonne.PÅVENT,
    },
    {
        key: Egenskap.Beslutter,
        label: 'Beslutter',
        active: false,
        column: Oppgaveoversiktkolonne.STATUS,
    },
    {
        key: Egenskap.Retur,
        label: 'Retur',
        active: false,
        column: Oppgaveoversiktkolonne.STATUS,
    },
    {
        key: Egenskap.Forstegangsbehandling,
        label: 'Førstegangsbehandling',
        active: false,
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: Egenskap.Forlengelse,
        label: 'Forlengelse',
        active: false,
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: Egenskap.OvergangFraIt,
        label: 'Forlengelse - IT',
        active: false,
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: Egenskap.Soknad,
        label: 'Søknad',
        active: false,
        column: Oppgaveoversiktkolonne.OPPGAVETYPE,
    },
    {
        key: Egenskap.Revurdering,
        label: 'Revurdering',
        active: false,
        column: Oppgaveoversiktkolonne.OPPGAVETYPE,
    },
    {
        key: Egenskap.UtbetalingTilSykmeldt,
        label: 'Sykmeldt',
        active: false,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.UtbetalingTilArbeidsgiver,
        label: 'Arbeidsgiver',
        active: false,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.DelvisRefusjon,
        label: 'Begge',
        active: false,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.IngenUtbetaling,
        label: 'Ingen mottaker',
        active: false,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.Haster,
        label: 'Haster',
        active: false,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Vergemal,
        label: 'Vergemål',
        active: false,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Utland,
        label: 'Utland',
        active: false,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.EgenAnsatt,
        label: 'Egen ansatt',
        active: false,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Fullmakt,
        label: 'Fullmakt',
        active: false,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Stikkprove,
        label: 'Stikkprøve',
        active: false,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.RiskQa,
        label: 'Risk QA',
        active: false,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },

    {
        key: Egenskap.FortroligAdresse,
        label: 'Fortrolig adresse',
        active: false,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Skjonnsfastsettelse,
        label: 'Skjønnsfastsettelse',
        active: false,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Spesialsak,
        label: '🌰',
        active: false,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'INGEN_EGENSKAPER',
        label: 'Ingen egenskaper',
        active: false,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.EnArbeidsgiver,
        label: 'En arbeidsgiver',
        active: false,
        column: Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD,
    },
    {
        key: Egenskap.FlereArbeidsgivere,
        label: 'Flere arbeidsgivere',
        active: false,
        column: Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD,
    },
].filter((filter) => filter.label !== '🌰' || harSpesialsaktilgang);

const storageKeyForFilters = (tab: TabType) => 'filtereForTab_' + tab;

const hentValgteFiltre = (tab: TabType, defaultFilters: Filter[]) => {
    const filters = localStorage.getItem(storageKeyForFilters(tab));
    if (filters == null && tab === TabType.TilGodkjenning)
        return defaultFilters.map(makeFilterActive('Ufordelte saker'));
    if (filters == null && tab === TabType.Mine) return defaultFilters.map(makeFilterActive('Ikke på vent'));
    if (filters == null) {
        return defaultFilters;
    }

    const aktiveFiltre = JSON.parse(filters);

    return defaultFilters.map((f) => {
        return aktiveFiltre.includes(f.key) ? { ...f, active: true } : f;
    });
};

const makeFilterActive = (targetFilterLabel: string) => (it: Filter) =>
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

const filtersState = selector<Filter[]>({
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

export const filterEndret = atom<boolean>({
    key: 'filterEndret',
    default: false,
});

export const useFilters = () => ({
    allFilters: useRecoilValue(filtersState),
    activeFilters: useRecoilValue(filtersState).filter((filter) => filter.active),
});

export const useSetMultipleFilters = () => {
    const setFilters = useSetRecoilState(filtersState);
    const setFilterEndret = useSetRecoilState(filterEndret);
    return (state: boolean, ...labels: string[]) => {
        setFilters((filters) => filters.map((it) => (labels.includes(it.label) ? { ...it, active: state } : it)));
        setFilterEndret(true);
    };
};

export const useToggleFilter = () => {
    const setFilters = useSetRecoilState(filtersState);
    const setFilterEndret = useSetRecoilState(filterEndret);
    return (label: string) => {
        setFilters((filters) => filters.map((it) => (it.label === label ? { ...it, active: !it.active } : it)));
        setFilterEndret(true);
    };
};
