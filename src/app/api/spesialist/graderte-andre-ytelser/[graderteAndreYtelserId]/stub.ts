import { ApiPatchEndreGraderteAndreYtelserRequest } from '@io/rest/generated/spesialist.schemas';
import { GraderteAndreYtelserMock } from '@spesialist-mock/storage/graderteAndreYtelser';

export const stub = async (request: Request, params: Promise<{ graderteAndreYtelserId: string }>) => {
    const { graderteAndreYtelserId } = await params;
    const requestBody: ApiPatchEndreGraderteAndreYtelserRequest = await request.json();

    const endret = GraderteAndreYtelserMock.endre(graderteAndreYtelserId, {
        perioder: requestBody.perioder,
        andreYtelserType: requestBody.andreYtelserType,
    });

    if (endret === undefined) return new Response(null, { status: 404 });

    return Response.json({ andreYtelserId: endret.andreYtelserId });
};
