import { NetworkStatus } from '@apollo/client';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser } from '@state/opptegnelser';
import { useSelectPeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useToasts } from '@state/toasts';

export const useRefreshPersonVedOpptegnelse = () => {
    const { data, networkStatus, refetch } = useFetchPersonQuery();
    const selectPeriod = useSelectPeriod();
    const addToast = useAddToast();
    const toasts = useToasts();

    useHåndterOpptegnelser(async (opptegnelse) => {
        if (data !== undefined && !(networkStatus in [NetworkStatus.loading, NetworkStatus.refetch])) {
            const result = await refetch();
            if (erOpptegnelseForNyOppgave(opptegnelse)) {
                if (result.data.person) selectPeriod(result.data.person);
                if (toasts.length === 0) {
                    addToast({
                        key: 'VedtaksperiodeReberegnetToastKey',
                        message: 'Perioden er reberegnet',
                        timeToLiveMs: 3000,
                    });
                }
            }
        }
    });

    useHåndterNyttEvent(async (event) => {
        if (data !== undefined && !(networkStatus in [NetworkStatus.loading, NetworkStatus.refetch])) {
            const result = await refetch();
            if (erNyOppgaveEvent(event)) {
                if (result.data.person) selectPeriod(result.data.person);
                if (toasts.length === 0) {
                    addToast({
                        key: 'VedtaksperiodeReberegnetToastKey',
                        message: 'Perioden er reberegnet',
                        timeToLiveMs: 3000,
                    });
                }
            }
        }
    });
};
