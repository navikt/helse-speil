import { v4 } from 'uuid';

import { ApiGraderteAndreYtelser, ApiLeggTilGraderteAndreYtelserRequest } from '@io/rest/generated/spesialist.schemas';
import { GraderteAndreYtelserMock } from '@spesialist-mock/storage/graderteAndreYtelser';

export const stub = async (request: Request) => {
    const requestBody: ApiLeggTilGraderteAndreYtelserRequest = await request.json();

    const nyAndreYtelserId = v4();

    const graderteAndreYtelser: ApiGraderteAndreYtelser = {
        andreYtelserId: nyAndreYtelserId,
        andreYtelseType: requestBody.andreYtelseType,
        perioder: requestBody.perioder,
        fjernet: false,
    };

    GraderteAndreYtelserMock.leggTil(requestBody.fodselsnummer, graderteAndreYtelser);

    return Response.json({ andreYtelserId: nyAndreYtelserId });
};
