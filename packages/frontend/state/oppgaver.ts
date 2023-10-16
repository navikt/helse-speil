import { ApolloError, useQuery } from '@apollo/client';
import {
    AlleOppgaverDocument,
    BehandledeOppgaverDocument,
    BehandletOppgave,
    Fane,
    OppgaveTilBehandling,
    OppgaverDocument,
} from '@io/graphql';
import { InfoAlert } from '@utils/error';

import { TabType, useAktivTab } from '../routes/oversikt/tabState';
import { usePagination } from '../routes/oversikt/table/state/pagination';
import { useInnloggetSaksbehandler } from './authentication';

export interface ApolloResponse<T> {
    data?: T;
    error?: ApolloError;
    loading: boolean;
}

export interface OppgaverResponse {
    oppgaver?: OppgaveTilBehandling[];
    error?: ApolloError;
    loading: boolean;
}
export interface AlleOppgaverResponse {
    antallOppgaver: number;
    oppgaver?: OppgaveTilBehandling[];
    error?: ApolloError;
    loading: boolean;
}

interface BehandledeOppgaverResponse {
    behandledeOppgaver?: BehandletOppgave[];
    error?: ApolloError;
    loading: boolean;
}

export const useQueryBehandledeOppgaver = (): BehandledeOppgaverResponse => {
    const { error, loading, data } = useQuery(BehandledeOppgaverDocument);

    return {
        behandledeOppgaver: data?.behandledeOppgaverIDag,
        error,
        loading,
    };
};

export const useQueryOppgaver = (): OppgaverResponse => {
    const { data, error, loading } = useQuery(OppgaverDocument, {
        fetchPolicy: 'no-cache',
        onError: () => {
            throw Error('Kunne ikke hente saker. Prøv igjen senere.');
        },
    });
    const oppgaver = data?.oppgaver;
    return {
        oppgaver: oppgaver,
        error,
        loading,
    };
};

export const useQueryAlleOppgaver = (): AlleOppgaverResponse => {
    const foo = usePagination();
    const aktivTab = useAktivTab();
    const fane =
        aktivTab === TabType.TilGodkjenning
            ? Fane.TilGodkjenning
            : aktivTab === TabType.Mine
            ? Fane.MineSaker
            : Fane.PaaVent;
    const { data, error, loading } = useQuery(AlleOppgaverDocument, {
        variables: {
            startIndex: foo?.currentPage,
            pageSize: foo?.entriesPerPage,
            fane: fane,
        },

        initialFetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        onError: () => {
            throw Error('Kunne ikke hente saker. Prøv igjen senere.');
        },
    });
    const oppgaver: OppgaveTilBehandling[] | undefined = data?.alleOppgaver.oppgaver;
    return {
        antallOppgaver: data?.alleOppgaver.totaltAntallOppgaver ?? 0,
        oppgaver: oppgaver,
        error,
        loading,
    };
};

export const useOppgaver = (): OppgaveTilBehandling[] => {
    const { oppgaver } = useQueryOppgaver();
    return oppgaver ?? [];
};

export const useMineOppgaver = (): OppgaveTilBehandling[] => {
    const { oid } = useInnloggetSaksbehandler();
    return useOppgaver().filter(({ tildeling }) => tildeling?.oid === oid);
};

export class TildelingAlert extends InfoAlert {
    name = 'tildeling';
}
