import { ApiRisikovurdering } from '@io/rest/generated/spesialist.schemas';
import { useGetRisikovurderingForVedtaksperiode } from '@io/rest/generated/vedtaksperioder/vedtaksperioder';

export const useRisikovurdering = (vedtaksperiodeId?: string): ApiRisikovurdering | null => {
    const { data } = useGetRisikovurderingForVedtaksperiode(vedtaksperiodeId!, {
        query: { enabled: !!vedtaksperiodeId },
    });
    return data?.risikovurdering ?? null;
};
