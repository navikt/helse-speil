import { erLokal } from '@/env';
import { videresendTilSpesialist } from '@app/api/spesialist/videresender';
import { PostTilkommenInntektFjernRequestBody } from '@io/graphql';
import { sleep } from '@spesialist-mock/constants';
import { TilkommenInntektMock } from '@spesialist-mock/storage/tilkommeninntekt';

export async function POST(req: Request, { params }: { params: Promise<{ tilkommenInntektId: string }> }) {
    if (erLokal) {
        const { tilkommenInntektId } = await params;
        const input = (await req.json()) as PostTilkommenInntektFjernRequestBody;
        await sleep(2000);
        return Response.json(TilkommenInntektMock.fjernTilkommenInntekt(input.notatTilBeslutter, tilkommenInntektId));
    } else {
        return videresendTilSpesialist(req);
    }
}
