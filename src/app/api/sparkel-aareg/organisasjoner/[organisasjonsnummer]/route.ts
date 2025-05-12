import { v4 as uuidv4 } from 'uuid';

import { erUtvikling, getServerEnv } from '@/env';
import { logger } from '@/logger';
import { stubnavnForOrganisasjonsnummer } from '@app/api/sparkel-aareg/organisasjoner/[organisasjonsnummer]/stubnavn';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ organisasjonsnummer: string }> }) {
    const { organisasjonsnummer } = await params;

    if (erUtvikling) {
        logger.info(`Mocker sparkel-aareg lokalt / i dev`);

        return organisasjonsnummer === '839942907'
            ? Response.json({}, { status: 404 })
            : Response.json(
                  {
                      organisasjonsnummer: organisasjonsnummer,
                      navn: stubnavnForOrganisasjonsnummer(organisasjonsnummer),
                  },
                  { status: 200 },
              );
    } else {
        const wonderwallToken = hentWonderwallToken(req);
        if (!wonderwallToken) {
            return new Response(null, { status: 401 });
        }

        const oboResult = await byttTilOboToken(wonderwallToken, getServerEnv().SPARKEL_AAREG_SCOPE);
        if (!oboResult.ok) {
            throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
        }

        return await fetch(`${getServerEnv().SPARKEL_AAREG_BASEURL}/organisasjoner/${organisasjonsnummer}`, {
            method: 'get',
            headers: {
                Authorization: `Bearer ${oboResult.token}`,
                'X-Request-Id': uuidv4(),
                Accept: 'application/json',
            },
        });
    }
}
