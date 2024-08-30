import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { SortState } from '@navikt/ds-react';

import { ApolloError, useQuery } from '@apollo/client';
import {
    AntallOppgaverDocument,
    Egenskap,
    FiltreringInput,
    Kategori,
    OppgaveFeedDocument,
    OppgaveTilBehandling,
    OppgavesorteringInput,
    Sorteringsnokkel,
} from '@io/graphql';
import { TabType, tabEndret, useAktivTab } from '@oversikt/tabState';
import { Filter, FilterStatus, Oppgaveoversiktkolonne, filterEndret, useFilters } from '@oversikt/table/state/filter';
import { SortKey, sorteringEndret, sortering as sorteringSelector } from '@oversikt/table/state/sortation';
import { InfoAlert } from '@utils/error';

export interface ApolloResponse<T> {
    data?: T;
    error?: ApolloError;
    loading: boolean;
}

export interface OppgaveFeedResponse {
    oppgaver?: OppgaveTilBehandling[];
    error?: ApolloError;
    loading: boolean;
    antallOppgaver: number;
    numberOfPages: number;
    currentPage: number;
    limit: number;
    setPage: (newPage: number) => void;
}

const defaultFiltrering: FiltreringInput = {
    egenskaper: [],
    ekskluderteEgenskaper: [],
    ingenUkategoriserteEgenskaper: false,
    tildelt: null,
    egneSaker: false,
    egneSakerPaVent: false,
};

export const useOppgaveFeed = (): OppgaveFeedResponse => {
    const [offset, setOffset] = useState(0);
    const [originalFiltrering, setOriginalFiltrering] = useState<FiltreringInput>(defaultFiltrering);
    const [originalSortering, setOriginalSortering] = useState<OppgavesorteringInput[]>([]);
    const aktivTab = useAktivTab();
    const { activeFilters } = useFilters();
    const sort = useRecoilValue(sorteringSelector);
    const [filterErEndret, setFilterEndret] = useRecoilState(filterEndret);
    const [sorteringErEndret, setSorteringEndret] = useRecoilState(sorteringEndret);
    const [tabErEndret, setTabEndret] = useRecoilState(tabEndret);
    const limit = 14;

    useEffect(() => {
        setOriginalFiltrering(filtrering(activeFilters, aktivTab));
        setOriginalSortering(sortering(sort));
    }, []);

    const { data, error, loading, fetchMore, refetch } = useQuery(OppgaveFeedDocument, {
        variables: {
            offset: 0,
            limit: limit,
            filtrering: originalFiltrering,
            sortering: originalSortering,
        },
        initialFetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        onError: () => {
            throw Error('Kunne ikke hente saker. Prøv igjen senere.');
        },
    });

    useEffect(() => {
        void fetchMore({
            variables: {
                offset,
            },
        });
    }, [offset, fetchMore]);

    useEffect(() => {
        if (filterErEndret || sorteringErEndret || tabErEndret) {
            setOffset(0);
            void refetch({
                offset,
                filtrering: filtrering(activeFilters, aktivTab),
                sortering: sortering(sort),
            });
            setFilterEndret(false);
            setSorteringEndret(false);
            setTabEndret(false);
        }
    }, [
        filterErEndret,
        sorteringErEndret,
        tabErEndret,
        activeFilters,
        sort,
        aktivTab,
        setFilterEndret,
        setSorteringEndret,
        setTabEndret,
        setOffset,
        tildeltFiltrering,
        refetch,
    ]);

    const antallOppgaver = data?.oppgaveFeed.totaltAntallOppgaver ?? 0;
    const numberOfPages = Math.max(Math.ceil(antallOppgaver / limit), 1);
    const currentPage = Math.max(Math.ceil((offset + 1) / limit), 1);

    return {
        oppgaver: data?.oppgaveFeed.oppgaver,
        error,
        loading,
        antallOppgaver,
        numberOfPages,
        limit,
        currentPage: currentPage > numberOfPages ? 1 : currentPage,
        setPage: (newPage) => {
            setOffset(limit * (newPage - 1));
        },
    };
};

