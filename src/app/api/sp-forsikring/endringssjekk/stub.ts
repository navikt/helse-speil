import { NextRequest } from 'next/server';

import { ApiSjekkEndringForsikringRequest } from '@io/rest/forsikring';
import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { ServerSentEventsMock } from '@spesialist-mock/storage/events';

let antallRevurderinger = 0;

export async function stub(request: NextRequest) {
    const { skjæringstidspunkt, identitetsnummer, behandlingId, vedtaksperiodeId }: ApiSjekkEndringForsikringRequest =
        await request.json();

    if (skjæringstidspunkt == null || identitetsnummer == null || behandlingId == null || vedtaksperiodeId == null)
        return new Response(null, { status: 400 });

    // Annenhver revurdering gir ny vurdering, slik at begge utfall kan testes lokalt
    antallRevurderinger += 1;
    const nyForsikringsvurdering = antallRevurderinger % 2 === 1;

    if (nyForsikringsvurdering) {
        setTimeout(() => {
            ServerSentEventsMock.pushEvent(identitetsnummer, ApiServerSentEventEvent.REVURDERING_FERDIGBEHANDLET);
        }, 2000);
    }

    return Response.json({ nyForsikringsvurdering }, { status: 200 });
}
