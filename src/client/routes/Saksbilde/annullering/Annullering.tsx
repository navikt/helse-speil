import React, { useContext, useState } from 'react';
import { Annulleringsmodal } from './Annulleringsmodal';
import { DropdownContext } from '../../../components/Dropdown';
import { DropdownMenyknapp } from '../sakslinje/Verktøylinje';
import { usePerson } from '../../../state/person';
import { useRecoilValue } from 'recoil';
import { aktivVedtaksperiodeState } from '../../../state/vedtaksperiode';

export const Annullering = () => {
    const personTilBehandling = usePerson();
    const aktivVedtaksperiode = useRecoilValue(aktivVedtaksperiodeState);
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
