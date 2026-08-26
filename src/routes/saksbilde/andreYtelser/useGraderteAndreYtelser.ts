import { useParams } from 'next/navigation';

import {
    getGetGraderteAndreYtelserForPersonQueryKey,
    useGetGraderteAndreYtelserForPerson,
} from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';
import { useQueryClient } from '@tanstack/react-query';

type GraderteAndreYtelserResultat = {
    ytelse: ApiGraderteAndreYtelser | undefined;
    isPending: boolean;
    invaliderGraderteAndreYtelser: () => Promise<void>;
};

export const useGraderteAndreYtelser = (andreYtelserId: string): GraderteAndreYtelserResultat => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const queryClient = useQueryClient();
    const { data, isPending } = useGetGraderteAndreYtelserForPerson(personPseudoId);

    return {
        ytelse: data?.find((it) => it.andreYtelserId === andreYtelserId),
        isPending,
        invaliderGraderteAndreYtelser: () =>
            queryClient.invalidateQueries({
                queryKey: getGetGraderteAndreYtelserForPersonQueryKey(personPseudoId),
            }),
    };
};
