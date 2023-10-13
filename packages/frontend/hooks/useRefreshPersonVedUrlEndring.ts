import { useNavigate, useParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { FetchPersonDocument } from '@io/graphql';
import { NotFoundError } from '@io/graphql/errors';
import { useAddVarsel, useRapporterGraphQLErrors, useRemoveVarsel } from '@state/varsler';

const HENT_PERSON_ERROR_KEY = 'hent-person-error';

export const useRefreshPersonVedUrlEndring = () => {
    const { aktorId } = useParams<{ aktorId: string }>();
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const navigate = useNavigate();
    const rapporterErrors = useRapporterGraphQLErrors();

    useQuery(FetchPersonDocument, {
        variables: { aktorId },
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
            removeVarsel(HENT_PERSON_ERROR_KEY);
            if (data.person?.arbeidsgivere.length === 0) {
                navigate('/');
                addVarsel(new NotFoundError());
            }
        },
        onError: (error) => {
            rapporterErrors(error.graphQLErrors);
        },
    });
};
