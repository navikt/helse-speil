import { FjernAndreYtelserSkjema } from '@form-schemas/fjernAndreYtelserSkjema';
import { usePostFjernGraderteAndreYtelser } from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { useGraderteAndreYtelser } from '@saksbilde/andreYtelser/useGraderteAndreYtelser';

type FjernAndreYtelserResultat = {
    onSubmit: (values: FjernAndreYtelserSkjema) => void;
    isPending: boolean;
    mutationError: Error | null;
};

export const useFjernAndreYtelser = (andreYtelserId: string, onSuccess: () => void): FjernAndreYtelserResultat => {
    const { invaliderGraderteAndreYtelser } = useGraderteAndreYtelser(andreYtelserId);
    const {
        mutate,
        isPending,
        error: mutationError,
    } = usePostFjernGraderteAndreYtelser({
        mutation: {
            onSuccess: async () => {
                await invaliderGraderteAndreYtelser();
                onSuccess();
            },
        },
    });

    function onSubmit(values: FjernAndreYtelserSkjema) {
        mutate({
            graderteAndreYtelserId: andreYtelserId,
            data: { notatTilBeslutter: values.begrunnelse },
        });
    }

    return { onSubmit, isPending, mutationError };
};
