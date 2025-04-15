import { FetchResult, MutationResult, useMutation } from '@apollo/client';
import {
    FetchPersonDocument,
    OpphevStansAutomatiskBehandlingDocument,
    OpphevStansAutomatiskBehandlingMutation,
    StansAutomatiskBehandlingDocument,
    StansAutomatiskBehandlingMutation,
} from '@io/graphql';
import { useAddToast } from '@state/toasts';

export function useStansAutomatiskBehandling(): [
    (
        fødselsnummer: string,
        begrunnelse: string,
        closeModal: () => void,
    ) => Promise<FetchResult<StansAutomatiskBehandlingMutation>>,
    MutationResult<StansAutomatiskBehandlingMutation>,
] {
    const addToast = useAddToast();
    const [stansAutomatiskBehandlingMutation, data] = useMutation(StansAutomatiskBehandlingDocument, {
        refetchQueries: [FetchPersonDocument],
    });

    async function stansAutomatiskBehandling(fødselsnummer: string, begrunnelse: string, closeModal: () => void) {
        return stansAutomatiskBehandlingMutation({
            variables: {
                fodselsnummer: fødselsnummer,
                begrunnelse: begrunnelse,
            },
            optimisticResponse: {
                __typename: 'Mutation',
                stansAutomatiskBehandling: true,
            },
            onCompleted: () => {
                closeModal();
                addToast({
                    key: 'stansAutomatiskBehandling',
                    message: 'Automatisk behandling stanset',
                    timeToLiveMs: 3000,
                });
            },
        });
    }

    return [stansAutomatiskBehandling, data];
}

export function useOpphevStansAutomatiskBehandling(): [
    (fødselsnummer: string) => Promise<FetchResult<OpphevStansAutomatiskBehandlingMutation>>,
    MutationResult<OpphevStansAutomatiskBehandlingMutation>,
] {
    const [opphevStansAutomatiskBehandlingMutation, data] = useMutation(OpphevStansAutomatiskBehandlingDocument, {
        refetchQueries: [FetchPersonDocument],
    });

    async function opphevStansAutomatiskBehandling(fødselsnummer: string) {
        return opphevStansAutomatiskBehandlingMutation({
            variables: {
                fodselsnummer: fødselsnummer,
            },
            optimisticResponse: {
                __typename: 'Mutation',
                opphevStansAutomatiskBehandling: true,
            },
        });
    }

    return [opphevStansAutomatiskBehandling, data];
}
