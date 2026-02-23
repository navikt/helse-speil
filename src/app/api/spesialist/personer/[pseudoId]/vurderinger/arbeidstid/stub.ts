import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { ServerSentEventsMock } from '@spesialist-mock/storage/events';
import { PersonMock } from '@spesialist-mock/storage/person';

export const stub = async (_request: Request, params: Promise<{ pseudoId: string }>) => {
    const { pseudoId } = await params;

    setTimeout(() => {
        ServerSentEventsMock.pushEvent(
            PersonMock.findFødselsnummerForPersonPseudoId(pseudoId)!,
            ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE,
        );
    }, 2000);

    return new Response(null, { status: 204 });
};
