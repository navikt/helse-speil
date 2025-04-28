import { logger } from '@/logger';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: Promise<{ organisasjonsnummer: string }> }) {
    const { organisasjonsnummer } = await params;

    logger.info(`Mocker sparkel-areg lokalt`);

    return Response.json(
        {
            organisasjonsnummer: organisasjonsnummer,
            navn: stubNavn[parseInt(organisasjonsnummer) % stubNavn.length],
        },
        { status: 200 },
    );
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
