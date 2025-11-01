import { erLokal } from '@/env';
import { forwardPOSTtoSpesialist } from '@app/api/spesialist/forwarder';
import { PostTilkomneInntekterRequestBody } from '@io/graphql';
import { sleep } from '@spesialist-mock/constants';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function POST(req: Request) {
    const requestBody = await req.json();

    if (erLokal) {
        await sleep(2000);
        const input = requestBody as PostTilkomneInntekterRequestBody;
        return Response.json(
            TilkommenInntektMock.leggTilTilkommenInntekt(input.fodselsnummer, input.notatTilBeslutter, input.verdier),
        );
    } else {
        return await forwardPOSTtoSpesialist(req, requestBody);
    }
}
