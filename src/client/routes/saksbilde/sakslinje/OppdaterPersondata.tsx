import React, { useContext } from 'react';
import { postForespørPersonoppdatering } from '../../../io/http';
import { Scopes, useAddVarsel, useRemoveVarsel } from '../../../state/varsler';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import {DropdownContext, DropdownMenyknapp} from '../../../components/dropdown/Dropdown';
import { usePerson } from '../../../state/person';
import { Person } from 'internal-types';

const personoppdateringvarselKey = 'personoppdatering';

const personoppdateringvarsel = (message: string, type: Varseltype) => ({
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
                        Varseltype.Info
                    )
                );
            })
            .catch(() => {
                addVarsel(personoppdateringvarsel('Personoppdatering feilet. Prøv igjen om litt.', Varseltype.Feil));
            })
            .finally(lukk);
    };

    return <DropdownMenyknapp onClick={forespørPersonoppdatering}>Oppdater persondata</DropdownMenyknapp>;
};
