import dayjs from 'dayjs';
import {
    AtomEffect,
    Loadable,
    atom,
    selector,
    useRecoilValue,
    useRecoilValueLoadable,
    useSetRecoilState,
} from 'recoil';

import { FerdigstiltOppgave, FetchBehandledeOppgaverQuery, FetchOppgaverQuery, Tildeling } from '@io/graphql';
import { fetchBehandledeOppgaver } from '@io/graphql/fetchBehandledeOppgaver';
import { fetchOppgaver } from '@io/graphql/fetchOppgaver';
import { NotatDTO, deletePåVent, postLeggPåVent } from '@io/http';
import { tildelingState } from '@state/tildeling';
import { ISO_DATOFORMAT } from '@utils/date';
import { InfoAlert } from '@utils/error';

import { authState, useInnloggetSaksbehandler } from './authentication';
import { useAddVarsel, useRemoveVarsel } from './varsler';

type FetchedOppgaver = FetchOppgaverQuery['alleOppgaver'];

const oppgaverStateRefetchKey = atom<Date>({
    key: 'oppgaverStateRefetchKey',
    default: new Date(),
});

const remoteOppgaverState = selector<FetchedOppgaver>({
    key: 'remoteOppgaverState',
    get: async ({ get }) => {
        get(oppgaverStateRefetchKey);
        return await fetchOppgaver()
            .then((response) => response.alleOppgaver)
            .catch((error) => {
                switch (error.statusCode) {
                    case 404:
                        throw Error('Fant ingen saker mellom i går og i dag.');
                    case 401:
                        throw Error('Du må logge inn for å kunne hente saker.');
                    default:
                        throw Error('Kunne ikke hente saker. Prøv igjen senere.');
                }
            });
    },
});

type TildelingStateType = { [id: string]: Maybe<Tildeling> | undefined };

const tildelingerState = selector<TildelingStateType>({
    key: 'tildelingerState',
    get: ({ get }) => {
        const local = get(tildelingState);
        const remote = get(remoteOppgaverState).reduce<TildelingStateType>((tildelinger, { id, tildeling }) => {
            tildelinger[id] = tildeling;
            return tildelinger;
        }, {});
        return { ...remote, ...local };
    },
});

export const oppgaverState = selector<FetchedOppgaver>({
    key: 'oppgaverState',
    get: ({ get }) => {
        const tildelinger = get(tildelingerState);
        const oppgaver = get(remoteOppgaverState);
        return oppgaver.map((oppgave) => ({ ...oppgave, tildeling: tildelinger[oppgave.id] }));
    },
});

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

export const useOppgaverLoadable = (): Loadable<FetchedOppgaver> => {
    return useRecoilValueLoadable(oppgaverState);
};

export const useOppgaver = (): FetchedOppgaver => {
    const oppgaver = useOppgaverLoadable();
    return oppgaver.state === 'hasValue' ? oppgaver.contents : [];
};

export const useMineOppgaver = (): FetchedOppgaver => {
    const { oid } = useInnloggetSaksbehandler();
    return useOppgaver().filter(({ tildeling }) => tildeling?.oid === oid);
};

export const useRefetchOppgaver = () => {
    const setKey = useSetRecoilState(oppgaverStateRefetchKey);
    const setTildelinger = useSetRecoilState(tildelingState);
    return () => {
        setTildelinger({});
        setKey(new Date());
    };
};

export class TildelingAlert extends InfoAlert {
    name = 'tildeling';
}

const useRemoveTildelingsvarsel = () => {
    const removeVarsel = useRemoveVarsel();
    return () => removeVarsel('tildeling');
};

const useAddTildelingsvarsel = () => {
    const addVarsel = useAddVarsel();
    return (message: string) => addVarsel(new TildelingAlert(message));
};

export const useLeggPåVent = () => {
    const tildelinger = useRecoilValue(tildelingerState);
    const setLokaleTildelinger = useSetRecoilState(tildelingState);
    const removeTildelingsvarsel = useRemoveTildelingsvarsel();

    return (oppgavereferanse: string, notat: NotatDTO) => {
        removeTildelingsvarsel();
        return postLeggPåVent(oppgavereferanse, notat).then((response) => {
            setLokaleTildelinger({
                ...tildelinger,
                [oppgavereferanse]: tildelinger[oppgavereferanse]
                    ? { ...tildelinger[oppgavereferanse]!, reservert: true }
                    : undefined,
            });
            return response;
        });
    };
};

export const useFjernPåVent = (): ((oppgavereferanse: string) => () => Promise<Response>) => {
    const tildelinger = useRecoilValue(tildelingerState);
    const setLokaleTildelinger = useSetRecoilState(tildelingState);
    const addTildelingsvarsel = useAddTildelingsvarsel();
    const removeTildelingsvarsel = useRemoveTildelingsvarsel();

    return (oppgavereferanse) => () => {
        removeTildelingsvarsel();
        return deletePåVent(oppgavereferanse)
            .then((response) => {
                setLokaleTildelinger({
                    ...tildelinger,
                    [oppgavereferanse]: tildelinger[oppgavereferanse]
                        ? { ...tildelinger[oppgavereferanse]!, reservert: false }
                        : undefined,
                });
                return Promise.resolve(response);
            })
            .catch(() => {
                addTildelingsvarsel('Kunne ikke fjerne sak fra på vent.');
                return Promise.reject();
            });
    };
};
