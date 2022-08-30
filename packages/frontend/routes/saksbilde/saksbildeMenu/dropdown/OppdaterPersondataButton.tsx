import React from 'react';
import { Dropdown } from '@navikt/ds-react-internal';

import { Person } from '@io/graphql';
import { postForespørPersonoppdatering } from '@io/http';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { SpeilError } from '@utils/error';

class PersonoppdateringAlert extends SpeilError {
    static key = 'personoppdatering';
    name = PersonoppdateringAlert.key;
}

interface OppdaterPersondataButtonProps {
    person: Person;
}

export const OppdaterPersondataButton: React.FC<OppdaterPersondataButtonProps> = ({ person }) => {
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();

    const forespørPersonoppdatering = (fødselsnummer: string) => () => {
        removeVarsel(PersonoppdateringAlert.key);
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
            });
    };

    return (
        <Dropdown.Menu.List.Item onClick={forespørPersonoppdatering(person.fodselsnummer)}>
            Oppdater persondata
        </Dropdown.Menu.List.Item>
    );
};
