import { ApiRisikovurderingForVedtaksperiode } from '@io/rest/generated/spesialist.schemas';
import { finnRisikovurdering } from '@spesialist-mock/storage/vedtaksperiodedata';

export const stub = async (_request: Request, params: Promise<{ vedtaksperiodeId: string }>) => {
    const { vedtaksperiodeId } = await params;
    const body: ApiRisikovurderingForVedtaksperiode = { risikovurdering: finnRisikovurdering(vedtaksperiodeId) };
    return Response.json(body, { status: 200 });
};
