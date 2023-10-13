import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import {
    AntallArbeidsforhold,
    Egenskap,
    Kategori,
    Mottaker,
    OppgaveTilBehandling,
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
    column: Oppgaveoversiktkolonne;
};

export enum Oppgaveoversiktkolonne {
    TILDELING = 'TILDELING',
    PERIODETYPE = 'PERIODETYPE',
    OPPGAVETYPE = 'OPPGAVETYPE',
    MOTTAKER = 'MOTTAKER',
    EGENSKAPER = 'EGENSKAPER',
    ANTALLARBEIDSFORHOLD = 'ANTALLARBEIDSFORHOLD',
}

type ActiveFiltersPerTab = {
    [key in TabType]: Filter<OppgaveTilBehandling>[];
};

export const defaultFilters: Filter<OppgaveTilBehandling>[] = [
    {
        key: 'UFORDELTE_SAKER',
        label: 'Ufordelte saker',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => !oppgave.tildeling,
        column: Oppgaveoversiktkolonne.TILDELING,
    },
    {
        key: 'TILDELTE_SAKER',
        label: 'Tildelte saker',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => !!oppgave.tildeling,
        column: Oppgaveoversiktkolonne.TILDELING,
    },
    {
        key: 'FØRSTEGANG',
        label: 'Førstegangsbehandling',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.periodetype === Periodetype.Forstegangsbehandling,
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: 'FORLENGELSE',
        label: 'Forlengelse',
        active: false,
        function: (oppgave: OppgaveTilBehandling) =>
            [Periodetype.Forlengelse, Periodetype.Infotrygdforlengelse].includes(oppgave.periodetype),
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: 'FORLENGELSE_IT',
        label: 'Forlengelse - IT',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.periodetype === Periodetype.OvergangFraIt,
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: 'SØKNAD',
        label: 'Søknad',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.oppgavetype === Oppgavetype.Soknad,
        column: Oppgaveoversiktkolonne.OPPGAVETYPE,
    },
    {
        key: 'REVURDERING',
        label: 'Revurdering',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.oppgavetype === Oppgavetype.Revurdering,
        column: Oppgaveoversiktkolonne.OPPGAVETYPE,
    },
    {
        key: 'SYKMELDT_MOTTAKER',
        label: 'Sykmeldt',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.mottaker === Mottaker.Sykmeldt,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: 'ARBEIDSGIVER_MOTTAKER',
        label: 'Arbeidsgiver',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.mottaker === Mottaker.Arbeidsgiver,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: 'BEGGE_MOTTAKER',
        label: 'Begge',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.mottaker === Mottaker.Begge,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: 'INGEN_MOTTAKER',
        label: 'Ingen mottaker',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => oppgave.mottaker === Mottaker.Ingen,
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: 'BESLUTTER',
        label: 'Beslutter',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Beslutter]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'RETUR',
        label: 'Retur',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Retur]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'HASTER',
        label: 'Haster',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Haster]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'VERGEMÅL',
        label: 'Vergemål',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Vergemal]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'UTLAND',
        label: 'Utland',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Utland]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'EGEN_ANSATT',
        label: 'Egen ansatt',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.EgenAnsatt]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'FULLMAKT',
        label: 'Fullmakt',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Fullmakt]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'STIKKPRØVER',
        label: 'Stikkprøve',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Stikkprove]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'RISK_QA',
        label: 'Risk QA',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.RiskQa]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },

    {
        key: 'FORTROLIG_ADR',
        label: 'Fortrolig adresse',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.FortroligAdresse]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'NØTTESAK',
        label: '🌰',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Spesialsak]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'INGEN_EGENSKAPER',
        label: 'Ingen egenskaper',
        active: false,
        function: (oppgave: OppgaveTilBehandling) =>
            egenskaperMedKategori(oppgave, Kategori.Ukategorisert).length === 0,
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: 'EN_ARBEIDSGIVER',
        label: 'En arbeidsgiver',
        active: false,
        function: (oppgave: OppgaveTilBehandling) =>
            oppgave.antallArbeidsforhold === AntallArbeidsforhold.EtArbeidsforhold,
        column: Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD,
    },
    {
        key: 'FLERE_ARBEIDSGIVERE',
        label: 'Flere arbeidsgivere',
        active: false,
        function: (oppgave: OppgaveTilBehandling) =>
            oppgave.antallArbeidsforhold === AntallArbeidsforhold.FlereArbeidsforhold,
        column: Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD,
    },
].filter((filter) => filter.label !== '🌰' || harSpesialsaktilgang);

const groupFiltersByColumn = (filters: Filter<OppgaveTilBehandling>[]) => {
    const groups = filters.reduce(
        (groups: { [key: string]: Filter<OppgaveTilBehandling>[] }, filter: Filter<OppgaveTilBehandling>) => {
            const key = filter.column;
            return groups[key] ? { ...groups, [key]: [...groups[key], filter] } : { ...groups, [key]: [filter] };
        },
        {},
    );

    return Object.entries(groups);
};

const egenskaperInneholder = (oppgave: OppgaveTilBehandling, egenskaper: Egenskap[]) =>
    oppgave.egenskaper.some(({ egenskap }) => egenskaper.includes(egenskap));

const egenskaperMedKategori = (oppgave: OppgaveTilBehandling, medKategori: Kategori) =>
    oppgave.egenskaper.filter(({ kategori }) => kategori === medKategori);

export const filterRows = (activeFilters: Filter<OppgaveTilBehandling>[], oppgaver: OppgaveTilBehandling[]) => {
    const groupedFilters = groupFiltersByColumn(activeFilters);

    return activeFilters.length > 0
        ? (oppgaver.filter((oppgave) =>
              groupedFilters.every(([key, value]) => {
                  if (key === Oppgaveoversiktkolonne.EGENSKAPER)
                      return value.every((it) => it.function(oppgave as OppgaveTilBehandling));
                  return value.some((it) => it.function(oppgave as OppgaveTilBehandling));
              }),
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
