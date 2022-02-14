import React, { useContext } from 'react';

import { DropdownContext, DropdownMenyknapp } from '@components/dropdown/Dropdown';
import { postForespørPersonoppdatering } from '@io/http';
import { usePerson } from '@state/person';
import { Scopes, useAddVarsel, useRemoveVarsel, VarselObject } from '@state/varsler';

const personoppdateringvarselKey = 'personoppdatering';

const personoppdateringvarsel = (message: string, type: VarselObject['type']) => ({
    key: personoppdateringvarselKey,
    message: message,
    type: type,
    scope: Scopes.SAKSBILDE,
});

export const OppdaterPersondata = () => {
    const person = usePerson() as Person;
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const { lukk } = useContext(DropdownContext);

    const forespørPersonoppdatering = () => {
        removeVarsel(personoppdateringvarselKey);
        postForespørPersonoppdatering({ fødselsnummer: person.fødselsnummer })
            .then(() => {
                addVarsel(
                    personoppdateringvarsel(
                        'Opplysningene om personen vil bli oppdatert. Dette kan ta noe tid og du må oppdatere skjermbildet (F5) for å se resultatet.',
                        'info'
                    )
                );
            })
            .catch(() => {
                addVarsel(personoppdateringvarsel('Personoppdatering feilet. Prøv igjen om litt.', 'feil'));
            })
            .finally(lukk);
    };

    return <DropdownMenyknapp onClick={forespørPersonoppdatering}>Oppdater persondata</DropdownMenyknapp>;
};
