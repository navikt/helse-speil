import { ApolloCache, FetchResult, MutationResult, useMutation } from '@apollo/client';
import {
    AntallOppgaverDocument,
    FjernTildelingDocument,
    FjernTildelingMutation,
    Maybe,
    OppgaveFeedDocument,
    OpprettTildelingDocument,
    OpprettTildelingMutation,
    Tildeling,
    TildelingFragment,
} from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useFetchPersonQuery } from '@state/person';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { InfoAlert } from '@utils/error';

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

const useFødselsnummer = (): string | undefined => {
    const { data } = useFetchPersonQuery();
    return data?.person?.fodselsnummer;
};

const useOptimistiskTildeling = (): TildelingFragment => {
    const saksbehandler = useInnloggetSaksbehandler();
    return {
        __typename: 'Tildeling',
        navn: saksbehandler.navn,
        oid: saksbehandler.oid,
        epost: saksbehandler.epost,
    };
};

export const useOpprettTildeling = (): [
    (oppgavereferanse: string) => Promise<FetchResult<OpprettTildelingMutation>>,
    MutationResult<OpprettTildelingMutation>,
] => {
    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();
    const fødselsnummer = useFødselsnummer();
    const optimistiskTildeling = useOptimistiskTildeling();
    const [opprettTildelingMutation, data] = useMutation(OpprettTildelingDocument, {
        refetchQueries: [OppgaveFeedDocument, AntallOppgaverDocument],
        onError: (error) => {
            const errorCode = (error.graphQLErrors?.[0].extensions?.['code'] as { value: number }).value;
            if (errorCode === 409) {
                const tildeling = error.graphQLErrors?.[0].extensions?.['tildeling'] as Tildeling;
                leggTilTildelingsvarsel(`${tildeling.navn} har allerede tatt saken.`);
            } else {
                leggTilTildelingsvarsel('Kunne ikke tildele sak.');
            }
            data.client.refetchQueries({ include: [OppgaveFeedDocument, AntallOppgaverDocument] });
        },
    });

    const opprettTildeling = async (oppgavereferanse: string) => {
        fjernTildelingsvarsel();
        return opprettTildelingMutation({
            variables: { oppgaveId: oppgavereferanse },
            optimisticResponse: {
                __typename: 'Mutation',
                opprettTildeling: optimistiskTildeling,
            },
            update: (cache, result) =>
                oppdaterTildelingICache(
                    cache,
                    oppgavereferanse,
                    fødselsnummer,
                    () => result.data?.opprettTildeling ?? null,
                ),
        });
    };
    return [opprettTildeling, data];
};
export const useFjernTildeling = (): [
    (oppgavereferanse: string) => Promise<FetchResult<FjernTildelingMutation>>,
    MutationResult<FjernTildelingMutation>,
] => {
    const fødselsnummer = useFødselsnummer();
    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();

    const [fjernTildelingMutation, data] = useMutation(FjernTildelingDocument, {
        refetchQueries: [OppgaveFeedDocument, AntallOppgaverDocument],
        onError: () => leggTilTildelingsvarsel('Kunne ikke fjerne tildeling av sak.'),
    });

    const fjernTildeling = async (oppgavereferanse: string) => {
        fjernTildelingsvarsel();
        return fjernTildelingMutation({
            variables: { oppgaveId: oppgavereferanse },
            optimisticResponse: { __typename: 'Mutation', fjernTildeling: true },
            update: (cache) => oppdaterTildelingICache(cache, oppgavereferanse, fødselsnummer, () => null),
        });
    };
    return [fjernTildeling, data];
};

const oppdaterTildelingICache = (
    cache: ApolloCache<unknown>,
    oppgavereferanse: string,
    fødselsnummer: string | undefined,
    tildeling: (tildeling: Tildeling) => Maybe<Tildeling>,
) => {
    cache.modify({
        id: cache.identify({ __typename: 'OppgaveTilBehandling', id: oppgavereferanse }),
        fields: {
            tildeling: (value) => tildeling(value),
        },
    });
    cache.modify({
        id: cache.identify({ __typename: 'Person', fodselsnummer: fødselsnummer }),
        fields: {
            tildeling: (value) => tildeling(value),
        },
    });
};
