import { useRouter } from 'next/navigation';

import { AndreYtelserSchema } from '@form-schemas/andreYtelserSchema';
import {
    getGetGraderteAndreYtelserForPersonQueryKey,
    usePostGraderteAndreYtelser,
} from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { useGetPerson } from '@io/rest/generated/personer/personer';
import { tilGraderteAndreYtelserRequest } from '@saksbilde/andreYtelser/skjema/andreYtelserUtils';
import { useQueryClient } from '@tanstack/react-query';

type LeggTilAndreYtelserResultat = {
    onSubmit: (values: AndreYtelserSchema) => void;
    isPending: boolean;
    isError: boolean;
};

export const useLeggTilAndreYtelser = (personPseudoId: string): LeggTilAndreYtelserResultat => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: person } = useGetPerson(personPseudoId);

    const { mutate, isPending, isError } = usePostGraderteAndreYtelser({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetGraderteAndreYtelserForPersonQueryKey(personPseudoId),
                });
                router.back();
            },
        },
    });

    function onSubmit(values: AndreYtelserSchema) {
        if (!person) return;
        mutate({ data: tilGraderteAndreYtelserRequest(values, person.identitetsnummer) });
    }

    return { onSubmit, isPending, isError };
};
