import { callCustomAxios } from '@app/axios/orval-mutator';
import { useMutation } from '@tanstack/react-query';

// TODO fjerne når endepunktet er implementert i spesialist og generert med orval
export type ApiRevurderForsikringRequest = {
    skjæringstidspunkt: string;
};

export type ApiRevurderForsikringResponse = {
    nyForsikringsvurdering: boolean;
};

export const revurderForsikring = (personPseudoId: string, skjæringstidspunkt: string) =>
    callCustomAxios<ApiRevurderForsikringResponse>({
        url: `/api/spesialist/personer/${personPseudoId}/forsikringsvurderinger/revurdering`,
        method: 'POST',
        data: { skjæringstidspunkt } satisfies ApiRevurderForsikringRequest,
    });

export const useRevurderForsikring = (
    personPseudoId: string,
    skjæringstidspunkt: string,
    options?: { onSuccess?: (response: ApiRevurderForsikringResponse) => void },
) =>
    useMutation({
        mutationFn: () => revurderForsikring(personPseudoId, skjæringstidspunkt),
        onSuccess: options?.onSuccess,
    });
