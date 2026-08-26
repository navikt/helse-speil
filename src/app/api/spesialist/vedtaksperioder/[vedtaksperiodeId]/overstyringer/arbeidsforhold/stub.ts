import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { ServerSentEventsMock } from '@spesialist-mock/storage/events';
import { finnFødselsnummerForVedtaksperiodeId } from '@spesialist-mock/storage/person';

export const stub = async (_request: Request, params: Promise<{ vedtaksperiodeId: string }>) => {
    const { vedtaksperiodeId } = await params;

    setTimeout(() => {
        ServerSentEventsMock.pushEvent(
            finnFødselsnummerForVedtaksperiodeId(vedtaksperiodeId)!,
            ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE,
        );
    }, 2000);

    return new Response(null, { status: 204 });
};
