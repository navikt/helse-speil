import { logger } from '@navikt/next-logger';

import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { pushEventEtterForsinkelse } from '@spesialist-mock/saksbehandling';
import { finnFødselsnummerForVedtaksperiodeId } from '@spesialist-mock/storage/person';

export type Params = { vedtaksperiodeId: string };

export const stub = async (_request: Request, params: Promise<Params>) => {
    const { vedtaksperiodeId } = await params;

    if (Math.random() < 0.5) {
        logger.info(`Stub: forkaster vedtaksperiode ${vedtaksperiodeId}`);
        pushEventEtterForsinkelse(
            finnFødselsnummerForVedtaksperiodeId(vedtaksperiodeId)!,
            ApiServerSentEventEvent.PERSONDATA_OPPDATERT,
        );
        return new Response(null, { status: 204 });
    } else {
        logger.info(`Stub: det "feilet" å forkaste ${vedtaksperiodeId}`);
        return new Response(null, { status: 500 });
    }
};
