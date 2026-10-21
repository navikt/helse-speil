import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';

import { HttpError } from '@app/fetch/fetchClient';
import { useBruker } from '@auth/brukerContext';
import { useHarPorteføljestyringrolle } from '@hooks/brukerrolleHooks';
import {
    getGetAntallOppgaverQueryKey,
    getGetOppgaverQueryKey,
    useGetAntallOppgaver,
    useGetOppgaver,
} from '@io/rest/generated/oppgaver/oppgaver';
import {
    ApiEgenskap,
    ApiHttpProblemDetailsApiGetOppgaverErrorCode,
    ApiKategori,
    ApiOppgaveProjeksjon,
    ApiOppgaveSorteringsfelt,
    ApiSorteringsrekkefølge,
    GetOppgaverParams,
} from '@io/rest/generated/spesialist.schemas';
import { TabType, useAktivTab } from '@oversikt/tabState';
import {
    Filter,
    FilterStatus,
    Oppgaveoversiktkolonne,
    useActiveFilters,
    useDatofilter,
    valgtSaksbehandlerAtom,
} from '@oversikt/table/state/filter';
import { limit, useCurrentPageValue, useResetToFirstPageOnHashChange } from '@oversikt/table/state/pagination';
import { SortKey, useSorteringValue } from '@oversikt/table/state/sortation';
import { useQueryClient } from '@tanstack/react-query';
import { InfoAlert } from '@utils/error';

export type FetchMoreArgs = {
    variables: {
        offset: number;
    };
};

interface OppgaveFeedResponse {
    oppgaver?: ApiOppgaveProjeksjon[];
    error: HttpError<ApiHttpProblemDetailsApiGetOppgaverErrorCode> | null;
    loading: boolean;
    antallOppgaver: number;
}

export const useOppgaveFeed = (): OppgaveFeedResponse => {
    const [valgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);
    const currentPage = useCurrentPageValue();
    const resetToFirstPageOnHashChange = useResetToFirstPageOnHashChange();
    const sort = useSorteringValue();
    const aktivTab = useAktivTab();
    const activeFilters = useActiveFilters();
    const datofilter = useDatofilter();
    const harPorteføljestyringrolle = useHarPorteføljestyringrolle();
    const { oid: innloggetSaksbehandlerOid } = useBruker();

    const variables = useMemo<GetOppgaverParams>(() => {
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
            oppgaveKlarFom: aktivTab === TabType.TilGodkjenning ? datofilter.oppgaveKlarFom : undefined,
            oppgaveKlarTom: aktivTab === TabType.TilGodkjenning ? datofilter.oppgaveKlarTom : undefined,
            behandlingOpprettetFom:
                aktivTab === TabType.TilGodkjenning && harPorteføljestyringrolle
                    ? datofilter.behandlingOpprettetFom
                    : undefined,
            behandlingOpprettetTom:
                aktivTab === TabType.TilGodkjenning && harPorteføljestyringrolle
                    ? datofilter.behandlingOpprettetTom
                    : undefined,
        };
    }, [
        aktivTab,
        activeFilters,
        sort,
        innloggetSaksbehandlerOid,
        valgtSaksbehandler,
        datofilter,
        harPorteføljestyringrolle,
    ]);

    useEffect(() => {
        resetToFirstPageOnHashChange(aktivTab, JSON.stringify(variables));
    }, [resetToFirstPageOnHashChange, aktivTab, variables]);

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
        oppgaver: data?.elementer,
        antallOppgaver: data?.totaltAntall ?? 0,
        error,
        loading,
    };
};

export const useAntallOppgaver = () => {
    const { data } = useGetAntallOppgaver({ query: { staleTime: 0 } });

    return {
        antallMineSaker: data?.antallMineSaker ?? 0,
        antallPåVent: data?.antallMineSakerPåVent ?? 0,
        antallPåVentNåddFrist: data?.antallMineSakerPåVentNåddFrist ?? 0,
    };
};

// Oppgaver flytter seg mellom benkene (Til godkjenning, Mine oppgaver, På vent) når tildeling, på vent eller
// oppgavens status endres. Kall denne etter slike mutasjoner, så oversikten ikke viser oppgaven på feil benk.
export function useInvaliderOppgaver() {
    const queryClient = useQueryClient();
    return async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: getGetOppgaverQueryKey() }),
            queryClient.invalidateQueries({ queryKey: getGetAntallOppgaverQueryKey() }),
        ]);
    };
}

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

export const kategoriForEgenskap = (egenskap: ApiEgenskap): ApiKategori => {
    switch (egenskap) {
        case ApiEgenskap.ARBEIDSTAKER:
        case ApiEgenskap.SELVSTENDIG_NAERINGSDRIVENDE:
            return ApiKategori.Inntektsforhold;

        case ApiEgenskap.EN_ARBEIDSGIVER:
        case ApiEgenskap.FLERE_ARBEIDSGIVERE:
            return ApiKategori.Inntektskilde;

        case ApiEgenskap.DELVIS_REFUSJON:
        case ApiEgenskap.INGEN_UTBETALING:
        case ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER:
        case ApiEgenskap.UTBETALING_TIL_SYKMELDT:
            return ApiKategori.Mottaker;

        case ApiEgenskap.REVURDERING:
        case ApiEgenskap.SOKNAD:
            return ApiKategori.Oppgavetype;

        case ApiEgenskap.FORLENGELSE:
        case ApiEgenskap.FORSTEGANGSBEHANDLING:
        case ApiEgenskap.INFOTRYGDFORLENGELSE:
        case ApiEgenskap.OVERGANG_FRA_IT:
            return ApiKategori.Periodetype;

        case ApiEgenskap.BESLUTTER:
        case ApiEgenskap.PA_VENT:
        case ApiEgenskap.RETUR:
            return ApiKategori.Status;
        case ApiEgenskap.JORDBRUKER_REINDRIFT:
            return ApiKategori.Arbeidssituasjon;

        default:
            return ApiKategori.Ukategorisert;
    }
};

export const finnKategori = (kolonne: string) => {
    switch (kolonne) {
        case Oppgaveoversiktkolonne.PERIODETYPE:
            return ApiKategori.Periodetype;
        case Oppgaveoversiktkolonne.OPPGAVETYPE:
            return ApiKategori.Oppgavetype;
        case Oppgaveoversiktkolonne.MOTTAKER:
            return ApiKategori.Mottaker;
        case Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD:
            return ApiKategori.Inntektskilde;
        case Oppgaveoversiktkolonne.STATUS:
        case Oppgaveoversiktkolonne.PÅVENT:
            return ApiKategori.Status;
        case Oppgaveoversiktkolonne.INNTEKTSFORHOLD:
            return ApiKategori.Inntektsforhold;
        default:
            return ApiKategori.Ukategorisert;
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
            return ApiOppgaveSorteringsfelt.påVentInfo_tidsfrist;
        default:
            return ApiOppgaveSorteringsfelt.opprettetTidspunkt;
    }
};
