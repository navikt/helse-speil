import React, { useContext } from 'react';
import { PersonoppdateringDTO } from '../../../io/types';
import { postForespørPersonoppdatering } from '../../../io/http';
import { Scopes, useUpdateVarsler, Varsel } from '../../../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import { DropdownContext } from '../../../components/Dropdown';
import { DropdownMenyknapp } from './Verktøylinje';
import { usePerson } from '../../../state/person';
import { Person } from 'internal-types';

const forespørPersonoppdatering = (
    oppdatering: PersonoppdateringDTO,
    varsel: (varsel: Varsel) => void,
    fjernVarsel: () => void,
    lukk: () => void
) => {
    fjernVarsel();
    postForespørPersonoppdatering(oppdatering)
        .then(() => {
            varsel({
                message:
                    'Opplysningene om personen vil bli oppdatert. Dette kan ta noe tid og du må oppdatere skjermbildet (F5) for å se resultatet.',
                type: Varseltype.Info,
                scope: Scopes.SAKSBILDE,
            });
        })
        .catch(() => {
            varsel({
                message: 'Personoppdatering feilet. Prøv igjen om litt.',
                type: Varseltype.Feil,
                scope: Scopes.SAKSBILDE,
            });
        })
        .finally(lukk);
};

export const OppdaterPersondata = () => {
    const person = usePerson() as Person;
    const { leggTilVarsel, fjernVarsler } = useUpdateVarsler();
    const { lukk } = useContext(DropdownContext);

    return (
        <DropdownMenyknapp
            onClick={() =>
                forespørPersonoppdatering({ fødselsnummer: person.fødselsnummer }, leggTilVarsel, fjernVarsler, lukk)
            }
        >
            Oppdater persondata
        </DropdownMenyknapp>
    );
};
