import { NextRequest } from 'next/server';

import { vurderMedlemskap } from '@app/api/medlemskap/personer/[personPseudoId]/vilkarsvurderinger/medlemskapMock';
import {
    ApiManuellVilkårsvurderingRequest,
    ApiManuellVilkårsvurderingResponse,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { registrerManuellMedlemskapsvurdering } from '@spesialist-mock/saksbehandling';
import { pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { PersonMock } from '@spesialist-mock/storage/person';

export const stub = async (request: NextRequest, params: Promise<{ personPseudoId: string }>) => {
    const { personPseudoId } = await params;
    const body: ApiManuellVilkårsvurderingRequest = await request.json();
    const medlemskapsvurderingId = vurderMedlemskap(personPseudoId, body);
    if (medlemskapsvurderingId === undefined) {
        return problemDetails(409, null, 'Medlemskapsvurderingen er endret siden saksbehandler så på den');
    }
    const response: ApiManuellVilkårsvurderingResponse = { medlemskapsvurderingId };
    registrerManuellMedlemskapsvurdering(personPseudoId, response.medlemskapsvurderingId, body.skjæringstidspunkt);

    // Mocker at spleis reberegner og spesialist lager ny oppgave etter overstyringen
    const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(personPseudoId);
    if (fødselsnummer) pushEventEtterForsinkelse(fødselsnummer, ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE);

    return Response.json(response);
};
