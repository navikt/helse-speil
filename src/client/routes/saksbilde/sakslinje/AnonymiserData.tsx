import React, { useContext } from 'react';

import { DropdownContext, DropdownMenyknapp } from '../../../components/dropdown/Dropdown';
import { usePersondataSkalAnonymiseres, useToggleAnonymiserPersondata } from '../../../state/person';

export const AnonymiserData = () => {
    const { lukk } = useContext(DropdownContext);
    const persondataErAnonymisert = usePersondataSkalAnonymiseres();
    const toggleAnonymiserPersondata = useToggleAnonymiserPersondata();

    const anonymiserData = () => {
        lukk();
        toggleAnonymiserPersondata();
    };

    return (
        <DropdownMenyknapp onClick={anonymiserData}>
            {persondataErAnonymisert ? 'Fjern anonymisering' : 'Anonymiser personopplysninger'}
        </DropdownMenyknapp>
    );
};
