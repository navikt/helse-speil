import { atom, selector, useSetRecoilState } from 'recoil';
import { Oppgave } from '../../types';
import { deleteTildeling, fetchOppgaver, postTildeling } from '../io/http';
import { useUpdateVarsler } from './varslerState';
import { capitalizeName, extractNameFromEmail } from '../utils/locale';
import { Varseltype } from '@navikt/helse-frontend-varsel';

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
    const setKey = useSetRecoilState(oppgaverStateRefetchKey);
    const setTildelinger = useSetRecoilState(tildelingerState);
    return () => {
        setTildelinger({});
        setKey(new Date());
    };
};

type TildelingError = {
    feilkode: string;
    kildesystem: string;
    kontekst: {
        tildeltTil: string;
    };
};

const tildelingsvarsel = (message: string) => ({ message, type: Varseltype.Advarsel });

export const useTildelOppgave = () => {
    const { leggTilVarsel, fjernVarsler } = useUpdateVarsler();
    const setTildelinger = useSetRecoilState(tildelingerState);

    return ({ oppgavereferanse }: Oppgave, userId: string) => {
        fjernVarsler();
        return postTildeling({ oppgavereferanse, userId })
            .then((response) => {
                setTildelinger((it) => ({ ...it, [oppgavereferanse]: userId }));
                return Promise.resolve(response);
            })
            .catch(async (error) => {
                if (error.statusCode === 409) {
                    const respons: TildelingError = (await JSON.parse(error.message)) as TildelingError;
                    const tildeltSaksbehandler = respons.kontekst.tildeltTil;
                    if (tildeltSaksbehandler) {
                        setTildelinger((it) => ({ ...it, [oppgavereferanse]: tildeltSaksbehandler }));
                        leggTilVarsel(
                            tildelingsvarsel(
                                `${capitalizeName(extractNameFromEmail(tildeltSaksbehandler))} har allerede tatt saken.`
                            )
                        );
                    }
                    return Promise.reject(tildeltSaksbehandler);
                } else {
                    leggTilVarsel(tildelingsvarsel('Kunne ikke tildele sak.'));
                    return Promise.reject();
                }
            });
    };
};

export const useFjernTildeling = () => {
    const { leggTilVarsel, fjernVarsler } = useUpdateVarsler();
    const setTildelinger = useSetRecoilState(tildelingerState);

    return ({ oppgavereferanse }: Oppgave) => {
        fjernVarsler();
        return deleteTildeling(oppgavereferanse)
            .then((response) => {
                setTildelinger((it) => ({ ...it, [oppgavereferanse]: undefined }));
                return Promise.resolve(response);
            })
            .catch(() => {
                leggTilVarsel(tildelingsvarsel('Kunne ikke fjerne tildeling av sak.'));
                return Promise.reject();
            });
    };
};
