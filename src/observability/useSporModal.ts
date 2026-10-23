import { useRef } from 'react';

import { Events } from '@navikt/analytics-types';

import { sporHendelse } from '@observability/hendelser';

type Lukkmetode = 'handlings-knapp' | 'programmatisk';

export function useSporModal(komponentId: string) {
    const åpnetTidspunkt = useRef<number | null>(null);

    return {
        åpnet: (opprinnelse: 'knapp' | 'hurtigtast') => {
            åpnetTidspunkt.current = Date.now();
            sporHendelse({ name: Events.MODAL_APNET, properties: { komponentId, opprinnelse } });
        },
        lukket: (lukkMetode?: Lukkmetode) => {
            if (åpnetTidspunkt.current === null) return;
            const varighetMs = Date.now() - åpnetTidspunkt.current;
            åpnetTidspunkt.current = null;
            sporHendelse({ name: Events.MODAL_LUKKET, properties: { komponentId, lukkMetode, varighetMs } });
        },
    };
}
