import { ApiOpptegnelseType } from '@io/rest/generated/spesialist.schemas';
import { finnFødselsnummer } from '@spesialist-mock/graphql';
import { OpptegnelseMock } from '@spesialist-mock/storage/opptegnelse';

export const stub = async (_request: Request, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;

    setTimeout(() => {
        OpptegnelseMock.pushOpptegnelse(finnFødselsnummer(pseudoId)!, ApiOpptegnelseType.NY_SAKSBEHANDLEROPPGAVE);
    }, 2000);

    return new Response(null, { status: 204 });
};
