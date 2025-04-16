import { FetchResult, MutationResult, useMutation } from '@apollo/client';
import {
    FetchPersonDocument,
    OpphevStansAutomatiskBehandlingDocument,
    OpphevStansAutomatiskBehandlingMutation,
    StansAutomatiskBehandlingDocument,
    StansAutomatiskBehandlingMutation,
} from '@io/graphql';

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

type OpphevStansAutomatiskBehandlingResult = [
    (fødselsnummer: string) => Promise<FetchResult<OpphevStansAutomatiskBehandlingMutation>>,
    MutationResult<OpphevStansAutomatiskBehandlingMutation>,
];

export function useOpphevStansAutomatiskBehandling(): OpphevStansAutomatiskBehandlingResult {
    const [opphevStansAutomatiskBehandlingMutation, data] = useMutation(OpphevStansAutomatiskBehandlingDocument, {
        refetchQueries: [FetchPersonDocument],
    });

    async function opphevStansAutomatiskBehandling(fødselsnummer: string) {
        return opphevStansAutomatiskBehandlingMutation({
            variables: {
                fodselsnummer: fødselsnummer,
            },
            awaitRefetchQueries: true,
        });
    }

    return [opphevStansAutomatiskBehandling, data];
}
