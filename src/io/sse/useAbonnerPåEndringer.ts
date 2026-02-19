import { useEffect } from 'react';

import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { useMottaServerSentEvents } from '@state/serverSentEvents';

export const useAbonnerPåEndringer = (personPseudoId?: string) => {
    const settEvents = useMottaServerSentEvents();

    useEffect(() => {
        if (!personPseudoId) return;

        let tilkoblingLukket = false;
        let gjeldendeEs: EventSource | undefined;
        let retryTimeout: ReturnType<typeof setTimeout> | undefined;

        const kobleTilEventStream = () => {
            if (tilkoblingLukket) return;

            gjeldendeEs = new EventSource(`/api/spesialist/personer/${personPseudoId}/sse`);

            for (const eventType of Object.values(ApiServerSentEventEvent)) {
                gjeldendeEs.addEventListener(eventType, (_) => {
                    settEvents({
                        event: eventType,
                        data: null,
                    });
                });
            }

            gjeldendeEs.onerror = () => {
                gjeldendeEs?.close();
                if (!tilkoblingLukket) {
                    retryTimeout = setTimeout(kobleTilEventStream, 3000);
                }
            };
        };

        kobleTilEventStream();

        return () => {
            tilkoblingLukket = true;
            if (retryTimeout) clearTimeout(retryTimeout);
            gjeldendeEs?.close();
        };
    }, [personPseudoId, settEvents]);
};
