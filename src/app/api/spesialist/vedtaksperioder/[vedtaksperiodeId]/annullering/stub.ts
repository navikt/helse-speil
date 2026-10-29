import { ApiAnnulleringForVedtaksperiode } from '@io/rest/generated/spesialist.schemas';
import { finnNyestePeriodeForVedtaksperiodeId } from '@spesialist-mock/periodeoppslag';

export const stub = async (_request: Request, params: Promise<{ vedtaksperiodeId: string }>) => {
    const { vedtaksperiodeId } = await params;
    const periode = finnNyestePeriodeForVedtaksperiodeId(vedtaksperiodeId)?.periode;
    const body: ApiAnnulleringForVedtaksperiode = { annullering: periode?.annullering ?? null };
    return Response.json(body, { status: 200 });
};
