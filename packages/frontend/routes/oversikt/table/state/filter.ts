import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import {
    AntallArbeidsforhold,
    Egenskap,
    Kategori,
    Mottaker,
    OppgaveTilBehandling,
    OppgaverQuery,
    Oppgavetype,
    Periodetype,
} from '@io/graphql';
import { harSpesialsaktilgang } from '@utils/featureToggles';

import { TabType, tabState } from '../../tabState';

export type Filter<T> = {
    key: string;
    label: string;
    function: (value: T) => boolean;
    active: boolean;
    column: number;
};

type ActiveFiltersPerTab = {
    [key in TabType]: Filter<OppgaveTilBehandling>[];
};

export const defaultFilters: Filter<OppgaveTilBehandling>[] = [
    {
        key: 'UFORDELTE_SAKER',
        label: 'Ufordelte saker',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => !oppgave.tildeling,
        column: 0,
    },
    {
        key: 'TILDELTE_SAKER',
        label: 'Tildelte saker',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => !!oppgave.tildeling,
        column: 0,
    },
    {
        key: 'FØRSTEGANG',
        label: 'Førstegangsbehandling',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.periodetype === Periodetype.Forstegangsbehandling,
        column: 1,
    },
    {
        key: 'FORLENGELSE',
        label: 'Forlengelse',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.periodetype === Periodetype.Forlengelse,
        column: 1,
    },
    {
        key: 'FORLENGELSE_IT',
        label: 'Forlengelse - IT',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.periodetype === Periodetype.Infotrygdforlengelse,
        column: 1,
    },
    {
        key: 'SØKNAD',
        label: 'Søknad',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.oppgavetype === Oppgavetype.Soknad,
        column: 2,
    },
    {
        key: 'REVURDERING',
        label: 'Revurdering',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.oppgavetype === Oppgavetype.Revurdering,
        column: 2,
    },
    {
        key: 'STIKKPRØVER',
        label: 'Stikkprøve',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Stikkprove]),
        column: 2,
    },
    {
        key: 'RISK_QA',
        label: 'Risk QA',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.RiskQa]),
        column: 2,
    },

    {
        key: 'FORTROLIG_ADR',
        label: 'Fortrolig adresse',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.FortroligAdresse]),
        column: 2,
    },
    {
        key: 'SYKMELDT_MOTTAKER',
        label: 'Sykmeldt',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.mottaker === Mottaker.Sykmeldt,
        column: 3,
    },
    {
        key: 'ARBEIDSGIVER_MOTTAKER',
        label: 'Arbeidsgiver',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.mottaker === Mottaker.Arbeidsgiver,
        column: 3,
    },
    {
        key: 'BEGGE_MOTTAKER',
        label: 'Begge',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.mottaker === Mottaker.Begge,
        column: 3,
    },
    {
        key: 'INGEN_MOTTAKER',
        label: 'Ingen mottaker',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.mottaker === Mottaker.Ingen,
        column: 3,
    },
    {
        key: 'BESLUTTER',
        label: 'Beslutter',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Beslutter]),
        column: 4,
    },
    {
        key: 'RETUR',
        label: 'Retur',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Retur]),
        column: 4,
    },
    {
        key: 'HASTER',
        label: 'Haster',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Haster]),
        column: 4,
    },
    {
        key: 'VERGEMÅL',
        label: 'Vergemål',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Vergemal]),
        column: 4,
    },
    {
        key: 'UTLAND',
        label: 'Utland',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Utland]),
        column: 4,
    },
    {
        key: 'EGEN_ANSATT',
        label: 'Egen ansatt',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.EgenAnsatt]),
        column: 4,
    },
    {
        key: 'FULLMAKT',
        label: 'Fullmakt',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Fullmakt]),
        column: 4,
    },
    {
        key: 'NØTTESAK',
        label: '🌰',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Spesialsak]),
        column: 4,
    },
    {
        key: 'INGEN_EGENSKAPER',
        label: 'Ingen egenskaper',
        active: false,
        function: (oppgave: OppgaveTilBehandling) =>
            egenskaperMedKategori(oppgave, Kategori.Ukategorisert).length === 0,
        column: 4,
    },
    {
        key: 'EN_ARBEIDSGIVER',
        label: 'En arbeidsgiver',
        active: false,
        function: (oppgave: OppgaveTilBehandling) =>
            oppgave.antallArbeidsforhold === AntallArbeidsforhold.EtArbeidsforhold,
        column: 5,
    },
    {
        key: 'FLERE_ARBEIDSGIVERE',
        label: 'Flere arbeidsgivere',
        active: false,
        function: (oppgave: OppgaveTilBehandling) =>
            oppgave.antallArbeidsforhold === AntallArbeidsforhold.FlereArbeidsforhold,
        column: 5,
    },
].filter((filter) => filter.label !== '🌰' || harSpesialsaktilgang);

const groupFiltersByColumn = (filters: Filter<OppgaveTilBehandling>[]): Filter<OppgaveTilBehandling>[][] => {
    const groups = filters.reduce(
        (groups: { [key: string]: Filter<OppgaveTilBehandling>[] }, filter: Filter<OppgaveTilBehandling>) => {
            const key = `${filter.column}`;
            return groups[key] ? { ...groups, [key]: [...groups[key], filter] } : { ...groups, [key]: [filter] };
        },
        {},
    );

    return Object.values(groups);
};

const egenskaperInneholder = (oppgave: OppgaveTilBehandling, egenskaper: Egenskap[]) =>
    oppgave.egenskaper.some(({ egenskap }) => egenskaper.includes(egenskap));

const egenskaperMedKategori = (oppgave: OppgaveTilBehandling, medKategori: Kategori) =>
    oppgave.egenskaper.filter(({ kategori }) => kategori === medKategori);

export const filterRows = (activeFilters: Filter<OppgaveTilBehandling>[], oppgaver: OppgaverQuery['oppgaver']) => {
    const groupedFilters = groupFiltersByColumn(activeFilters);

    return activeFilters.length > 0
        ? (oppgaver.filter((oppgave) =>
              groupedFilters.every((it) => it.some((it) => it.function(oppgave as OppgaveTilBehandling))),
          ) as Array<OppgaveTilBehandling>)
        : (oppgaver as Array<OppgaveTilBehandling>);
};

const storageKeyForFilters = (tab: TabType) => 'filtereForTab_' + tab;

const hentValgteFiltre = (tab: TabType, defaultFilters: Filter<OppgaveTilBehandling>[]) => {
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

const makeFilterActive = (targetFilterLabel: string) => (it: Filter<OppgaveTilBehandling>) =>
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

const filtersState = selector<Filter<OppgaveTilBehandling>[]>({
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
