import React, { useContext } from 'react';
import { DropdownContext, DropdownMenyknapp } from '../../../components/dropdown/Dropdown';
import { useAnonymiserPerson, useSkalAnonymiserePerson } from '../../../state/person';

export const AnonymiserData = () => {
    const { lukk } = useContext(DropdownContext);
    const anonymiserPersondata = useAnonymiserPerson();
    const anonymiseringEnabled = useSkalAnonymiserePerson();

    const anonymiserData = () => {
        lukk();
        anonymiserPersondata(!anonymiseringEnabled);
        localStorage.setItem('agurkmodus', (!anonymiseringEnabled).toString());
    };

    return (
        <DropdownMenyknapp onClick={anonymiserData}>
            {anonymiseringEnabled ? 'Fjern anonymisering' : 'Anonymiser personopplysninger'}
        </DropdownMenyknapp>
    );
};
