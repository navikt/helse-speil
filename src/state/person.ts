import { useParams } from 'next/navigation';

import {
    getGetAktivOppgaveForPersonQueryKey,
    getGetSaksbildeForPersonQueryKey,
    getGetTildelingForPersonQueryKey,
    getGetTotrinnsvurderingForPersonQueryKey,
    useGetAktivOppgaveForPerson,
    useGetSaksbildeForPerson,
    useGetTildelingForPerson,
    useGetTotrinnsvurderingForPerson,
} from '@io/rest/generated/personer/personer';
import { ApiBehandling, ApiPeriode, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { QueryClient, hashKey, useQueryClient } from '@tanstack/react-query';

const usePersonPseudoId = (): string | undefined => useParams<{ personPseudoId?: string }>().personPseudoId;

export const useFetchPersonQuery = () => {
    const personPseudoId = usePersonPseudoId();
    const queryClient = useQueryClient();
    const query = useGetSaksbildeForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    // Saksbildet avhenger av aktiv oppgave, totrinnsvurdering og tildeling, så det vises først når alle er lastet
    const aktivOppgaveQuery = useGetAktivOppgaveForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    const totrinnsvurderingQuery = useGetTotrinnsvurderingForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    const tildelingQuery = useGetTildelingForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    const loading =
        query.isLoading || aktivOppgaveQuery.isLoading || totrinnsvurderingQuery.isLoading || tildelingQuery.isLoading;

    return {
        data: loading ? undefined : query.data,
        loading,
        error: query.error ?? aktivOppgaveQuery.error ?? totrinnsvurderingQuery.error ?? tildelingQuery.error,
        refetch: async () => {
            if (personPseudoId) await refetchPersondata(queryClient, personPseudoId);
        },
    };
};

export function useErPersonUnderLasting(): boolean {
    const personPseudoId = usePersonPseudoId();
    const { isLoading, isRefetching } = useGetSaksbildeForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    return isLoading || isRefetching;
}

export const useOppdaterPersonICache = () => {
    const queryClient = useQueryClient();
    const personPseudoId = usePersonPseudoId();

    return (oppdater: (person: ApiSaksbildePerson) => ApiSaksbildePerson) => {
        if (!personPseudoId) return;
        queryClient.setQueryData<ApiSaksbildePerson>(getGetSaksbildeForPersonQueryKey(personPseudoId), (person) =>
            person ? oppdater(person) : person,
        );
    };
};

export const useRefetchPerson = () => {
    const queryClient = useQueryClient();
    const personPseudoId = usePersonPseudoId();

    return async () => {
        if (!personPseudoId) return;
        await refetchPersondata(queryClient, personPseudoId);
    };
};

export const refetchPersondata = async (queryClient: QueryClient, personPseudoId: string) => {
    const nøkler = [
        getGetSaksbildeForPersonQueryKey(personPseudoId),
        getGetAktivOppgaveForPersonQueryKey(personPseudoId),
        getGetTotrinnsvurderingForPersonQueryKey(personPseudoId),
        getGetTildelingForPersonQueryKey(personPseudoId),
    ].map((nøkkel) => hashKey(nøkkel));
    await queryClient.refetchQueries({ predicate: (query) => nøkler.includes(query.queryHash) });
};

export const mapPerioder = (
    person: ApiSaksbildePerson,
    fn: (periode: ApiPeriode) => ApiPeriode,
): ApiSaksbildePerson => {
    const mapBehandlinger = (behandlinger: ApiBehandling[]): ApiBehandling[] =>
        behandlinger.map((behandling) => ({ ...behandling, perioder: behandling.perioder.map(fn) }));

    return {
        ...person,
        arbeidsgivere: person.arbeidsgivere.map((arbeidsgiver) => ({
            ...arbeidsgiver,
            behandlinger: mapBehandlinger(arbeidsgiver.behandlinger),
        })),
        selvstendigNaering: person.selvstendigNaering
            ? { ...person.selvstendigNaering, behandlinger: mapBehandlinger(person.selvstendigNaering.behandlinger) }
            : person.selvstendigNaering,
    };
};
