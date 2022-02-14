import React, { useContext } from 'react';

import { DropdownContext, DropdownMenyknapp } from '@components/dropdown/Dropdown';
import { useIsAnonymous, useToggleAnonymity } from '@state/anonymization';

export const AnonymiserData = () => {
    const { lukk } = useContext(DropdownContext);
    const persondataErAnonymisert = useIsAnonymous();
    const toggleAnonymity = useToggleAnonymity();

    const anonymiserData = () => {
        lukk();
        toggleAnonymity();
    };

    return (
        <DropdownMenyknapp onClick={anonymiserData}>
            {persondataErAnonymisert ? 'Fjern anonymisering' : 'Anonymiser personopplysninger'}
        </DropdownMenyknapp>
    );
};
