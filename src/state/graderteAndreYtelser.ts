import { useParams } from 'next/navigation';

import { useGetGraderteAndreYtelserForPerson } from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';
import { useSkalSeGraderteAndreYtelser } from '@utils/featureToggles';

export function useGraderteAndreYtelser(): ApiGraderteAndreYtelser[] {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const skalSeGraderteAndreYtelser = useSkalSeGraderteAndreYtelser();
    const { data } = useGetGraderteAndreYtelserForPerson(personPseudoId!, {
        query: { enabled: skalSeGraderteAndreYtelser && !!personPseudoId },
    });
    return data ?? [];
}
