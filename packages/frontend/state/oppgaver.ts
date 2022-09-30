import dayjs from 'dayjs';
import { AtomEffect, atom, selector, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import { FerdigstiltOppgave, FetchBehandledeOppgaverQuery } from '@io/graphql';
import { fetchBehandledeOppgaver } from '@io/graphql/fetchBehandledeOppgaver';
import { NotatDTO, deletePåVent, deleteTildeling, getOppgaver, postLeggPåVent, postTildeling } from '@io/http';
import { ISO_DATOFORMAT } from '@utils/date';
import { InfoAlert } from '@utils/error';
import { flereArbeidsgivere, stikkprøve, utbetalingTilSykmeldt } from '@utils/featureToggles';

import { tilOppgave } from '../mapping/oppgaver';
import { authState, useInnloggetSaksbehandler } from './authentication';
import { useAddVarsel, useRemoveVarsel } from './varsler';

const oppgaverStateRefetchKey = atom<Date>({
    key: 'oppgaverStateRefetchKey',
    default: new Date(),
});

const remoteOppgaverState = selector<Oppgave[]>({
    key: 'remoteOppgaverState',
    get: async ({ get }) => {
        get(oppgaverStateRefetchKey);
        return await getOppgaver()
            .then((spesialistOppgaver) => spesialistOppgaver.map(tilOppgave))
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

type TildelingStateType = { [oppgavereferanse: string]: Tildeling | undefined };

const _tildelingerState = atom<TildelingStateType>({
    key: '_tildelingerState',
    default: {},
});

const tildelingerState = selector<TildelingStateType>({
    key: 'tildelingerState',
    get: async ({ get }) => {
        const local = get(_tildelingerState);
        const remote = get(remoteOppgaverState).reduce<TildelingStateType>(
            (tildelinger, { oppgavereferanse, tildeling }) => {
                tildelinger[oppgavereferanse] = tildeling;
                return tildelinger;
            },
            {}
        );
        return { ...remote, ...local };
    },
});

export const oppgaverState = selector<Oppgave[]>({
    key: 'oppgaverState',
    get: ({ get }) => {
        const tildelinger = get(tildelingerState);
        const oppgaver = get(remoteOppgaverState);
        return oppgaver
            .filter((oppgave) => stikkprøve || oppgave.periodetype != 'stikkprøve')
            .filter((oppgave) => flereArbeidsgivere || oppgave.inntektskilde != 'FLERE_ARBEIDSGIVERE')
            .filter(
                (oppgave) =>
                    utbetalingTilSykmeldt ||
                    (oppgave.periodetype != 'utbetalingTilSykmeldt' && oppgave.periodetype != 'delvisRefusjon')
            )
            .map((oppgave) => ({ ...oppgave, tildeling: tildelinger[oppgave.oppgavereferanse] }));
    },
});

const fetchBehandledeOppgaverEffect: AtomEffect<FetchedData<Array<FerdigstiltOppgave>>> = ({
    setSelf,
    trigger,
    getPromise,
}) => {
    if (trigger === 'get') {
        getPromise(authState)
            .then((authState) => {
                if (authState.ident && authState.oid) {
                    setSelf((prevState) => ({ ...prevState, state: 'isLoading' }));
                    return fetchBehandledeOppgaver({
                        oid: authState.oid,
                        ident: authState.ident,
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
                setBehandledeOppgaver({ data: response.behandledeOppgaver, state: 'hasValue' })
            );
        }
    };
};

export const useOppgaver = (): Oppgave[] => {
    const oppgaver = useRecoilValueLoadable<Oppgave[]>(oppgaverState);
    return oppgaver.state === 'hasValue' ? oppgaver.contents : [];
};

export const useMineOppgaver = (): Oppgave[] => {
    const { oid } = useInnloggetSaksbehandler();
    return useOppgaver().filter(({ tildeling }) => tildeling?.saksbehandler?.oid === oid);
};

export const useRefetchOppgaver = () => {
    const setKey = useSetRecoilState(oppgaverStateRefetchKey);
    const setTildelinger = useSetRecoilState(_tildelingerState);
    return () => {
        setTildelinger({});
        setKey(new Date());
    };
};

type TildelingError = {
    feilkode: string;
    kildesystem: string;
    kontekst: {
        tildeling: {
            oid: string;
            navn: string;
            epost: string;
            påVent: boolean;
        };
    };
};

class TildelingAlert extends InfoAlert {
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

export const useTildelOppgave = () => {
    const setTildelinger = useSetRecoilState(_tildelingerState);
    const addTildelingsvarsel = useAddTildelingsvarsel();
    const removeTildelingsvarsel = useRemoveTildelingsvarsel();

    return ({ oppgavereferanse }: Pick<Oppgave, 'oppgavereferanse'>, saksbehandler: Saksbehandler) => {
        removeTildelingsvarsel();
        return postTildeling(oppgavereferanse)
            .then((response) => {
                setTildelinger((it) => ({ ...it, [oppgavereferanse]: { saksbehandler, påVent: false } }));
                return Promise.resolve(response);
            })
            .catch(async (error) => {
                if (error.statusCode === 409) {
                    const respons: TildelingError = (await JSON.parse(error.message)) as TildelingError;
                    const { oid, navn, epost, påVent } = respons.kontekst.tildeling;
                    setTildelinger((it) => ({
                        ...it,
                        [oppgavereferanse]: { saksbehandler: { oid, navn, epost }, påVent: påVent },
                    }));
                    addTildelingsvarsel(`${navn} har allerede tatt saken.`);
                    return Promise.reject(oid);
                } else {
                    addTildelingsvarsel('Kunne ikke tildele sak.');
                    return Promise.reject();
                }
            });
    };
};

export const useFjernTildeling = (): ((oppgavereferanse: string) => () => Promise<Response>) => {
    const setTildelinger = useSetRecoilState(_tildelingerState);
    const addTildelingsvarsel = useAddTildelingsvarsel();
    const removeTildelingsvarsel = useRemoveTildelingsvarsel();

    return (oppgavereferanse) => () => {
        removeTildelingsvarsel();
        return deleteTildeling(oppgavereferanse)
            .then((response) => {
                setTildelinger((it) => ({ ...it, [oppgavereferanse]: undefined }));
                return Promise.resolve(response);
            })
            .catch(() => {
                addTildelingsvarsel('Kunne ikke fjerne tildeling av sak.');
                return Promise.reject();
            });
    };
};

export const useLeggPåVent = () => {
    const tildelinger = useRecoilValue(tildelingerState);
    const setLokaleTildelinger = useSetRecoilState(_tildelingerState);
    const addTildelingsvarsel = useAddTildelingsvarsel();
    const removeTildelingsvarsel = useRemoveTildelingsvarsel();

    return (oppgavereferanse: string, notat: NotatDTO) => {
        removeTildelingsvarsel();
        return postLeggPåVent(oppgavereferanse, notat)
            .then((response) => {
                setLokaleTildelinger({
                    ...tildelinger,
                    [oppgavereferanse]: tildelinger[oppgavereferanse]
                        ? { ...tildelinger[oppgavereferanse]!, påVent: true }
                        : undefined,
                });
                return Promise.resolve(response);
            })
            .catch(() => {
                addTildelingsvarsel('Kunne ikke legge sak på vent.');
                return Promise.reject();
            });
    };
};

export const useFjernPåVent = (): ((oppgavereferanse: string) => () => Promise<Response>) => {
    const tildelinger = useRecoilValue(tildelingerState);
    const setLokaleTildelinger = useSetRecoilState(_tildelingerState);
    const addTildelingsvarsel = useAddTildelingsvarsel();
    const removeTildelingsvarsel = useRemoveTildelingsvarsel();

    return (oppgavereferanse) => () => {
        removeTildelingsvarsel();
        return deletePåVent(oppgavereferanse)
            .then((response) => {
                setLokaleTildelinger({
                    ...tildelinger,
                    [oppgavereferanse]: tildelinger[oppgavereferanse]
                        ? { ...tildelinger[oppgavereferanse]!, påVent: false }
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
