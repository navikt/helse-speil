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
import { InfoAlert } from '@utils/error';

import { TabType, tabEndret, useAktivTab } from '../routes/oversikt/tabState';
import { Filter, Oppgaveoversiktkolonne, filterEndret, useFilters } from '../routes/oversikt/table/state/filter';
import { SortKey, sorteringEndret, sortering as sorteringSelector } from '../routes/oversikt/table/state/sortation';

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

const tildeltFiltrering = (activeFilters: Filter<OppgaveTilBehandling>[]) => {
    if (
        activeFilters.some((filter) => filter.key === 'TILDELTE_SAKER') &&
        !activeFilters.some((filter) => filter.key === 'UFORDELTE_SAKER')
    ) {
        return true;
    } else if (
        activeFilters.some((filter) => filter.key === 'UFORDELTE_SAKER') &&
        !activeFilters.some((filter) => filter.key === 'TILDELTE_SAKER')
    ) {
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

const filtrering = (activeFilters: Filter<OppgaveTilBehandling>[], aktivTab: TabType): FiltreringInput => ({
    egenskaper: activeFilters
        .filter((filter) => Object.values(Egenskap).includes(filter.key as Egenskap))
        .map((filter) => ({
            egenskap: filter.key as Egenskap,
            kategori: finnKategori(filter.column),
        })),
    ekskluderteEgenskaper: activeFilters
        .filter((filter) => filter.key === 'IKKE_PA_VENT')
        .map((filter) => ({
            egenskap: Egenskap.PaVent,
            kategori: finnKategori(filter.column),
        })),
    ingenUkategoriserteEgenskaper: activeFilters.some((filter) => filter.key === 'INGEN_EGENSKAPER'),
    tildelt: tildeltFiltrering(activeFilters),
    egneSaker: aktivTab === TabType.Mine,
    egneSakerPaVent: aktivTab === TabType.Ventende,
});

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
