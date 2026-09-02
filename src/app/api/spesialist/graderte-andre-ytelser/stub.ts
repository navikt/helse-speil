import { v4 } from 'uuid';

import {
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserOpprettetEvent,
    ApiLeggTilGraderteAndreYtelserRequest,
} from '@io/rest/generated/spesialist.schemas';
import { GraderteAndreYtelserMock } from '@spesialist-mock/storage/graderteAndreYtelser';

export const stub = async (request: Request) => {
    const requestBody: ApiLeggTilGraderteAndreYtelserRequest = await request.json();

    const nyAndreYtelserId = v4();

    const graderteAndreYtelser: ApiGraderteAndreYtelser = {
        andreYtelserId: nyAndreYtelserId,
        andreYtelserType: requestBody.andreYtelserType,
        perioder: requestBody.perioder,
        fjernet: false,
        events: [
            {
                type: 'ApiGraderteAndreYtelserOpprettetEvent',
                metadata: GraderteAndreYtelserMock.byggEventMetadata(requestBody.notatTilBeslutter, []),
                perioder: requestBody.perioder,
                andreYtelserType: requestBody.andreYtelserType,
            } as ApiGraderteAndreYtelserOpprettetEvent,
        ],
    };

    GraderteAndreYtelserMock.leggTil(requestBody.fodselsnummer, graderteAndreYtelser);

    return Response.json({ andreYtelserId: nyAndreYtelserId });
};
