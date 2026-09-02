import {
    ApiGraderteAndreYtelserGjenopprettetEvent,
    ApiPostGjenopprettGraderteAndreYtelserRequest,
} from '@io/rest/generated/spesialist.schemas';
import { GraderteAndreYtelserMock } from '@spesialist-mock/storage/graderteAndreYtelser';

export const stub = async (request: Request, params: Promise<{ graderteAndreYtelserId: string }>) => {
    const { graderteAndreYtelserId } = await params;
    const requestBody: ApiPostGjenopprettGraderteAndreYtelserRequest = await request.json();

    const eksisterende = GraderteAndreYtelserMock.finn(graderteAndreYtelserId);
    if (eksisterende === undefined) return new Response(null, { status: 404 });

    const endringer = GraderteAndreYtelserMock.tilEventEndringer(eksisterende, {
        perioder: requestBody.perioder,
        andreYtelserType: requestBody.andreYtelserType,
    });

    const endret = GraderteAndreYtelserMock.endre(graderteAndreYtelserId, {
        perioder: requestBody.perioder,
        andreYtelserType: requestBody.andreYtelserType,
    });
    if (endret === undefined) return new Response(null, { status: 404 });

    GraderteAndreYtelserMock.settFjernet(graderteAndreYtelserId, false);

    endret.events.push({
        type: 'ApiGraderteAndreYtelserGjenopprettetEvent',
        metadata: GraderteAndreYtelserMock.byggEventMetadata(requestBody.notatTilBeslutter, endret.events),
        endringer: endringer,
    } as ApiGraderteAndreYtelserGjenopprettetEvent);

    return Response.json({ andreYtelserId: endret.andreYtelserId });
};
