import { useEffect } from 'react';

import { ApiOpptegnelse } from '@io/rest/generated/spesialist.schemas';
import { useMottaOpptegnelserViaSSE } from '@state/opptegnelser';

export const useAbonnerPåEndringer = (personPseudoId?: string) => {
    const settOpptegnelser = useMottaOpptegnelserViaSSE();

    useEffect(() => {
        if (!personPseudoId) return;

        let tilkoblingLukket = false;
        let gjeldendeEs: EventSource | undefined;
        let retryTimeout: ReturnType<typeof setTimeout> | undefined;

        const kobleTilEventStream = () => {
            if (tilkoblingLukket) return;

            gjeldendeEs = new EventSource(`/api/spesialist/personer/${personPseudoId}/opptegnelser-stream`);

            gjeldendeEs.onmessage = (event) => {
                const data: ApiOpptegnelse = JSON.parse(event.data);
                // Her kan man på sikt invalidere respektive queries basert på hvilken opptegnelse-type vi mottok
                settOpptegnelser(data);
            };

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
    }, [personPseudoId, settOpptegnelser]);
};
