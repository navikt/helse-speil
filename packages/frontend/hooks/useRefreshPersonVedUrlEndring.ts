import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Person } from '@io/graphql';
import { NotFoundError } from '@io/graphql/errors';
import { useFetchPerson, usePersonLoadable } from '@state/person';
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
    const { state, contents } = usePersonLoadable();

    const fetchPerson = useFetchPerson();

    useEffect(() => {
        if (aktorId && erGyldigPersonId(aktorId)) {
            if (state !== 'hasValue' || contents === null || (contents as Person).aktorId !== aktorId) {
                removeVarsel(HENT_PERSON_ERROR_KEY);
                fetchPerson(aktorId).then((personState) => {
                    if (personState?.person?.arbeidsgivere.length === 0) {
                        navigate('/');
                        addVarsel(new NotFoundError());
                        return;
                    }
                });
            }
        } else {
            addVarsel(new HentPersonError(`'${aktorId}' er ikke en gyldig aktør-ID/fødselsnummer.`));
        }
    }, [aktorId]);
};
