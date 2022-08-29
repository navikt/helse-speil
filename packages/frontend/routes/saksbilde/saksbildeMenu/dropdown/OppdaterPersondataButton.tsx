import React, { useContext } from 'react';

import { DropdownButton, DropdownContext } from '@components/dropdown';
import { postForespørPersonoppdatering } from '@io/http';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { SpeilError } from '@utils/error';
import { Person } from '@io/graphql';

const PERSONOPPDATERING_VARSEL_KEY = 'personoppdatering';

class PersonoppdateringAlert extends SpeilError {
    name = PERSONOPPDATERING_VARSEL_KEY;
}

interface OppdaterPersondataButtonProps {
    person: Person;
}

export const OppdaterPersondataButton: React.FC<OppdaterPersondataButtonProps> = ({ person }) => {
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const { lukk } = useContext(DropdownContext);

    const forespørPersonoppdatering = (fødselsnummer: string) => () => {
        removeVarsel(PERSONOPPDATERING_VARSEL_KEY);
        postForespørPersonoppdatering({ fødselsnummer })
            .then(() => {
                addVarsel(
                    new PersonoppdateringAlert(
                        'Opplysningene om personen vil bli oppdatert. Dette kan ta noe tid og du må oppdatere skjermbildet (F5) for å se resultatet.',
                        { severity: 'info' },
                    ),
                );
            })
            .catch(() => {
                addVarsel(
                    new PersonoppdateringAlert('Personoppdatering feilet. Prøv igjen om litt.', { severity: 'error' }),
                );
            })
            .finally(lukk);
    };

    return (
        <DropdownButton onClick={forespørPersonoppdatering(person.fodselsnummer)}>Oppdater persondata</DropdownButton>
    );
};

export default OppdaterPersondataButton;
