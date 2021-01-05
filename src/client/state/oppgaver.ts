import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil';
import { Oppgave } from '../../types';
import { fetchOppgaver } from '../io/http';

const oppgaverStateRefetchKey = atom<Date>({
    key: 'oppgaverStateRefetchKey',
    default: new Date(),
});

const remoteOppgaverState = selector<Oppgave[]>({
    key: 'remoteOppgaverState',
    get: async ({ get }) => {
        get(oppgaverStateRefetchKey);
        return await fetchOppgaver()
            .then(({ data }) => data.oppgaver)
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

const tildelingerState = atom<{ [oppgavereferanse: string]: string | undefined }>({
    key: 'tildelingerState',
    default: {},
});

export const oppgaverState = selector<Oppgave[]>({
    key: 'oppgaverState',
    get: async ({ get }) => {
        const tildelinger = get(tildelingerState);
        const oppgaver = await get(remoteOppgaverState);
        return oppgaver.map((it) =>
            tildelinger[it.oppgavereferanse] ? { ...it, tildeltTil: tildelinger[it.oppgavereferanse] } : it
        );
    },
});

export const useRefetchOppgaver = () => {
    const fetchIntervalInSeconds = 5;
    const [key, setKey] = useRecoilState(oppgaverStateRefetchKey);
    return () => {
        const newKey = new Date();
        if (newKey.getSeconds() - key.getSeconds() > fetchIntervalInSeconds) {
            setKey(newKey);
        }
    };
};

export const useTildelOppgave = () => {
    const setTildelinger = useSetRecoilState(tildelingerState);
    return ({ oppgavereferanse }: Oppgave, email: string) => {
        setTildelinger((it) => ({ ...it, [oppgavereferanse]: email }));
    };
};

export const useFjernTildeling = () => {
    const setTildelinger = useSetRecoilState(tildelingerState);
    return ({ oppgavereferanse }: Oppgave) => {
        setTildelinger((it) => ({ ...it, [oppgavereferanse]: undefined }));
    };
};
