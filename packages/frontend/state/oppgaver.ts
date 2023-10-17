import { ApolloError, useQuery } from '@apollo/client';
import { BehandledeOppgaverDocument, BehandletOppgave, OppgaveTilBehandling, OppgaverDocument } from '@io/graphql';
import { InfoAlert } from '@utils/error';

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
