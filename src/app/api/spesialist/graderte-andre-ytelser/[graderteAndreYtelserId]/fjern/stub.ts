import {
    ApiGraderteAndreYtelserFjernetEvent,
    ApiPostFjernGraderteAndreYtelserRequest,
} from '@io/rest/generated/spesialist.schemas';
import { GraderteAndreYtelserMock } from '@spesialist-mock/storage/graderteAndreYtelser';

export const stub = async (request: Request, params: Promise<{ graderteAndreYtelserId: string }>) => {
    const { graderteAndreYtelserId } = await params;
    const requestBody: ApiPostFjernGraderteAndreYtelserRequest = await request.json();

    const fjernet = GraderteAndreYtelserMock.settFjernet(graderteAndreYtelserId, true);
    if (fjernet === undefined) return new Response(null, { status: 404 });

    fjernet.events.push({
        type: 'ApiGraderteAndreYtelserFjernetEvent',
        metadata: GraderteAndreYtelserMock.byggEventMetadata(requestBody.notatTilBeslutter, fjernet.events),
    } as ApiGraderteAndreYtelserFjernetEvent);

    return Response.json({ andreYtelserId: fjernet.andreYtelserId });
};
