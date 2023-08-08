import { atom, useRecoilState } from 'recoil';

import { ApolloError, MutationResult, useApolloClient, useMutation } from '@apollo/client';
import {
    FetchNotaterDocument,
    FetchOppgaverDocument,
    FjernPaaVentDocument,
    FjernPaaVentMutation,
    FjernTildelingDocument,
    LeggPaaVentDocument,
    Maybe,
    NotatType,
    OpprettTildelingDocument,
    OpprettTildelingMutation,
    Tildeling,
} from '@io/graphql';
import { NotatDTO } from '@io/http';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { InfoAlert } from '@utils/error';

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

export const useOpprettTildeling = (): [
    (oppgavereferanse: string) => Promise<Maybe<Tildeling> | undefined>,
    MutationResult<OpprettTildelingMutation>,
] => {
    const [tildelinger, setTildelinger] = useRecoilState(tildelingState);
    const client = useApolloClient();
    const [opprettTildelingMutation, data] = useMutation(OpprettTildelingDocument);
    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();

    const opprettTildeling = (oppgavereferanse: string): Promise<Maybe<Tildeling> | undefined> => {
        fjernTildelingsvarsel();
        return opprettTildelingMutation({
            variables: { oppgaveId: oppgavereferanse },
            update: (cache, result) => {
                cache.modify({
                    id: cache.identify({ __typename: 'OppgaveForOversiktsvisning', id: oppgavereferanse }),
                    fields: {
                        tildeling: () => result.data?.opprettTildeling ?? null,
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
            .catch((e: ApolloError) => {
                const errorCode = (e.graphQLErrors[0].extensions['code'] as { value: number }).value;
                const tildeling = e.graphQLErrors[0].extensions['tildeling'] as Tildeling;
                if (errorCode === 409) leggTilTildelingsvarsel(`${tildeling.navn} har allerede tatt saken.`);
                else leggTilTildelingsvarsel('Kunne ikke tildele sak.');

                client.refetchQueries({ include: [FetchOppgaverDocument] });
                return Promise.reject('Kunne ikke tildele sak.');
            });
    };
    return [opprettTildeling, data];
};
export const useFjernTildeling = (): [
    (oppgavereferanse: string) => Promise<Maybe<boolean> | undefined>,
    MutationResult<OpprettTildelingMutation>,
] => {
    const [tildelinger, setTildelinger] = useRecoilState(tildelingState);
    const [fjernTildelingMutation, data] = useMutation(FjernTildelingDocument);

    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();

    const fjernTildeling = (oppgavereferanse: string): Promise<Maybe<boolean> | undefined> => {
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
                    [oppgavereferanse]: null,
                });
                return result.data?.fjernTildeling;
            })
            .catch(() => {
                leggTilTildelingsvarsel('Kunne ikke fjerne tildeling av sak.');
                return Promise.reject('Kunne ikke fjerne tildeling av sak.');
            });
    };
    return [fjernTildeling, data];
};
export const useLeggPåVent = (): ((
    oppgavereferanse: string,
    notat: NotatDTO,
    vedtaksperiodeId: string,
) => Promise<Maybe<Tildeling> | undefined>) => {
    const [tildelinger, setTildelinger] = useRecoilState(tildelingState);
    const [leggPåVentMutation] = useMutation(LeggPaaVentDocument);

    return (oppgavereferanse: string, notat: NotatDTO, vedtaksperiodeId: string) => {
        return leggPåVentMutation({
            refetchQueries: [{ query: FetchNotaterDocument, variables: { forPerioder: [vedtaksperiodeId] } }],
            variables: { oppgaveId: oppgavereferanse, notatType: NotatType.PaaVent, notatTekst: notat.tekst },
            update: (cache, result) => {
                cache.modify({
                    id: cache.identify({ __typename: 'OppgaveForOversiktsvisning', id: oppgavereferanse }),
                    fields: {
                        tildeling: () => result.data?.leggPaaVent ?? null,
                    },
                });
            },
        })
            .then((response) => {
                setTildelinger({
                    ...tildelinger,
                    [oppgavereferanse]: response.data?.leggPaaVent,
                });
                return response.data?.leggPaaVent;
            })
            .catch(() => Promise.reject('Kunne ikke legge oppgave på vent.'));
    };
};
export const useFjernPåVent = (): [
    (oppgavereferanse: string) => Promise<Maybe<Tildeling> | undefined>,
    MutationResult<FjernPaaVentMutation>,
] => {
    const [tildelinger, setTildelinger] = useRecoilState(tildelingState);
    const [fjernPåVentMutation, data] = useMutation(FjernPaaVentDocument);
    const fjernPåVent = async (oppgavereferanse: string) =>
        fjernPåVentMutation({
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
            .then((response) => {
                setTildelinger({
                    ...tildelinger,
                    [oppgavereferanse]: response.data?.fjernPaaVent,
                });
                return response.data?.fjernPaaVent;
            })
            .catch(() => Promise.reject('Kunne ikke fjerne på-vent-status fra oppgave.'));

    return [fjernPåVent, data];
};
