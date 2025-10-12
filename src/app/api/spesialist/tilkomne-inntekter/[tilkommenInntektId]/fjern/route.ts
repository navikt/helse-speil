import { erLokal } from '@/env';
import { forwardToSpesialist } from '@app/api/spesialist/forwarder';
import { PostTilkommenInntektFjernRequestBody } from '@io/graphql';
import { sleep } from '@spesialist-mock/constants';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function POST(req: Request, { params }: { params: Promise<{ tilkommenInntektId: string }> }) {
    const requestBody = await req.json();
    const { tilkommenInntektId } = await params;

    if (erLokal) {
        await sleep(2000);
        const input = requestBody as PostTilkommenInntektFjernRequestBody;
        return Response.json(TilkommenInntektMock.fjernTilkommenInntekt(input.notatTilBeslutter, tilkommenInntektId));
    } else {
        return await forwardToSpesialist(req);
    }
}
