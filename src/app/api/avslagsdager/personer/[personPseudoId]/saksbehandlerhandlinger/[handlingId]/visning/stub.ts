import { NextRequest } from 'next/server';

import { Handlingsvisning } from '@io/rest/handlingsvisning';
import {
    AVSLAGSDAGER_ENDRET_HANDLING_ID,
    SaksbehandlerhandlingMock,
} from '@spesialist-mock/storage/saksbehandlerhandling';

export const stub = async (_request: NextRequest, params: Promise<{ personPseudoId: string; handlingId: string }>) => {
    const { personPseudoId, handlingId } = await params;
    const finnes = SaksbehandlerhandlingMock.hentHandlinger(personPseudoId).some(
        (handling) => handling.handlingId === handlingId,
    );
    const visning = finnes ? visninger[handlingId] : undefined;
    if (!visning) return new Response(null, { status: 404 });
    return Response.json(visning);
};

// Samme felter og format som sp-avslagsdager svarer med
const visninger: Record<string, Handlingsvisning> = {
    [AVSLAGSDAGER_ENDRET_HANDLING_ID]: {
        felter: [
            { type: 'LISTE', tittel: 'Dager', elementer: ['15.07.2024–19.07.2024', '22.07.2024'] },
            { type: 'TEKST', tittel: 'Utfall', tekst: 'Ikke oppfylt' },
            {
                type: 'LISTE',
                tittel: 'Vilkår',
                elementer: ['§ 8-9 første ledd: Ikke oppfylt', '§ 8-9 andre ledd: Ikke oppfylt'],
            },
            {
                type: 'TEKST',
                tittel: 'Begrunnelse',
                tekst: 'Personen oppholdt seg utenfor EØS i perioden, og ingen av unntakene gjelder.',
            },
            { type: 'LISTE', tittel: 'Journalposter', elementer: ['453912345'] },
        ],
    },
};
