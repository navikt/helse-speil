import { useParams } from 'next/navigation';

import { useGetGraderteAndreYtelserForPerson } from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';

type AlleGraderteAndreYtelserResultat = {
    ytelser: ApiGraderteAndreYtelser[] | undefined;
    isPending: boolean;
};

export const useAlleGraderteAndreYtelser = (): AlleGraderteAndreYtelserResultat => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data, isPending } = useGetGraderteAndreYtelserForPerson(personPseudoId);

    return {
        ytelser: data,
        isPending,
    };
};
