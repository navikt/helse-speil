import { AxiosError } from 'axios';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';

import { ApolloError, useQuery } from '@apollo/client';
import { useBruker } from '@auth/brukerContext';
import { AntallOppgaverDocument, Kategori } from '@io/graphql';
import { useGetOppgaver } from '@io/rest/generated/oppgaver/oppgaver';
import {
    ApiEgenskap,
    ApiOppgaveProjeksjon,
    ApiOppgaveSorteringsfelt,
    ApiSorteringsrekkefølge,
} from '@io/rest/generated/spesialist.schemas';
import { TabType, useAktivTab } from '@oversikt/tabState';
import {
    Filter,
    FilterStatus,
    Oppgaveoversiktkolonne,
    useAllFilters,
    valgtSaksbehandlerAtom,
} from '@oversikt/table/state/filter';
import { limit, useCurrentPageState } from '@oversikt/table/state/pagination';
import { SortKey, useSorteringValue } from '@oversikt/table/state/sortation';
import { InfoAlert } from '@utils/error';

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
    oppgaver?: ApiOppgaveProjeksjon[];
    error: AxiosError | null;
    loading: boolean;
    antallOppgaver: number;
}

export const useOppgaveFeed = (): OppgaveFeedResponse => {
    const [valgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);
    const [currentPage, setCurrentPage] = useCurrentPageState();
    const sort = useSorteringValue();
    const aktivTab = useAktivTab();
    const allFilters = useAllFilters();
    const { oid: innloggetSaksbehandlerOid } = useBruker();

    const variables = useMemo(() => {
        const activeFilters = allFilters.filter((filter) => filter.status !== FilterStatus.OFF);
        const minusEgenskaper = hackInnInfotrygdforlengelse(activeFilters)
            .filter(
                (filter) =>
                    Object.values(ApiEgenskap).includes(filter.key as ApiEgenskap) &&
                    filter.status === FilterStatus.MINUS,
            )
            .map((filter) => filter.key);
        const plussEgenskaper = hackInnInfotrygdforlengelse(activeFilters).filter(
            (filter) =>
                Object.values(ApiEgenskap).includes(filter.key as ApiEgenskap) && filter.status === FilterStatus.PLUS,
        );

        const minstEnAvEgenskapeneMap = new Map<string, ApiEgenskap[]>();
        plussEgenskaper.forEach((currentValue) => {
            const kategori = finnKategori(currentValue.column);
            const array = minstEnAvEgenskapeneMap.get(kategori) ?? [];
            array.push(currentValue.key as ApiEgenskap);
            minstEnAvEgenskapeneMap.set(kategori, array);
        });

        const minstEnAvEgenskapene: string[] = [];
        minstEnAvEgenskapeneMap.forEach((value) => {
            minstEnAvEgenskapene.push(value.join(','));
        });
        return {
            erPaaVent: aktivTab === TabType.Ventende ? true : aktivTab === TabType.Mine ? false : undefined,
            erTildelt: tildeltFiltrering(activeFilters),
            ingenAvEgenskapene: minusEgenskaper.length > 0 ? minusEgenskaper.join(',') : undefined,
            minstEnAvEgenskapene: minstEnAvEgenskapene,
            sidestoerrelse: limit,
            sorteringsfelt: finnSorteringsNøkkel(sort.orderBy as SortKey),
            sorteringsrekkefoelge:
                sort.direction === 'ascending' ? ApiSorteringsrekkefølge.STIGENDE : ApiSorteringsrekkefølge.SYNKENDE,
            tildeltTilOid:
                aktivTab === TabType.Ventende || aktivTab === TabType.Mine
                    ? innloggetSaksbehandlerOid
                    : valgtSaksbehandler?.oid,
        };
    }, [aktivTab, allFilters, sort, innloggetSaksbehandlerOid, valgtSaksbehandler]);

    useEffect(() => setCurrentPage(1), [setCurrentPage, variables]);

    const {
        data,
        error,
        isFetching: loading,
    } = useGetOppgaver(
        {
            ...variables,
            sidetall: currentPage,
        },
        {
            query: {
                staleTime: 0,
            },
        },
    );

    return {
        oppgaver: data?.data?.elementer,
        antallOppgaver: data?.data?.totaltAntall ?? 0,
        error,
        loading,
    };
};

export const useAntallOppgaver = () => {
    const { data } = useQuery(AntallOppgaverDocument, {
        initialFetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
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
    if (activeFilters.some((filter) => filter.key === 'TILDELTE_SAKER' && filter.status === FilterStatus.PLUS)) {
        return true;
    } else if (
        activeFilters.some((filter) => filter.key === 'TILDELTE_SAKER' && filter.status === FilterStatus.MINUS)
    ) {
        return false;
    } else {
        return undefined;
    }
};

export const kategoriForEgenskap = (egenskap: ApiEgenskap): Kategori => {
    switch (egenskap) {
        case ApiEgenskap.ARBEIDSTAKER:
        case ApiEgenskap.SELVSTENDIG_NAERINGSDRIVENDE:
            return Kategori.Inntektsforhold;

        case ApiEgenskap.EN_ARBEIDSGIVER:
        case ApiEgenskap.FLERE_ARBEIDSGIVERE:
            return Kategori.Inntektskilde;

        case ApiEgenskap.DELVIS_REFUSJON:
        case ApiEgenskap.INGEN_UTBETALING:
        case ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER:
        case ApiEgenskap.UTBETALING_TIL_SYKMELDT:
            return Kategori.Mottaker;

        case ApiEgenskap.REVURDERING:
        case ApiEgenskap.SOKNAD:
            return Kategori.Oppgavetype;

        case ApiEgenskap.FORLENGELSE:
        case ApiEgenskap.FORSTEGANGSBEHANDLING:
        case ApiEgenskap.INFOTRYGDFORLENGELSE:
        case ApiEgenskap.OVERGANG_FRA_IT:
            return Kategori.Periodetype;

        case ApiEgenskap.BESLUTTER:
        case ApiEgenskap.PA_VENT:
        case ApiEgenskap.RETUR:
            return Kategori.Status;
        case ApiEgenskap.JORDBRUKER_REINDRIFT:
            return Kategori.Arbeidssituasjon;

        default:
            return Kategori.Ukategorisert;
    }
};

export const finnKategori = (kolonne: Oppgaveoversiktkolonne) => {
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

// Vi viser begge egenskapene forlengelse og infotrygdforlengelse som "Forlengelse"
// og vi har ikke eget filter for infotrygdforlengelse.
// Så når man filtrerer på Forlengelse må vi også sende med Infotrygdforlengelse-egenskapen i filtreringen til Spesialist
const hackInnInfotrygdforlengelse = (activeFilters: Filter[]): Filter[] => {
    const filterArray: Filter[] = [...activeFilters];
    const forlengelseFilter = activeFilters.find((f) => f.key === ApiEgenskap.FORLENGELSE);
    if (forlengelseFilter) {
        filterArray.push({
            key: ApiEgenskap.INFOTRYGDFORLENGELSE,
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
            return ApiOppgaveSorteringsfelt.tildeling;
        case SortKey.BehandlingOpprettetTidspunkt:
            return ApiOppgaveSorteringsfelt.behandlingOpprettetTidspunkt;
        case SortKey.Tidsfrist:
            return ApiOppgaveSorteringsfelt.paVentInfo_tidsfrist;
        default:
            return ApiOppgaveSorteringsfelt.opprettetTidspunkt;
    }
};
