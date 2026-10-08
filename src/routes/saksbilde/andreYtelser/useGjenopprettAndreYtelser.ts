import { useRouter } from 'next/navigation';

import { AndreYtelserSchema } from '@form-schemas/andreYtelserSchema';
import { usePostGjenopprettGraderteAndreYtelser } from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';
import { tilGjenopprettGraderteAndreYtelserRequest } from '@saksbilde/andreYtelser/skjema/andreYtelserUtils';
import { useGraderteAndreYtelser } from '@saksbilde/andreYtelser/useGraderteAndreYtelser';

type GjenopprettAndreYtelserResultat = {
    ytelse: ApiGraderteAndreYtelser | undefined;
    onSubmit: (values: AndreYtelserSchema) => void;
    isPending: boolean;
    isError: boolean;
};

export const useGjenopprettAndreYtelser = (andreYtelserId: string): GjenopprettAndreYtelserResultat => {
    const router = useRouter();
    const { ytelse, invaliderGraderteAndreYtelser } = useGraderteAndreYtelser(andreYtelserId);

    const { mutate, isPending, isError } = usePostGjenopprettGraderteAndreYtelser({
        mutation: {
            onSuccess: async () => {
                await invaliderGraderteAndreYtelser();
                router.back();
            },
        },
    });

    function onSubmit(values: AndreYtelserSchema) {
        if (!ytelse) return;
        mutate({
            graderteAndreYtelserId: andreYtelserId,
            data: tilGjenopprettGraderteAndreYtelserRequest(values),
        });
    }

    return { ytelse, onSubmit, isPending, isError };
};
