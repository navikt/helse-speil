import { v4 as uuidv4 } from 'uuid';

import { erLokal, getServerEnv } from '@/env';
import { logger } from '@/logger';
import { byttTilOboToken, hentWonderwallToken } from '@auth/token';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ organisasjonsnummer: string }> }) {
    const { organisasjonsnummer } = await params;

    if (erLokal) {
        logger.info(`Mocker sparkel-aareg lokalt`);

        return Response.json(
            {
                organisasjonsnummer: organisasjonsnummer,
                navn: stubNavn[parseInt(organisasjonsnummer) % stubNavn.length],
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

const stubNavn = [
    'Amundsen og Sønner',
    'Johansen og Sønner',
    'Olsen, Arnesen og Jensen',
    'Østli Gruppen',
    'Vedvik, Wold og Larsen',
    'Berntsen, Torgersen og Andresen',
    'Kleven, Torp og Røed',
    'Johnsen-Glosli',
    'Tangen ASA',
    'Moen, Karlsen og Gran',
    'Nordskaug-Nielsen',
    'Mathisen ASA',
    'Nordby-Nielsen',
    'Aalerud, Olstad og Berg',
    'Olsen Gruppen',
    'Aasen-Aalerud',
    'Eriksen-Krogh',
    'Lie BA',
    'Karlsen AS',
    'Skuterud-Carlsen',
];
