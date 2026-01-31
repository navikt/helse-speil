import { ApiOpptegnelseType } from '@io/rest/generated/spesialist.schemas';
import { OpptegnelseMock } from '@spesialist-mock/storage/opptegnelse';
import { PersonMock } from '@spesialist-mock/storage/person';

export const stub = async (_request: Request, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;

    setTimeout(() => {
        OpptegnelseMock.pushOpptegnelse(
            PersonMock.findFødselsnummer(pseudoId)!,
            ApiOpptegnelseType.NY_SAKSBEHANDLEROPPGAVE,
        );
    }, 2000);

    return new Response(null, { status: 204 });
};
