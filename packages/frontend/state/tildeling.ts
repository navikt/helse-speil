import { atom, useRecoilState } from 'recoil';

import { useMutation } from '@apollo/client';
import {
    FetchOppgaverDocument,
    FjernPaaVentDocument,
    FjernTildelingDocument,
    LeggPaaVentDocument,
    Maybe,
    NotatType,
    OppgaveForOversiktsvisning,
    OpprettTildelingDocument,
    Tildeling,
} from '@io/graphql';
import { NotatDTO } from '@io/http';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { InfoAlert } from '@utils/error';

import { client } from '../routes/apolloClient';

type TildelingStateType = { [id: string]: Maybe<Tildeling> | undefined };

export const tildelingState = atom<TildelingStateType>({
    key: 'tildelingState',
    default: {},
});

class TildelingAlert extends InfoAlert {
    name = 'tildeling';
}

const useFjernTildelingsvarsel = () => {
    const removeVarsel = useRemoveVarsel();
    return () => removeVarsel('tildeling');
};

const useLeggTilTildelingsvarsel = () => {
    const addVarsel = useAddVarsel();
    return (message: string) => addVarsel(new TildelingAlert(message));
};

export const useOpprettTildeling = (): ((oppgavereferanse: string) => Promise<Maybe<Tildeling> | undefined>) => {
    const [tildelinger, setTildelinger] = useRecoilState(tildelingState);
    const [opprettTildelingMutation, data] = useMutation(OpprettTildelingDocument);
    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();

    return (oppgavereferanse) => {
        fjernTildelingsvarsel();
        return opprettTildelingMutation({
            variables: { oppgaveId: oppgavereferanse },
            update: (cache, result) => {
                cache.modify({
                    id: cache.identify({ __typename: 'OppgaveForOversiktsvisning', id: oppgavereferanse }),
                    fields: {
                        tildeling: () => result.data?.opprettTildeling,
                    },
                });
            },
        })
            .then((result) => {
                setTildelinger({
                    ...tildelinger,
                    [oppgavereferanse]: result.data?.opprettTildeling,
                });
                return result.data?.opprettTildeling;
            })
            .catch((e) => {
                leggTilTildelingsvarsel('Kunne ikke tildele sak.');
                client.refetchQueries({ include: [FetchOppgaverDocument] });
                return Promise.reject('Kunne ikke tildele sak.');
            });
    };
};

type GraphQLRequestError = {
    response: { errors: [{ message: string; extensions: { code: { value: number }; tildeling: Tildeling } }] };
};

export const useFjernTildeling = (): ((oppgavereferanse: string) => Promise<Maybe<boolean> | undefined>) => {
    const [tildelinger, setTildelinger] = useRecoilState(tildelingState);
    const [fjernTildelingMutation] = useMutation(FjernTildelingDocument);

    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();

    return (oppgavereferanse) => {
        fjernTildelingsvarsel();
        return fjernTildelingMutation({
            variables: { oppgaveId: oppgavereferanse },
            update: (cache) => {
                cache.modify({
                    id: cache.identify({ __typename: 'OppgaveForOversiktsvisning', id: oppgavereferanse }),
                    fields: {
                        tildeling: () => null,
                    },
                });
            },
        })
            .then((result) => {
                setTildelinger({
                    ...tildelinger,
                    [oppgavereferanse]: undefined,
                });
                return result.data?.fjernTildeling;
            })
            .catch(() => {
                leggTilTildelingsvarsel('Kunne ikke fjerne tildeling av sak.');
                return Promise.reject('Kunne ikke fjerne tildeling av sak.');
            });
    };
};
export const useLeggPåVent = (): ((
    oppgavereferanse: string,
    notat: NotatDTO,
) => Promise<Maybe<Tildeling> | undefined>) => {
    const [leggPåVentMutation] = useMutation(LeggPaaVentDocument);

    return (oppgavereferanse: string, notat: NotatDTO) => {
        return leggPåVentMutation({
            variables: { oppgaveId: oppgavereferanse, notatType: NotatType.PaaVent, notatTekst: notat.tekst },
            update: (cache, result) => {
                cache.modify({
                    id: cache.identify({ __typename: 'OppgaveForOversiktsvisning', id: oppgavereferanse }),
                    fields: {
                        tildeling: () => result.data?.leggPaaVent,
                    },
                });
            },
        })
            .then((response) => response.data?.leggPaaVent)
            .catch(() => Promise.reject('Kunne ikke legge oppgave på vent.'));
    };
};
export const useFjernPåVent = (): ((oppgavereferanse: string) => Promise<Maybe<Tildeling> | undefined>) => {
    const [fjernPåVentMutation] = useMutation(FjernPaaVentDocument);
    return (oppgavereferanse) => {
        return fjernPåVentMutation({
            variables: { oppgaveId: oppgavereferanse },
            update: (cache) => {
                cache.modify({
                    id: cache.identify({ __typename: 'OppgaveForOversiktsvisning', id: oppgavereferanse }),
                    fields: {
                        tildeling: (value) => ({ ...value, paaVent: false, reservert: false }),
                    },
                });
            },
        })
            .then((response) => response.data?.fjernPaaVent)
            .catch(() => Promise.reject('Kunne ikke fjerne på-vent-status fra oppgave.'));
    };
};
