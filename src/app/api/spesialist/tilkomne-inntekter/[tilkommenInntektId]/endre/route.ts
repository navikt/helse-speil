import { erLokal } from '@/env';
import { videresendTilSpesialist } from '@app/api/spesialist/forwarder';
import { PostTilkommenInntektEndreRequestBody } from '@io/graphql';
import { sleep } from '@spesialist-mock/constants';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function POST(req: Request, { params }: { params: Promise<{ tilkommenInntektId: string }> }) {
    if (erLokal) {
        const { tilkommenInntektId } = await params;
        const input = (await req.json()) as PostTilkommenInntektEndreRequestBody;
        await sleep(2000);
        return Response.json(
            TilkommenInntektMock.endreTilkommenInntekt(input.endretTil, input.notatTilBeslutter, tilkommenInntektId),
        );
    } else {
        return videresendTilSpesialist(req);
    }
}
