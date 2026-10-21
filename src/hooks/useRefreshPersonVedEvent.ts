import { useParams } from 'next/navigation';
import { useRef } from 'react';

import { getGetNotatVedtaksperiodeIderForPersonQueryKey } from '@io/rest/generated/notater/notater';
import {
    getGetSaksbehandlerhandlingerForPersonQueryKey,
    getGetSaksbildeForPersonQueryKey,
} from '@io/rest/generated/personer/personer';
import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useSelectPeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useToasts } from '@state/toasts';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshPersonVedEvent = () => {
    const { data } = useFetchPersonQuery();
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
            await queryClient.refetchQueries({ queryKey: getGetSaksbildeForPersonQueryKey(personPseudoId) });
        } finally {
            refetchPågår.current = false;
        }
        await queryClient.invalidateQueries({
            queryKey: getGetNotatVedtaksperiodeIderForPersonQueryKey(personPseudoId),
        });
        await queryClient.invalidateQueries({
            queryKey: getGetSaksbehandlerhandlingerForPersonQueryKey(personPseudoId),
        });
        if (erNyOppgaveEvent(event)) {
            const person = queryClient.getQueryData<ApiSaksbildePerson>(
                getGetSaksbildeForPersonQueryKey(personPseudoId),
            );
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
