import { NextRequest } from 'next/server';

import { logger } from '@navikt/next-logger';

import { BackendNavn, skalStubbe } from '@app/api/backends';
import { lagVideresender } from '@app/api/videresender';
import { sleep } from '@spesialist-mock/constants';

type Stub<Params> = (request: NextRequest, params: Promise<Params>) => Promise<Response>;

// Stubben lastes med import() først i mock-grenen, så mockkoden aldri kjøres når vi videresender.
export function lagStubEllerVideresend({
    backend,
    videresend = lagVideresender(backend),
    forsinkelse = true,
}: {
    backend: BackendNavn;
    videresend?: (request: NextRequest) => Promise<Response>;
    forsinkelse?: boolean;
}) {
    return <Params>(lastStub: () => Promise<Stub<Params>>) =>
        async (request: NextRequest, { params }: { params: Promise<Params> }) => {
            if (!skalStubbe(backend)) return videresend(request);

            logger.info(`Svarer på ${request.method} ${request.url} med stub`);
            // Delay på 50-550ms for å se skeletons og loading-logikk i tilfeldig rekkefølge
            if (forsinkelse) await sleep(50 + Math.random() * 500);
            const stub = await lastStub();
            return stub(request, params);
        };
}
