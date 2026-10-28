import { useParams } from 'next/navigation';
import { useRef } from 'react';

import { getGetNotatVedtaksperiodeIderForPersonQueryKey } from '@io/rest/generated/notater/notater';
import {
    getGetSaksbehandlerhandlingerForPersonQueryKey,
    getGetSaksbildeForPersonQueryKey,
} from '@io/rest/generated/personer/personer';
import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useSelectPeriod } from '@state/periode';
import { refetchPersondata, useFetchPersonQuery } from '@state/person';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useToasts } from '@state/toasts';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshPersonVedEvent = () => {
    const { data } = useFetchPersonQuery();
    const refetchPågår = useRef(false);
    const nyRefetchVenter = useRef(false);
    const ventendeNyOppgave = useRef(false);
    const selectPeriod = useSelectPeriod();
    const addToast = useAddToast();
    const toasts = useToasts();
    const queryClient = useQueryClient();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    useHåndterNyttEvent(async (event) => {
        if (data === undefined) return;
        ventendeNyOppgave.current ||= erNyOppgaveEvent(event);
        // Hendelser som kommer mens en refetch pågår, slås sammen til én ny refetch etterpå
        if (refetchPågår.current) {
            nyRefetchVenter.current = true;
            return;
        }
        refetchPågår.current = true;
        try {
            do {
                nyRefetchVenter.current = false;
                await refetchPersondata(queryClient, personPseudoId);
            } while (nyRefetchVenter.current);
        } finally {
            refetchPågår.current = false;
        }
        const harNyOppgave = ventendeNyOppgave.current;
        ventendeNyOppgave.current = false;
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: getGetNotatVedtaksperiodeIderForPersonQueryKey(personPseudoId),
            }),
            queryClient.invalidateQueries({
                queryKey: getGetSaksbehandlerhandlingerForPersonQueryKey(personPseudoId),
            }),
        ]);
        if (harNyOppgave) {
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
