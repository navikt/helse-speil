import { useParams } from 'next/navigation';

import { getGetSaksbildeForPersonQueryKey, useGetSaksbildeForPerson } from '@io/rest/generated/personer/personer';
import { ApiBehandling, ApiPeriode, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useQueryClient } from '@tanstack/react-query';

const usePersonPseudoId = (): string | undefined => useParams<{ personPseudoId?: string }>().personPseudoId;

export const useFetchPersonQuery = () => {
    const personPseudoId = usePersonPseudoId();
    const query = useGetSaksbildeForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });

    return {
        data: query.data,
        loading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
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
        await queryClient.refetchQueries({ queryKey: getGetSaksbildeForPersonQueryKey(personPseudoId) });
    };
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
