import { useEffect } from 'react';
import { useParams } from 'react-router';

import { Scopes, useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { useFetchPerson, usePersonLoadable } from '@state/person';
import { Person } from '@io/graphql';

const feilvarselKey = 'hent-person-error';

export const erGyldigPersonId = (value: string) => value.match(/^\d{1,15}$/) !== null;

const useAddVarselOnError = () => {
    const { state, contents } = usePersonLoadable();
    const addVarsel = useAddVarsel();

    useEffect(() => {
        if (state === 'hasError') {
            addVarsel({
                key: feilvarselKey,
                message: contents.message,
                scope: Scopes.SAKSBILDE,
                type: contents.type,
            });
        }
    }, [state]);
};

export const useRefreshPersonVedUrlEndring = () => {
    const { aktorId } = useParams<{ aktorId: string }>();
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const { state, contents } = usePersonLoadable();

    const fetchPerson = useFetchPerson();

    useEffect(() => {
        if (aktorId && erGyldigPersonId(aktorId)) {
            console.log(aktorId, state, contents);
            if (state !== 'hasValue' || contents === null || (contents as Person).aktorId !== aktorId) {
                removeVarsel(feilvarselKey);
                fetchPerson(aktorId);
            }
        } else {
            addVarsel({
                key: feilvarselKey,
                message: `'${aktorId}' er ikke en gyldig aktør-ID/fødselsnummer.`,
                scope: Scopes.SAKSBILDE,
                type: 'feil',
            });
        }
    }, [aktorId]);
};
