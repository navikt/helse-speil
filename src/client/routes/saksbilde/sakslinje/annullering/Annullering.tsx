import React, { useContext, useState } from 'react';

import { DropdownContext, DropdownMenyknapp } from '../../../../components/dropdown/Dropdown';
import { Tidslinjeperiode } from '../../../../modell/UtbetalingshistorikkElement';
import { usePerson } from '../../../../state/person';

import { Annulleringsmodal } from './Annulleringsmodal';

export interface AnnulleringProps {
    aktivPeriode: Tidslinjeperiode;
}

export const Annullering = ({ aktivPeriode }: AnnulleringProps) => {
    const personTilBehandling = usePerson();
    const { lukk } = useContext(DropdownContext);
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <>
            <DropdownMenyknapp onClick={() => setShowModal(true)}>Annuller</DropdownMenyknapp>
            {showModal && (
                <Annulleringsmodal
                    person={personTilBehandling!}
                    aktivPeriode={aktivPeriode!}
                    onClose={() => {
                        setShowModal(false);
                        lukk();
                    }}
                />
            )}
        </>
    );
};
