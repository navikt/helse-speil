import React, { useContext } from 'react';
import { DropdownContext } from '../../../components/Dropdown';
import { DropdownMenyknapp } from './Verktøylinje';
import { useAnonymiserPerson, useSkalAnonymiserePerson } from '../../../state/person';

export const AnonymiserData = () => {
    const { lukk } = useContext(DropdownContext);
    const anonymiserPersondata = useAnonymiserPerson();
    const skalAnonymisereData = useSkalAnonymiserePerson();

    const anonymiserData = () => {
        lukk();
        anonymiserPersondata(!skalAnonymisereData);
    };

    return (
        <DropdownMenyknapp onClick={anonymiserData}>
            {skalAnonymisereData ? 'Fjern anonymisering' : 'Anonymiser person'}
        </DropdownMenyknapp>
    );
};
