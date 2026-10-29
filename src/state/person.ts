import { useParams } from 'next/navigation';

import {
    getGetAktivOppgaveForPersonQueryKey,
    getGetArbeidsforholdForPersonQueryKey,
    getGetPaVentForPersonQueryKey,
    getGetSaksbildeForPersonQueryKey,
    getGetTildelingForPersonQueryKey,
    getGetTotrinnsvurderingForPersonQueryKey,
    useGetAktivOppgaveForPerson,
    useGetArbeidsforholdForPerson,
    useGetPaVentForPerson,
    useGetSaksbildeForPerson,
    useGetTildelingForPerson,
    useGetTotrinnsvurderingForPerson,
} from '@io/rest/generated/personer/personer';
import { ApiBehandling, ApiPeriode, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { QueryClient, QueryKey, hashKey, useQueryClient } from '@tanstack/react-query';

const usePersonPseudoId = (): string | undefined => useParams<{ personPseudoId?: string }>().personPseudoId;

export const useFetchPersonQuery = () => {
    const personPseudoId = usePersonPseudoId();
    const queryClient = useQueryClient();
    const query = useGetSaksbildeForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    // Saksbildet avhenger av aktiv oppgave, totrinnsvurdering, tildeling, påVent og arbeidsforhold, så det vises først når alle er lastet
    const aktivOppgaveQuery = useGetAktivOppgaveForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    const totrinnsvurderingQuery = useGetTotrinnsvurderingForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    const tildelingQuery = useGetTildelingForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    const påVentQuery = useGetPaVentForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    const arbeidsforholdQuery = useGetArbeidsforholdForPerson(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    const loading =
        query.isLoading ||
        aktivOppgaveQuery.isLoading ||
        totrinnsvurderingQuery.isLoading ||
        tildelingQuery.isLoading ||
        påVentQuery.isLoading ||
        arbeidsforholdQuery.isLoading;

    return {
        data: loading ? undefined : query.data,
        loading,
        error:
            query.error ??
            aktivOppgaveQuery.error ??
            totrinnsvurderingQuery.error ??
            tildelingQuery.error ??
            påVentQuery.error ??
            arbeidsforholdQuery.error,
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
        getGetPaVentForPersonQueryKey(personPseudoId),
        getGetArbeidsforholdForPersonQueryKey(personPseudoId),
    ].map((nøkkel) => hashKey(nøkkel));
    await queryClient.refetchQueries({
        predicate: (query) => nøkler.includes(query.queryHash) || erVedtaksperiodenøkkel(query.queryKey),
    });
};

// Ressurser per vedtaksperiode lastes når de trengs, og alle som er i cachen refetches sammen med personen
const vedtaksperioderessurs = /^\/api\/spesialist\/vedtaksperioder\/([^/]+)\/(risikovurdering|annullering)$/;

const erVedtaksperiodenøkkel = (queryKey: QueryKey): boolean =>
    typeof queryKey[0] === 'string' && vedtaksperioderessurs.test(queryKey[0]);

export const vedtaksperiodeIdFraNøkkel = (
    queryKey: QueryKey,
    ressurs: 'risikovurdering' | 'annullering',
): string | null => {
    const treff = typeof queryKey[0] === 'string' ? vedtaksperioderessurs.exec(queryKey[0]) : null;
    return treff?.[2] === ressurs ? (treff[1] ?? null) : null;
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
