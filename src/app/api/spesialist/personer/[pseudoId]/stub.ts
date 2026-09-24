import { logger } from '@navikt/next-logger';

import {
    ApiGetPersonErrorCode,
    ApiHttpProblemDetailsApiGetPersonErrorCode,
} from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

export const stub = async (_request: Request, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;
    const identitetsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
    if (!identitetsnummer) return Response.error();

    const apiPerson = PersonMock.finnApiPerson(identitetsnummer);
    if (!apiPerson) {
        logger.warn(`Testpersonen med pseudoId ${pseudoId} mangler rest.person i testdatafila`);
        const problem: ApiHttpProblemDetailsApiGetPersonErrorCode = {
            type: 'about:blank',
            status: 404,
            title: 'Person ikke funnet',
            code: ApiGetPersonErrorCode.PERSON_IKKE_FUNNET,
        };
        return Response.json(problem, { status: 404 });
    }

    return Response.json(apiPerson, { status: 200 });
};
