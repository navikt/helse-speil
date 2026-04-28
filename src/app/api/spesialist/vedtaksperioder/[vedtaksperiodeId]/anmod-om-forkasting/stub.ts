import { logger } from '@navikt/next-logger';

import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { ServerSentEventsMock } from '@spesialist-mock/storage/events';
import { finnFødselsnummerForVedtaksperiodeId } from '@spesialist-mock/storage/person';

export type Params = { vedtaksperiodeId: string };

export const stub = async (_request: Request, params: Promise<Params>) => {
    const { vedtaksperiodeId } = await params;

    if (Math.random() < 0.5) {
        logger.info(`Stub: forkaster vedtaksperiode ${vedtaksperiodeId}`);
        setTimeout(() => {
            const fødselsnummer = finnFødselsnummerForVedtaksperiodeId(vedtaksperiodeId)!;
            const eventtype = ApiServerSentEventEvent.PERSONDATA_OPPDATERT;
            logger.info(`Legger til event ${eventtype} i SSE-mock`);
            ServerSentEventsMock.pushEvent(fødselsnummer, eventtype);
        }, 2000);
        return new Response(null, { status: 204 });
    } else {
        logger.info(`Stub: det "feilet" å forkaste ${vedtaksperiodeId}`);
        return new Response(null, { status: 500 });
    }
};
