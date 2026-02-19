import { useAtomValue, useSetAtom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';
import { useEffect } from 'react';

import { ApiServerSentEvent } from '@io/rest/generated/spesialist.schemas';

const sisteEventsState = atomWithReset<ApiServerSentEvent[]>([]);
export const useHåndterNyttEvent = (onNyttEvent: (o: ApiServerSentEvent) => void) => {
    const events = useAtomValue(sisteEventsState);
    const resetEvents = useResetAtom(sisteEventsState);
    useEffect(() => {
        if (events.length > 0) {
            events.forEach((o) => onNyttEvent(o));
            resetEvents();
        }
    }, [onNyttEvent, events, resetEvents]);
};
export const useMottaServerSentEvents = () => {
    const setServerSentEvents = useSetAtom(sisteEventsState);
    return (serverSentEvent: ApiServerSentEvent) => {
        setServerSentEvents((prev) => [...prev, serverSentEvent]);
    };
};
export const erNyOppgaveEvent = (event: ApiServerSentEvent): boolean =>
    event.event === 'NY_SAKSBEHANDLEROPPGAVE' || event.event === 'REVURDERING_FERDIGBEHANDLET';
