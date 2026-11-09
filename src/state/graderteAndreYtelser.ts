import { useParams } from 'next/navigation';

import { useErCoachFagkoordinatorEllerSupersaksbehandler } from '@hooks/brukerrolleHooks';
import { ApiGraderteAndreYtelser } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { useGetGraderteAndreYtelser } from '@io/rest/generated/andre-ytelser/graderte-andre-ytelser/graderte-andre-ytelser';

export function useGraderteAndreYtelser(): ApiGraderteAndreYtelser[] {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const skalSeGraderteAndreYtelser = useErCoachFagkoordinatorEllerSupersaksbehandler();
    const { data } = useGetGraderteAndreYtelser(personPseudoId!, {
        query: { enabled: skalSeGraderteAndreYtelser && !!personPseudoId },
    });
    return data ?? [];
}
