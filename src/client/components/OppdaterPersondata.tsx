import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../context/PersonContext';
import { Button } from './Button';
import { PersonoppdateringDTO } from '../io/types';
import { postForespørPersonoppdatering } from '../io/http';
import { Scopes, useUpdateVarsler, Varsel } from '../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import { DropdownContext } from './Dropdown';

const OppdaterKnapp = styled(Button)`
    border-radius: 0.25rem;
    height: 30px;
    width: 180px;
    font-size: 1rem;
    white-space: nowrap;

    &:hover,
    &:focus {
        background: #e7e9e9;
    }
    &:active {
        background: #e1e4e4;
    }
`;

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
        <OppdaterKnapp
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
        </OppdaterKnapp>
    );
};