export const useAntallOppgaver = () => {
    const { data } = useQuery(AntallOppgaverDocument, {
        initialFetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        onError: () => {
            throw Error('Kunne ikke antall for Mine saker og På vent. Prøv igjen senere.');
        },
    });

    return {
        antallMineSaker: data?.antallOppgaver.antallMineSaker ?? 0,
        antallPåVent: data?.antallOppgaver.antallMineSakerPaVent ?? 0,
    };
};

export class TildelingAlert extends InfoAlert {
    name = 'tildeling';
}

const tildeltFiltrering = (activeFilters: Filter[]) => {
    if (activeFilters.some((filter) => filter.key === 'TILDELTE_SAKER' && filter.status === FilterStatus.ON)) {
        return true;
    } else if (activeFilters.some((filter) => filter.key === 'TILDELTE_SAKER' && filter.status === FilterStatus.OUT)) {
        return false;
    } else {
        return null;
    }
};

const finnKategori = (kolonne: Oppgaveoversiktkolonne) => {
    switch (kolonne) {
        case Oppgaveoversiktkolonne.PERIODETYPE:
            return Kategori.Periodetype;
        case Oppgaveoversiktkolonne.OPPGAVETYPE:
            return Kategori.Oppgavetype;
        case Oppgaveoversiktkolonne.MOTTAKER:
            return Kategori.Mottaker;
        case Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD:
            return Kategori.Inntektskilde;
        case Oppgaveoversiktkolonne.STATUS:
        case Oppgaveoversiktkolonne.PÅVENT:
            return Kategori.Status;
        default:
            return Kategori.Ukategorisert;
    }
};

const filtrering = (activeFilters: Filter[], aktivTab: TabType): FiltreringInput => ({
    egenskaper: hackInnInfotrygdforlengelse(activeFilters)
        .filter(
            (filter) => Object.values(Egenskap).includes(filter.key as Egenskap) && filter.status === FilterStatus.ON,
        )
        .map((filter) => ({
            egenskap: filter.key as Egenskap,
            kategori: finnKategori(filter.column),
        })),
    ekskluderteEgenskaper: hackInnInfotrygdforlengelse(activeFilters)
        .filter(
            (filter) => Object.values(Egenskap).includes(filter.key as Egenskap) && filter.status === FilterStatus.OUT,
        )
        .map((filter) => ({
            egenskap: filter.key as Egenskap,
            kategori: finnKategori(filter.column),
        })),
    ingenUkategoriserteEgenskaper: false,
    tildelt: tildeltFiltrering(activeFilters),
    egneSaker: aktivTab === TabType.Mine,
    egneSakerPaVent: aktivTab === TabType.Ventende,
});

// Vi viser begge egenskapene forlengelse og infotrygdforlengelse som "Forlengelse"
// og vi har ikke eget filter for infotrygdforlengelse.
// Så når man filtrerer på Forlengelse må vi også sende med Infotrygdforlengelse-egenskapen i filtreringen til Spesialist
const hackInnInfotrygdforlengelse = (activeFilters: Filter[]): Filter[] => {
    let filterArray: Filter[] = [...activeFilters];
    const forlengelseFilter = activeFilters.find((f) => f.key === Egenskap.Forlengelse);
    if (forlengelseFilter) {
        filterArray.push({
            key: Egenskap.Infotrygdforlengelse,
            label: 'Forlengelse',
            status: forlengelseFilter.status,
            column: Oppgaveoversiktkolonne.PERIODETYPE,
        });
    }
    return filterArray;
};

const finnSorteringsNøkkel = (sortKey: SortKey) => {
    switch (sortKey) {
        case SortKey.Saksbehandler:
            return Sorteringsnokkel.TildeltTil;
        case SortKey.SøknadMottatt:
            return Sorteringsnokkel.SoknadMottatt;
        case SortKey.Tidsfrist:
            return Sorteringsnokkel.Tidsfrist;
        default:
            return Sorteringsnokkel.Opprettet;
    }
};

const sortering = (sort: SortState | undefined): OppgavesorteringInput[] =>
    sort?.orderBy === undefined
        ? []
        : [
              {
                  nokkel: finnSorteringsNøkkel(sort?.orderBy as SortKey),
                  stigende: sort?.direction === 'ascending',
              },
          ];
