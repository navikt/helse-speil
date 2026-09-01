import { ApiPostGjenopprettGraderteAndreYtelserRequest } from '@io/rest/generated/spesialist.schemas';
import { GraderteAndreYtelserMock } from '@spesialist-mock/storage/graderteAndreYtelser';

export const stub = async (request: Request, params: Promise<{ graderteAndreYtelserId: string }>) => {
    const { graderteAndreYtelserId } = await params;
    // Notatet lagres ikke i mocken – spesialist eier endringsloggen.
    const requestBody: ApiPostGjenopprettGraderteAndreYtelserRequest = await request.json();

    const endret = GraderteAndreYtelserMock.endre(graderteAndreYtelserId, {
        perioder: requestBody.perioder,
        andreYtelserType: requestBody.andreYtelserType,
    });
    if (endret === undefined) return new Response(null, { status: 404 });

    GraderteAndreYtelserMock.settFjernet(graderteAndreYtelserId, false);

    return Response.json({ andreYtelserId: endret.andreYtelserId });
};
