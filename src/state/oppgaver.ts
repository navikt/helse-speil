import { useEffect, useRef } from 'react';

import { SortState } from '@navikt/ds-react';

import { ApolloError, useQuery } from '@apollo/client';
import { useBrukerGrupper, useBrukerIdent } from '@auth/brukerContext';
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
import { TabType, useAktivTab } from '@oversikt/tabState';
import { Filter, FilterStatus, Oppgaveoversiktkolonne, useFilters } from '@oversikt/table/state/filter';
import { limit, offset, useCurrentPageValue } from '@oversikt/table/state/pagination';
import { SortKey, useSorteringValue } from '@oversikt/table/state/sortation';
import { InfoAlert } from '@utils/error';
import { kanSeTilkommenInntekt } from '@utils/featureToggles';

export interface ApolloResponse<T> {
    data?: T;
    error?: ApolloError;
    loading: boolean;
}

export type FetchMoreArgs = {
    variables: {
        offset: number;
    };
};

interface OppgaveFeedResponse {
    oppgaver?: OppgaveTilBehandling[];
    error?: ApolloError;
    loading: boolean;
    antallOppgaver: number;
    fetchMore: ({ variables }: FetchMoreArgs) => void;
}

export const useOppgaveFeed = (): OppgaveFeedResponse => {
    const currentPage = useCurrentPageValue();
    const sortering = useSortering();
    const filtrering = useFiltrering();

    const initialLoad = useRef(true);
    const previousFiltreringRef = useRef(filtrering);
    const previousSorteringRef = useRef(sortering);

    const { data, error, loading, fetchMore, refetch } = useQuery(OppgaveFeedDocument, {
        variables: {
            offset: offset(currentPage),
            limit: limit,
            filtrering: filtrering,
            sortering: sortering,
        },
        notifyOnNetworkStatusChange: true,
        initialFetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        onError: () => {
            throw Error('Kunne ikke hente saker. Prøv igjen senere.');
        },
    });

    useEffect(() => {
        if (initialLoad.current) {
            initialLoad.current = false;
            return;
        }

        if (
            JSON.stringify(filtrering) !== JSON.stringify(previousFiltreringRef.current) ||
            JSON.stringify(sortering) !== JSON.stringify(previousSorteringRef.current)
        ) {
            previousFiltreringRef.current = filtrering;
            previousSorteringRef.current = sortering;
            void refetch({
                filtrering: filtrering,
                sortering: sortering,
            });
        }
    }, [refetch, sortering, filtrering]);

    return {
        oppgaver: data?.oppgaveFeed.oppgaver,
        antallOppgaver: data?.oppgaveFeed.totaltAntallOppgaver ?? 0,
        error,
        loading,
        fetchMore,
    };
};

const useFiltrering = () => {
    const aktivTab = useAktivTab();
    const { activeFilters } = useFilters();
    const saksbehandlerident = useBrukerIdent();
    const grupper = useBrukerGrupper();

    return filtrering(activeFilters, aktivTab, saksbehandlerident, grupper);
};

const useSortering = () => {
    const sort = useSorteringValue();
    return sortering(sort);
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

const filtrering = (
    activeFilters: Filter[],
    aktivTab: TabType,
    saksbehandlerident: string,
    grupper: string[],
): FiltreringInput => {
    const ekskluderteEgenskaper = hackInnInfotrygdforlengelse(activeFilters)
        .filter(
            (filter) => Object.values(Egenskap).includes(filter.key as Egenskap) && filter.status === FilterStatus.OUT,
        )
        .map((filter) => ({
            egenskap: filter.key as Egenskap,
            kategori: finnKategori(filter.column),
        }));

    if (!kanSeTilkommenInntekt(saksbehandlerident, grupper))
        ekskluderteEgenskaper.push({
            egenskap: Egenskap.Tilkommen,
            kategori: Kategori.Ukategorisert,
        });

    return {
        egenskaper: hackInnInfotrygdforlengelse(activeFilters)
            .filter(
                (filter) =>
                    Object.values(Egenskap).includes(filter.key as Egenskap) && filter.status === FilterStatus.ON,
            )
            .map((filter) => ({
                egenskap: filter.key as Egenskap,
                kategori: finnKategori(filter.column),
            })),
        ekskluderteEgenskaper: ekskluderteEgenskaper,
        ingenUkategoriserteEgenskaper: false,
        tildelt: tildeltFiltrering(activeFilters),
        egneSaker: aktivTab === TabType.Mine,
        egneSakerPaVent: aktivTab === TabType.Ventende,
    };
};

// Vi viser begge egenskapene forlengelse og infotrygdforlengelse som "Forlengelse"
// og vi har ikke eget filter for infotrygdforlengelse.
// Så når man filtrerer på Forlengelse må vi også sende med Infotrygdforlengelse-egenskapen i filtreringen til Spesialist
const hackInnInfotrygdforlengelse = (activeFilters: Filter[]): Filter[] => {
    const filterArray: Filter[] = [...activeFilters];
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
