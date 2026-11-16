import { useParams } from 'next/navigation';

import { ApiGraderteAndreYtelser } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { useGetGraderteAndreYtelser } from '@io/rest/generated/andre-ytelser/graderte-andre-ytelser/graderte-andre-ytelser';

export function useGraderteAndreYtelser(): ApiGraderteAndreYtelser[] {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const { data } = useGetGraderteAndreYtelser(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    return data ?? [];
}
