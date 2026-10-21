import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { PersonMock } from '@spesialist-mock/storage/person';

export const stub = async (_request: Request, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;

    pushEventEtterForsinkelse(
        PersonMock.findFødselsnummerForPersonPseudoId(pseudoId)!,
        ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE,
    );

    return new Response(null, { status: 204 });
};
