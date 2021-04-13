import React, { useContext, useState } from 'react';
import { Annulleringsmodal } from './Annulleringsmodal';
import {DropdownContext, DropdownMenyknapp} from '../../../../components/dropdown/Dropdown';
import { usePerson } from '../../../../state/person';
import { useAktivVedtaksperiode } from '../../../../state/tidslinje';

export const Annullering = () => {
    const personTilBehandling = usePerson();
    const aktivVedtaksperiode = useAktivVedtaksperiode();
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
