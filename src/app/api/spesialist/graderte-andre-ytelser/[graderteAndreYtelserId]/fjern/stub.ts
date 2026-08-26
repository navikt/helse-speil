import { ApiPostFjernGraderteAndreYtelserRequest } from '@io/rest/generated/spesialist.schemas';
import { GraderteAndreYtelserMock } from '@spesialist-mock/storage/graderteAndreYtelser';

export const stub = async (request: Request, params: Promise<{ graderteAndreYtelserId: string }>) => {
    const { graderteAndreYtelserId } = await params;
    // Notatet lagres ikke i mocken – spesialist eier endringsloggen.
    await (request.json() as Promise<ApiPostFjernGraderteAndreYtelserRequest>);

    const fjernet = GraderteAndreYtelserMock.settFjernet(graderteAndreYtelserId, true);
    if (fjernet === undefined) return new Response(null, { status: 404 });

    return Response.json({ andreYtelserId: fjernet.andreYtelserId });
};
