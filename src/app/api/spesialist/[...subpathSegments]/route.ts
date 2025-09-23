import { v4 as uuidv4 } from 'uuid';

import { erLokal, getServerEnv } from '@/env';
import { logger } from '@/logger';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ subpathSegments: string[] }> }) {
    const { subpathSegments } = await params;

    // Unngå kreative angrep - whitelist hvilke subpaths som er lov
    const whitelist = /^[A-Za-zæøåÆØÅ0-9\-]+$/;
    for (const segment of subpathSegments) {
        if (!whitelist.test(segment)) return Response.json({}, { status: 404 });
    }

    const subpath = subpathSegments.join('/');

    if (erLokal) {
        if (subpathSegments[0] == 'personer') {
            const aktørId = subpathSegments[1];
            if (subpathSegments[2] == 'tilkomne-inntekter') {
                logger.info(`Mocker tilkomne inntekter lokalt`);

                return aktørId === '12345'
                    ? Response.json({}, { status: 404 })
                    : Response.json(TilkommenInntektMock.tilkomneInntektskilderV2('06028620819'), { status: 200 });
            }
        }
        return Response.json({ feil: 'Ikke mocket opp lokalt' }, { status: 404 });
    } else {
        const wonderwallToken = hentWonderwallToken(req);
        if (!wonderwallToken) {
            return new Response(null, { status: 401 });
        }

        const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().SPESIALIST_SCOPE);
        if (!oboResult.ok) {
            throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
        }

        return await fetch(`${getServerEnv().SPESIALIST_BASEURL}/api/${subpath}`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${oboResult.token}`,
                'X-Request-Id': uuidv4(),
                Accept: 'application/json',
            },
        });
    }
}
