import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const tryParse = (tekst: string): unknown => {
    try {
        return JSON.parse(tekst);
    } catch {
        return tekst;
    }
};

export async function stub(request: NextRequest) {
    const parameters = await request.formData();
    const json = parameters.get('json');
    const begrunnelse = parameters.get('begrunnelse');

    if (typeof json !== 'string' || typeof begrunnelse !== 'string' || begrunnelse.length < 15) {
        return Response.json(
            { meldinger: [{ feil: 'Ugyldig request: mangler json eller for kort begrunnelse' }] },
            { status: 400 },
        );
    }

    return Response.json({
        meldinger: [
            {
                id: uuidv4(),
                tidspunkt: new Date().toISOString(),
                melding: tryParse(json),
                metadata: { topic: 'tbd.mock.v1', offset: 0, partition: 0 },
            },
        ],
        lenker: {
            kibana: 'https://logs.adeo.no',
            consoleCloudGoogle: 'https://console.cloud.google.com',
            trace: 'https://console.cloud.google.com',
        },
    });
}
