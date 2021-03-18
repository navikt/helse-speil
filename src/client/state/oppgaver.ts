import {atom, selector, useSetRecoilState} from 'recoil';
import {deleteTildeling, fetchOppgaver, postTildeling} from '../io/http';
import {useAddVarsel, useRemoveVarsel} from './varsler';
import {capitalizeName, extractNameFromEmail} from '../utils/locale';
import {Varseltype} from '@navikt/helse-frontend-varsel';
import {flereArbeidsgivere, stikkprøve} from '../featureToggles';
import {Inntektskilde, Oppgave, Periodetype} from "internal-types";
import {tilOppgave} from "../mapping/oppgaver/oppgaver";

const oppgaverStateRefetchKey = atom<Date>({
    key: 'oppgaverStateRefetchKey',
    default: new Date(),
});

const remoteOppgaverState = selector<Oppgave[]>({
    key: 'remoteOppgaverState',
    get: async ({ get }) => {
        get(oppgaverStateRefetchKey);
        return await fetchOppgaver()
            .then((oppgaver) => oppgaver.map(tilOppgave))
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
        return oppgaver
            .filter((oppgave) => stikkprøve || oppgave.periodetype != Periodetype.Stikkprøve)
            .filter((oppgave) => flereArbeidsgivere || oppgave.inntektskilde != Inntektskilde.FlereArbeidsgivere)
            .map((it) => {
                const tildeling = tildelinger[it.oppgavereferanse];
                return it.oppgavereferanse in tildelinger ? { ...it, tildeltTil: tildeling } : it;
            });
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

const tildelingskey = 'tildeling';

const tildelingsvarsel = (message: string) => ({ key: tildelingskey, message: message, type: Varseltype.Advarsel });

export const useTildelOppgave = () => {
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const setTildelinger = useSetRecoilState(tildelingerState);

    return ({ oppgavereferanse }: Oppgave, userId: string) => {
        removeVarsel(tildelingskey);
        return postTildeling(oppgavereferanse)
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
                        addVarsel(
                            tildelingsvarsel(
                                `${capitalizeName(extractNameFromEmail(tildeltSaksbehandler))} har allerede tatt saken.`
                            )
                        );
                    }
                    return Promise.reject(tildeltSaksbehandler);
                } else {
                    addVarsel(tildelingsvarsel('Kunne ikke tildele sak.'));
                    return Promise.reject();
                }
            });
    };
};

export const useFjernTildeling = () => {
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const setTildelinger = useSetRecoilState(tildelingerState);

    return ({ oppgavereferanse }: Oppgave) => {
        removeVarsel(tildelingskey);
        return deleteTildeling(oppgavereferanse)
            .then((response) => {
                setTildelinger((it) => ({ ...it, [oppgavereferanse]: undefined }));
                return Promise.resolve(response);
            })
            .catch(() => {
                addVarsel(tildelingsvarsel('Kunne ikke fjerne tildeling av sak.'));
                return Promise.reject();
            });
    };
};
