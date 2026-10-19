import { getGetSaksbehandlerhandlingerForPersonQueryKey } from '@io/rest/generated/personer/personer';
import {
    getGetOpptjeningshistorikkBehandlerQueryKey,
    getGetVilkårsvurderingerForPersonBehandlerQueryKey,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { useQueryClient } from '@tanstack/react-query';

export function useInvaliderOpptjening(personPseudoId: string): () => void {
    const queryClient = useQueryClient();

    return () => {
        void queryClient.invalidateQueries({
            queryKey: getGetVilkårsvurderingerForPersonBehandlerQueryKey(personPseudoId),
        });
        void queryClient.invalidateQueries({
            queryKey: getGetOpptjeningshistorikkBehandlerQueryKey(personPseudoId),
        });
        void queryClient.invalidateQueries({
            queryKey: getGetSaksbehandlerhandlingerForPersonQueryKey(personPseudoId),
        });
    };
}
