import { ApiAnnullering, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import {
    getGetAnnulleringForVedtaksperiodeQueryKey,
    useGetAnnulleringForVedtaksperiode,
} from '@io/rest/generated/vedtaksperioder/vedtaksperioder';
import { erPeriodeIFørsteBehandling } from '@state/inntektsforhold/arbeidsgiver';
import { useQueryClient } from '@tanstack/react-query';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useAnnullering = (vedtaksperiodeId?: string): ApiAnnullering | null => {
    const { data } = useGetAnnulleringForVedtaksperiode(vedtaksperiodeId!, {
        query: { enabled: !!vedtaksperiodeId },
    });
    return data?.annullering ?? null;
};

// Annulleringen vises bare på nyeste behandling av vedtaksperioden
export const useAnnulleringForPeriode = (
    person: ApiSaksbildePerson | null,
    periode: ActivePeriod | null,
): ApiAnnullering | null =>
    useAnnullering(
        person && isBeregnetPeriode(periode) && erPeriodeIFørsteBehandling(person, periode)
            ? periode.vedtaksperiodeId
            : undefined,
    );

export const useInvaliderAnnullering = () => {
    const queryClient = useQueryClient();
    return (vedtaksperiodeId: string) =>
        queryClient.invalidateQueries({ queryKey: getGetAnnulleringForVedtaksperiodeQueryKey(vedtaksperiodeId) });
};
