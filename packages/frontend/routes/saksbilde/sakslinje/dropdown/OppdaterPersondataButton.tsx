import React, { useContext } from 'react';

import { DropdownButton, DropdownContext } from '@components/dropdown';
import { postForespørPersonoppdatering } from '@io/http';
import { useCurrentPerson } from '@state/person';
import { Scopes, useAddVarsel, useRemoveVarsel, VarselObject } from '@state/varsler';
import { isPerson } from '@utils/typeguards';

const personoppdateringvarselKey = 'personoppdatering';

const personoppdateringvarsel = (message: string, type: VarselObject['type']) => ({
    key: personoppdateringvarselKey,
    message: message,
    type: type,
    scope: Scopes.SAKSBILDE,
});

export const OppdaterPersondataButton: React.VFC = () => {
    const person = useCurrentPerson();

    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const { lukk } = useContext(DropdownContext);

    const forespørPersonoppdatering = (fødselsnummer: string) => () => {
        removeVarsel(personoppdateringvarselKey);
        postForespørPersonoppdatering({ fødselsnummer })
            .then(() => {
                addVarsel(
                    personoppdateringvarsel(
                        'Opplysningene om personen vil bli oppdatert. Dette kan ta noe tid og du må oppdatere skjermbildet (F5) for å se resultatet.',
                        'info',
                    ),
                );
            })
            .catch(() => {
                addVarsel(personoppdateringvarsel('Personoppdatering feilet. Prøv igjen om litt.', 'feil'));
            })
            .finally(lukk);
    };

    if (!isPerson(person)) {
        return null;
    }

    return (
        <DropdownButton onClick={forespørPersonoppdatering(person.fodselsnummer)}>Oppdater persondata</DropdownButton>
    );
};

export default OppdaterPersondataButton;
