import { ApiPostManuelleInngangsvilkårVurderingerRequest } from '@io/rest/generated/spesialist.schemas';
import { VilkårsvurderingerMock } from '@spesialist-mock/storage/vilkårsvurderinger';

type Params = { pseudoId: string; skjaeringstidspunkt: string };

export const stub = async (request: Request, params: Promise<Params>) => {
    const { pseudoId, skjaeringstidspunkt } = await params;

    if (request.method === 'GET') {
        return Response.json(VilkårsvurderingerMock.hentVurderinger(pseudoId, skjaeringstidspunkt));
    }

    const requestBody: ApiPostManuelleInngangsvilkårVurderingerRequest = await request.json();
    VilkårsvurderingerMock.leggTilManuelleVurderinger(
        pseudoId,
        skjaeringstidspunkt,
        requestBody.versjon,
        requestBody.vurderinger,
    );
    return new Response(null, { status: 204 });
};
