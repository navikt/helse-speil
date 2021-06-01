import { Inntektskilde, Oppgave, Periodetype, Saksbehandler, Tildeling } from 'internal-types';
import { atom, selector, SetterOrUpdater, useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import { Varseltype } from '@navikt/helse-frontend-varsel';

import { deletePåVent, deleteTildeling, fetchOppgaver, postLeggPåVent, postTildeling } from '../io/http';
import { tilOppgave } from '../mapping/oppgaver/oppgaver';

import { flereArbeidsgivere, stikkprøve } from '../featureToggles';
import { useInnloggetSaksbehandler } from './authentication';
import { useAddVarsel, useRemoveVarsel, VarselObject } from './varsler';

const oppgaverStateRefetchKey = atom<Date>({
    key: 'oppgaverStateRefetchKey',
    default: new Date(),
});

const remoteOppgaverState = selector<Oppgave[]>({
    key: 'remoteOppgaverState',
    get: async ({ get }) => {
        get(oppgaverStateRefetchKey);
        return await fetchOppgaver()
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
        const remote = get(remoteOppgaverState).reduce(
            (tildelinger, { oppgavereferanse, tildeling }) => ({
                ...tildelinger,
                [oppgavereferanse]: tildeling,
            }),
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
            .filter((oppgave) => stikkprøve || oppgave.periodetype != Periodetype.Stikkprøve)
            .filter((oppgave) => flereArbeidsgivere || oppgave.inntektskilde != Inntektskilde.FlereArbeidsgivere)
            .map((oppgave) => ({ ...oppgave, tildeling: tildelinger[oppgave.oppgavereferanse] }));
    },
});

export const useOppgaver = (): Oppgave[] => {
    const oppgaver = useRecoilValueLoadable<Oppgave[]>(oppgaverState);
    return oppgaver.state === 'hasValue' ? oppgaver.contents : [];
};

export const useMineOppgaver = (): Oppgave[] => {
    const { oid } = useInnloggetSaksbehandler();
    return useOppgaver().filter(({ tildeling }) => tildeling?.saksbehandler.oid === oid);
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

const tildelingskey = 'tildeling';

const tildelingsvarsel = (message: string) => ({ key: tildelingskey, message: message, type: Varseltype.Info });

const tildelOppgave = (
    setTildelinger: SetterOrUpdater<TildelingStateType>,
    addVarsel: (msg: VarselObject) => void,
    removeVarsel: (key: String) => void
) => {
    return ({ oppgavereferanse }: Oppgave, saksbehandler: Saksbehandler) => {
        removeVarsel(tildelingskey);
        return postTildeling(oppgavereferanse)
            .then((response) => {
                setTildelinger((it) => {
                    return { ...it, [oppgavereferanse]: { saksbehandler, påVent: false } };
                });
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
                    addVarsel(tildelingsvarsel(`${navn} har allerede tatt saken.`));
                    return Promise.reject(oid);
                } else {
                    addVarsel(tildelingsvarsel('Kunne ikke tildele sak.'));
                    return Promise.reject();
                }
            });
    };
};

const fjernTildeling = (
    setTildelinger: SetterOrUpdater<TildelingStateType>,
    addVarsel: (msg: VarselObject) => void,
    removeVarsel: (key: String) => void
) => ({ oppgavereferanse }: Oppgave) => {
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

const leggPåVent = (
    setTildelinger: SetterOrUpdater<TildelingStateType>,
    addVarsel: (msg: VarselObject) => void,
    removeVarsel: (key: String) => void
) => {
    return ({ oppgavereferanse }: Oppgave) => {
        removeVarsel(tildelingskey);
        return postLeggPåVent(oppgavereferanse)
            .then((response) => {
                setTildelinger((it) => ({
                    ...it,
                    [oppgavereferanse]: { ...it[oppgavereferanse]!!, påVent: true },
                }));
                return Promise.resolve(response);
            })
            .catch(() => {
                addVarsel(tildelingsvarsel('Kunne ikke legge sak på vent.'));
                return Promise.reject();
            });
    };
};

const fjernPåVent = (
    setTildelinger: SetterOrUpdater<TildelingStateType>,
    addVarsel: (msg: VarselObject) => void,
    removeVarsel: (key: String) => void
) => {
    return ({ oppgavereferanse }: Oppgave) => {
        removeVarsel(tildelingskey);
        return deletePåVent(oppgavereferanse)
            .then((response) => {
                setTildelinger((it) => ({
                    ...it,
                    [oppgavereferanse]: { ...it[oppgavereferanse]!!, påVent: false },
                }));
                return Promise.resolve(response);
            })
            .catch(() => {
                addVarsel(tildelingsvarsel('Kunne ikke fjerne sak fra på vent.'));
                return Promise.reject();
            });
    };
};

export const useTildeling = () => {
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const setTildelinger = useSetRecoilState(_tildelingerState);
    return {
        tildelOppgave: tildelOppgave(setTildelinger, addVarsel, removeVarsel),
        fjernTildeling: fjernTildeling(setTildelinger, addVarsel, removeVarsel),
        leggPåVent: leggPåVent(setTildelinger, addVarsel, removeVarsel),
        fjernPåVent: fjernPåVent(setTildelinger, addVarsel, removeVarsel),
    };
};
