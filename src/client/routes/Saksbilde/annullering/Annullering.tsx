import React, { useContext, useState } from 'react';
import { Annulleringsmodal } from './Annulleringsmodal';
import { PersonContext } from '../../../context/PersonContext';
import { DropdownContext } from '../../../components/Dropdown';
import { DropdownMenyknapp } from '../sakslinje/Verktøylinje';

export const Annullering = () => {
    const { personTilBehandling, aktivVedtaksperiode } = useContext(PersonContext);
    const { lukk } = useContext(DropdownContext);
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <>
            <DropdownMenyknapp onClick={() => setShowModal(true)}>Annuller</DropdownMenyknapp>
            {showModal && (
                <Annulleringsmodal
                    person={personTilBehandling!}
                    vedtaksperiode={aktivVedtaksperiode!}
                    onClose={() => {
                        setShowModal(false);
                        lukk();
                    }}
                />
            )}
        </>
    );
};
