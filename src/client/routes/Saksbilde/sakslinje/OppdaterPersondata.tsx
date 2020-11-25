import React, { useContext } from 'react';
import { PersonContext } from '../../../context/PersonContext';
import { PersonoppdateringDTO } from '../../../io/types';
import { postForespørPersonoppdatering } from '../../../io/http';
import { Scopes, useUpdateVarsler, Varsel } from '../../../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import { DropdownContext } from '../../../components/Dropdown';
import { Dropdownknapp } from './Verktøylinje';

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
    const { personTilBehandling } = useContext(PersonContext);
    const { leggTilVarsel, fjernVarsler } = useUpdateVarsler();
    const { lukk } = useContext(DropdownContext);

    return (
        <Dropdownknapp
            onClick={() =>
                forespørPersonoppdatering(
                    { fødselsnummer: personTilBehandling?.fødselsnummer!! },
                    leggTilVarsel,
                    fjernVarsler,
                    lukk
                )
            }
        >
            Oppdater persondata
        </Dropdownknapp>
    );
};
