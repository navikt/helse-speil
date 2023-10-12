import { useNavigate, useParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { FetchPersonDocument } from '@io/graphql';
import { NotFoundError } from '@io/graphql/errors';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { SpeilError } from '@utils/error';

const HENT_PERSON_ERROR_KEY = 'hent-person-error';

class HentPersonError extends SpeilError {
    name = HENT_PERSON_ERROR_KEY;
}

export const erGyldigPersonId = (value: string) => value.match(/^\d{1,15}$/) !== null;

export const useRefreshPersonVedUrlEndring = () => {
    const { aktorId } = useParams<{ aktorId: string }>();
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const navigate = useNavigate();

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
        onError: () => {
            addVarsel(new HentPersonError(`'${aktorId}' er ikke en gyldig aktør-ID/fødselsnummer.`));
        },
    });
};
