import { FetchResult, MutationResult, useMutation } from '@apollo/client';
import {
    FetchPersonDocument,
    OpphevStansAutomatiskBehandlingDocument,
    OpphevStansAutomatiskBehandlingMutation,
    StansAutomatiskBehandlingDocument,
    StansAutomatiskBehandlingMutation,
} from '@io/graphql';
import { useAddToast } from '@state/toasts';

type StansAutomatiskBehandlingResult = [
    (fødselsnummer: string, begrunnelse: string) => Promise<FetchResult<StansAutomatiskBehandlingMutation>>,
    MutationResult<StansAutomatiskBehandlingMutation>,
];

export function useStansAutomatiskBehandling(): StansAutomatiskBehandlingResult {
    const [stansAutomatiskBehandlingMutation, data] = useMutation(StansAutomatiskBehandlingDocument, {
        refetchQueries: [FetchPersonDocument],
    });

    async function stansAutomatiskBehandling(fødselsnummer: string, begrunnelse: string) {
        return stansAutomatiskBehandlingMutation({
            variables: {
                fodselsnummer: fødselsnummer,
                begrunnelse: begrunnelse,
            },
            awaitRefetchQueries: true,
        });
    }

    return [stansAutomatiskBehandling, data];
}

export function useOpphevStansAutomatiskBehandling(): [
    (fødselsnummer: string) => Promise<FetchResult<OpphevStansAutomatiskBehandlingMutation>>,
    MutationResult<OpphevStansAutomatiskBehandlingMutation>,
] {
    const addToast = useAddToast();
    const [opphevStansAutomatiskBehandlingMutation, data] = useMutation(OpphevStansAutomatiskBehandlingDocument, {
        refetchQueries: [FetchPersonDocument],
    });

    async function opphevStansAutomatiskBehandling(fødselsnummer: string) {
        return opphevStansAutomatiskBehandlingMutation({
            variables: {
                fodselsnummer: fødselsnummer,
            },
            onCompleted: () => {
                addToast({
                    key: 'opphevStansAutomatiskBehandling',
                    message: 'Stans av automatisk behandling opphevet',
                    timeToLiveMs: 3000,
                });
            },
        });
    }

    return [opphevStansAutomatiskBehandling, data];
}
