import { erLokal } from '@/env';
import { videresendTilSpesialist } from '@app/api/spesialist/videresender';
import { ApiLeggTilTilkommenInntektRequest } from '@io/rest/generated/spesialist.schemas';
import { sleep } from '@spesialist-mock/constants';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function POST(req: Request) {
    if (erLokal) {
        const input = (await req.json()) as ApiLeggTilTilkommenInntektRequest;
        await sleep(2000);
        return Response.json(
            TilkommenInntektMock.leggTilTilkommenInntekt(input.fodselsnummer, input.notatTilBeslutter, input.verdier),
        );
    } else {
        return videresendTilSpesialist(req);
    }
}
