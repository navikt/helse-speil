import { useEffect } from 'react';
import { useParams } from 'react-router';

import { useHentPerson, usePerson } from '../state/person';
import { Scopes, useAddVarsel, useRemoveVarsel } from '../state/varsler';

const feilvarselKey = 'hent-person-error';

export const erGyldigPersonId = (value: string) => value.match(/^\d{1,15}$/) !== null;

export const useRefreshPersonVedUrlEndring = () => {
    const { aktorId } = useParams<{ aktorId: string }>();
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const hentPerson = useHentPerson();
    const person = usePerson();

    useEffect(() => {
        if (aktorId && erGyldigPersonId(aktorId)) {
            if (person === undefined || person.aktørId !== aktorId) {
                removeVarsel(feilvarselKey);
                hentPerson(aktorId).catch((error) => {
                    addVarsel({
                        key: feilvarselKey,
                        message: error.message,
                        scope: Scopes.SAKSBILDE,
                        type: error.type,
                    });
                });
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
