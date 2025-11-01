import { erLokal } from '@/env';
import { videresendTilSpesialist } from '@app/api/spesialist/forwarder';

export async function GET(req: Request) {
    if (erLokal) {
        return Response.json([
            {
                ident: 'A123456',
                navn: 'Utvikler, Lokal',
                oid: '31cfdfe8-cd9b-4d28-850f-ab9ccc0ea281',
            },
        ]);
    } else {
        return videresendTilSpesialist(req);
    }
}
