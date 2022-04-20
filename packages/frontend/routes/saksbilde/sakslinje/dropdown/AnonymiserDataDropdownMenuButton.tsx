import React, { useContext } from 'react';

import { DropdownButton, DropdownContext } from '@components/dropdown';
import { useIsAnonymous, useToggleAnonymity } from '@state/anonymization';

export const AnonymiserDataDropdownMenuButton: React.VFC = () => {
    const { lukk } = useContext(DropdownContext);
    const persondataErAnonymisert = useIsAnonymous();
    const toggleAnonymity = useToggleAnonymity();

    const anonymiserData = () => {
        lukk();
        toggleAnonymity();
    };

    return (
        <DropdownButton onClick={anonymiserData}>
            {persondataErAnonymisert ? 'Fjern anonymisering' : 'Anonymiser personopplysninger'}
        </DropdownButton>
    );
};

export default AnonymiserDataDropdownMenuButton;
