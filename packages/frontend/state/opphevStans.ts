import { FetchResult, MutationResult, useMutation } from '@apollo/client';
import { FetchPersonDocument, OpphevStansDocument, OpphevStansMutation } from '@io/graphql';

export const useOpphevStans = (): [
    (fødselsnummer: string, begrunnelse: string) => Promise<FetchResult<OpphevStansMutation>>,
    MutationResult<OpphevStansMutation>,
] => {
    const [opphevStansMutation, data] = useMutation(OpphevStansDocument, {
        refetchQueries: [FetchPersonDocument],
    });

    const opphevStans = async (fødselsnummer: string, begrunnelse: string) =>
        opphevStansMutation({
            variables: {
                fodselsnummer: fødselsnummer,
                begrunnelse: begrunnelse,
            },
        });

    return [opphevStans, data];
};
