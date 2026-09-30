import { useParams } from 'next/navigation';
import { useRef } from 'react';

import { useApolloClient } from '@apollo/client';
import { FetchPersonDocument } from '@io/graphql';
import { getGetNotatVedtaksperiodeIderForPersonQueryKey } from '@io/rest/generated/notater/notater';
import { useSelectPeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useToasts } from '@state/toasts';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshPersonVedEvent = () => {
    const { data } = useFetchPersonQuery();
    const apolloClient = useApolloClient();
    const refetchPågår = useRef(false);
    const selectPeriod = useSelectPeriod();
    const addToast = useAddToast();
    const toasts = useToasts();
    const queryClient = useQueryClient();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    useHåndterNyttEvent(async (event) => {
        if (data === undefined || refetchPågår.current) return;
        refetchPågår.current = true;
        try {
            await apolloClient.refetchQueries({ include: [FetchPersonDocument] });
        } finally {
            refetchPågår.current = false;
        }
        await queryClient.invalidateQueries({
            queryKey: getGetNotatVedtaksperiodeIderForPersonQueryKey(personPseudoId),
        });
        if (erNyOppgaveEvent(event)) {
            const person = apolloClient.readQuery({
                query: FetchPersonDocument,
                variables: { personPseudoId },
            })?.person;
            if (person) selectPeriod(person);
            if (toasts.length === 0) {
                addToast({
                    key: 'VedtaksperiodeReberegnetToastKey',
                    message: 'Perioden er reberegnet',
                    timeToLiveMs: 3000,
                });
            }
        }
    });
};
