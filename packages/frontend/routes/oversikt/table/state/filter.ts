import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { Egenskap, Kategori, OppgaveTilBehandling } from '@io/graphql';
import { harSpesialsaktilgang } from '@utils/featureToggles';

import { TabType, tabState } from '../../tabState';

export type Filter<T> = {
    key: string | Egenskap;
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
        key: Egenskap.Forstegangsbehandling,
        label: 'Førstegangsbehandling',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Forstegangsbehandling]),
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: Egenskap.Forlengelse,
        label: 'Forlengelse',
        active: false,
        function: (oppgave: OppgaveTilBehandling) =>
            egenskaperInneholder(oppgave, [Egenskap.Forlengelse, Egenskap.Infotrygdforlengelse]),
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: Egenskap.OvergangFraIt,
        label: 'Forlengelse - IT',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.OvergangFraIt]),
        column: Oppgaveoversiktkolonne.PERIODETYPE,
    },
    {
        key: Egenskap.Soknad,
        label: 'Søknad',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Soknad]),
        column: Oppgaveoversiktkolonne.OPPGAVETYPE,
    },
    {
        key: Egenskap.Revurdering,
        label: 'Revurdering',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Revurdering]),
        column: Oppgaveoversiktkolonne.OPPGAVETYPE,
    },
    {
        key: Egenskap.UtbetalingTilSykmeldt,
        label: 'Sykmeldt',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.UtbetalingTilSykmeldt]),
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.UtbetalingTilArbeidsgiver,
        label: 'Arbeidsgiver',
        active: false,
        function: (oppgave: OppgaveTilBehandling) =>
            egenskaperInneholder(oppgave, [Egenskap.UtbetalingTilArbeidsgiver]),
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.DelvisRefusjon,
        label: 'Begge',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.DelvisRefusjon]),
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.IngenUtbetaling,
        label: 'Ingen mottaker',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.IngenUtbetaling]),
        column: Oppgaveoversiktkolonne.MOTTAKER,
    },
    {
        key: Egenskap.Beslutter,
        label: 'Beslutter',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Beslutter]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Retur,
        label: 'Retur',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Retur]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Haster,
        label: 'Haster',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Haster]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Vergemal,
        label: 'Vergemål',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Vergemal]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Utland,
        label: 'Utland',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Utland]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.EgenAnsatt,
        label: 'Egen ansatt',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.EgenAnsatt]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Fullmakt,
        label: 'Fullmakt',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Fullmakt]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Stikkprove,
        label: 'Stikkprøve',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Stikkprove]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.RiskQa,
        label: 'Risk QA',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.RiskQa]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },

    {
        key: Egenskap.FortroligAdresse,
        label: 'Fortrolig adresse',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.FortroligAdresse]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Skjonnsfastsettelse,
        label: 'Skjønnsfastsettelse',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.Skjonnsfastsettelse]),
        column: Oppgaveoversiktkolonne.EGENSKAPER,
    },
    {
        key: Egenskap.Spesialsak,
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
        key: Egenskap.EnArbeidsgiver,
        label: 'En arbeidsgiver',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.EnArbeidsgiver]),
        column: Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD,
    },
    {
        key: Egenskap.FlereArbeidsgivere,
        label: 'Flere arbeidsgivere',
        active: false,
        function: (oppgave: OppgaveTilBehandling) => egenskaperInneholder(oppgave, [Egenskap.FlereArbeidsgivere]),
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
