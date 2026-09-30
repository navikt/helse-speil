import { NextRequest } from 'next/server';

import { ApiSjekkEndringForsikringRequest } from '@io/rest/forsikring';
import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { ServerSentEventsMock } from '@spesialist-mock/storage/events';

let antallRevurderinger = 0;

export async function stub(request: NextRequest) {
    const { skjæringstidspunkt, identitetsnummer }: ApiSjekkEndringForsikringRequest = await request.json();

    if (skjæringstidspunkt == null || identitetsnummer == null) return new Response(null, { status: 400 });

    // Annenhver revurdering gir ny vurdering, slik at begge utfall kan testes lokalt
    antallRevurderinger += 1;
    const vurderingErEndret = antallRevurderinger % 2 === 1;

    if (vurderingErEndret) {
        setTimeout(() => {
            ServerSentEventsMock.pushEvent(identitetsnummer, ApiServerSentEventEvent.REVURDERING_FERDIGBEHANDLET);
        }, 2000);
    }

    return Response.json({ vurderingErEndret }, { status: 200 });
}
