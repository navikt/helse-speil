import { ApiAnnulleringForVedtaksperiode } from '@io/rest/generated/spesialist.schemas';
import { finnAnnullering } from '@spesialist-mock/storage/vedtaksperiodedata';

export const stub = async (_request: Request, params: Promise<{ vedtaksperiodeId: string }>) => {
    const { vedtaksperiodeId } = await params;
    const body: ApiAnnulleringForVedtaksperiode = { annullering: finnAnnullering(vedtaksperiodeId) };
    return Response.json(body, { status: 200 });
};
