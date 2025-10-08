import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';

import { ApolloError, useQuery } from '@apollo/client';
import { useBruker } from '@auth/brukerContext';
import {
    AntallOppgaverDocument,
    Egenskap,
    Kategori,
    OppgaveProjeksjon,
    OppgaveSorteringsfelt,
    RestGetOppgaverDocument,
    Sorteringsrekkefolge,
} from '@io/graphql';
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
    oppgaver?: OppgaveProjeksjon[];
    error?: ApolloError;
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
                    Object.values(Egenskap).includes(filter.key as Egenskap) && filter.status === FilterStatus.MINUS,
            )
            .map((filter) => filter.key);
        const plussEgenskaper = hackInnInfotrygdforlengelse(activeFilters).filter(
            (filter) => Object.values(Egenskap).includes(filter.key as Egenskap) && filter.status === FilterStatus.PLUS,
        );

        const minstEnAvEgenskapeneMap = new Map<string, Array<Egenskap>>();
        plussEgenskaper.forEach((currentValue) => {
            const kategori = finnKategori(currentValue.column);
            const array = minstEnAvEgenskapeneMap.get(kategori) ?? [];
            array.push(currentValue.key as Egenskap);
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
                sort.direction === 'ascending' ? Sorteringsrekkefolge.Stigende : Sorteringsrekkefolge.Synkende,
            tildeltTilOid:
                aktivTab === TabType.Ventende || aktivTab === TabType.Mine
                    ? innloggetSaksbehandlerOid
                    : valgtSaksbehandler?.oid,
        };
    }, [aktivTab, allFilters, sort, innloggetSaksbehandlerOid, valgtSaksbehandler]);

    useEffect(() => setCurrentPage(1), [setCurrentPage, variables]);

    const { data, error, loading } = useQuery(RestGetOppgaverDocument, {
        variables: { ...variables, sidetall: currentPage },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'no-cache',
    });

    return {
        oppgaver: data?.restGetOppgaver?.elementer,
        antallOppgaver: data?.restGetOppgaver?.totaltAntall ?? 0,
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

export const kategoriForEgenskap = (egenskap: Egenskap): Kategori => {
    switch (egenskap) {
        case Egenskap.Arbeidstaker:
        case Egenskap.SelvstendigNaeringsdrivende:
            return Kategori.Inntektsforhold;

        case Egenskap.EnArbeidsgiver:
        case Egenskap.FlereArbeidsgivere:
            return Kategori.Inntektskilde;

        case Egenskap.DelvisRefusjon:
        case Egenskap.IngenUtbetaling:
        case Egenskap.UtbetalingTilArbeidsgiver:
        case Egenskap.UtbetalingTilSykmeldt:
            return Kategori.Mottaker;

        case Egenskap.Revurdering:
        case Egenskap.Soknad:
            return Kategori.Oppgavetype;

        case Egenskap.Forlengelse:
        case Egenskap.Forstegangsbehandling:
        case Egenskap.Infotrygdforlengelse:
        case Egenskap.OvergangFraIt:
            return Kategori.Periodetype;

        case Egenskap.Beslutter:
        case Egenskap.PaVent:
        case Egenskap.Retur:
            return Kategori.Status;

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
            return OppgaveSorteringsfelt.Tildeling;
        case SortKey.SøknadMottatt:
            return OppgaveSorteringsfelt.OpprinneligSoeknadstidspunkt;
        case SortKey.Tidsfrist:
            return OppgaveSorteringsfelt.PaVentInfoTidsfrist;
        default:
            return OppgaveSorteringsfelt.OpprettetTidspunkt;
    }
};
