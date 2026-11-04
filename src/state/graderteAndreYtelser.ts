import { useParams } from 'next/navigation';

import { ApiGraderteAndreYtelser } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { useGetGraderteAndreYtelser } from '@io/rest/generated/andre-ytelser/graderte-andre-ytelser/graderte-andre-ytelser';
import { useSkalSeGraderteAndreYtelser } from '@utils/featureToggles';

export function useGraderteAndreYtelser(): ApiGraderteAndreYtelser[] {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const skalSeGraderteAndreYtelser = useSkalSeGraderteAndreYtelser();
    const { data } = useGetGraderteAndreYtelser(personPseudoId!, {
        query: { enabled: skalSeGraderteAndreYtelser && !!personPseudoId },
    });
    return data ?? [];
}
