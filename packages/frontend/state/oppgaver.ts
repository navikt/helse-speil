import dayjs from 'dayjs';
import { AtomEffect, atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { ApolloError, useQuery } from '@apollo/client';
import {
    FerdigstiltOppgave,
    FetchBehandledeOppgaverQuery,
    FetchOppgaverDocument,
    FetchOppgaverQuery,
} from '@io/graphql';
import { fetchBehandledeOppgaver } from '@io/graphql/fetchBehandledeOppgaver';
import { ISO_DATOFORMAT } from '@utils/date';
import { InfoAlert } from '@utils/error';

import { authState, useInnloggetSaksbehandler } from './authentication';

type FetchedOppgaver = FetchOppgaverQuery['alleOppgaver'];

const fetchBehandledeOppgaverEffect: AtomEffect<FetchedData<Array<FerdigstiltOppgave>>> = ({
    setSelf,
    trigger,
    getPromise,
}) => {
    if (trigger === 'get') {
        getPromise(authState)
            .then(async (authInfo) => {
                if (authInfo.ident && authInfo.oid) {
                    setSelf((prevState) => ({ ...prevState, state: 'isLoading' }));
                    return fetchBehandledeOppgaver({
                        oid: authInfo.oid,
                        ident: authInfo.ident,
                        fom: dayjs().format(ISO_DATOFORMAT),
                    });
                }

                return null;
            })
            .then((response: Maybe<FetchBehandledeOppgaverQuery>) => {
                if (response) {
                    setSelf({ data: response.behandledeOppgaver, state: 'hasValue' });
                }
            })
            .catch((error) => {
                setSelf({ state: 'hasError', error: error });
            });
    }
};

const behandledeOppgaverState = atom<FetchedData<Array<FerdigstiltOppgave>>>({
    key: 'behandledeOppgaverState',
    default: { state: 'initial' },
    effects: [fetchBehandledeOppgaverEffect],
});

export const useFerdigstilteOppgaver = () => {
    return useRecoilValue(behandledeOppgaverState);
};

export const useRefetchFerdigstilteOppgaver = () => {
    const { oid, ident } = useInnloggetSaksbehandler();
    const setBehandledeOppgaver = useSetRecoilState(behandledeOppgaverState);

    return () => {
        if (ident && oid) {
            setBehandledeOppgaver((prevState) => ({ ...prevState, state: 'isLoading' }));
            fetchBehandledeOppgaver({ oid, ident, fom: dayjs().format(ISO_DATOFORMAT) }).then((response) =>
                setBehandledeOppgaver({ data: response.behandledeOppgaver, state: 'hasValue' }),
            );
        }
    };
};

interface OppgaverResponse {
    oppgaver?: FetchedOppgaver;
    error?: ApolloError;
    loading: boolean;
}

export const useQueryOppgaver = (): OppgaverResponse => {
    const { data, error, loading } = useQuery(FetchOppgaverDocument, {
        onError: () => {
            throw Error('Kunne ikke hente saker. Prøv igjen senere.');
        },
    });
    const oppgaver = data?.alleOppgaver;
    return {
        oppgaver: oppgaver,
        error,
        loading,
    };
};

export const useOppgaver = (): FetchedOppgaver => {
    const oppgaver = useQuery(FetchOppgaverDocument);
    return oppgaver.data?.alleOppgaver ?? [];
};

export const useMineOppgaver = (): FetchedOppgaver => {
    const { oid } = useInnloggetSaksbehandler();
    return useOppgaver().filter(({ tildeling }) => tildeling?.oid === oid);
};

export class TildelingAlert extends InfoAlert {
    name = 'tildeling';
}
