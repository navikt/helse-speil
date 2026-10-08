import { useParams } from 'next/navigation';

import {
    getGetGraderteAndreYtelserForPersonQueryKey,
    useGetGraderteAndreYtelserForPerson,
} from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';
import { useQueryClient } from '@tanstack/react-query';

type GraderteAndreYtelserResultat = {
    ytelser: ApiGraderteAndreYtelser[] | undefined;
    ytelse: ApiGraderteAndreYtelser | undefined;
    isPending: boolean;
    invaliderGraderteAndreYtelser: () => Promise<void>;
};

export function useGraderteAndreYtelser(andreYtelserId?: string): GraderteAndreYtelserResultat {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const queryClient = useQueryClient();
    const { data: ytelser, isPending } = useGetGraderteAndreYtelserForPerson(personPseudoId);

    return {
        ytelser,
        ytelse: ytelser?.find((it) => it.andreYtelserId === andreYtelserId),
        isPending,
        invaliderGraderteAndreYtelser: () =>
            queryClient.invalidateQueries({
                queryKey: getGetGraderteAndreYtelserForPersonQueryKey(personPseudoId),
            }),
    };
}
