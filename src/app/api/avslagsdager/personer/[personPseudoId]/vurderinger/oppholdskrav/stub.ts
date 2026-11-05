import { lagreOppholdskravvurdering } from '@app/api/avslagsdager/avslagsdagerMock';
import {
    ApiOppholdskravvurderingRequest,
    ApiOppholdskravvurderingResponse,
} from '@io/rest/generated/avslagsdager/avslagsdager.schemas';
import { problemDetails } from '@spesialist-mock/problemDetails';
import { registrerManuellVurderingAvOppholdskrav } from '@spesialist-mock/saksbehandling';
import { PersonMock } from '@spesialist-mock/storage/person';

export async function stub(request: Request, params: Promise<{ personPseudoId: string }>) {
    const { personPseudoId } = await params;
    if (PersonMock.findFødselsnummerForPersonPseudoId(personPseudoId) === null)
        return problemDetails(404, null, 'Person ikke funnet');

    const body: ApiOppholdskravvurderingRequest = await request.json();
    const resultat = lagreOppholdskravvurdering(body);
    if (resultat.type === 'FEIL') return problemDetails(400, null, resultat.tittel);

    // sp-avslagsdager sender saksbehandlerhandlingen til spesialist via outbox, med vurderings-ID-en som handlingId
    registrerManuellVurderingAvOppholdskrav(personPseudoId, resultat.vurderingId, body.behandlingId);

    const response: ApiOppholdskravvurderingResponse = { vurderingId: resultat.vurderingId };
    return Response.json(response);
}
