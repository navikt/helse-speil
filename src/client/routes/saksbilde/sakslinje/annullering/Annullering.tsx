import { Utbetaling } from 'internal-types';
import React, { useContext, useState } from 'react';

import { DropdownContext, DropdownMenyknapp } from '../../../../components/dropdown/Dropdown';
import { Tidslinjeperiode } from '../../../../modell/UtbetalingshistorikkElement';
import { usePerson } from '../../../../state/person';

import { Annulleringsmodal } from './Annulleringsmodal';

export interface AnnulleringProps {
    utbetaling: Utbetaling;
    aktivPeriode: Tidslinjeperiode;
}

export const Annullering = ({ utbetaling, aktivPeriode }: AnnulleringProps) => {
    const personTilBehandling = usePerson();
    const { lukk } = useContext(DropdownContext);
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <>
            <DropdownMenyknapp onClick={() => setShowModal(true)}>Annuller</DropdownMenyknapp>
            {showModal && (
                <Annulleringsmodal
                    person={personTilBehandling!}
                    organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                    fagsystemId={utbetaling.fagsystemId}
                    linjer={utbetaling.linjer}
                    onClose={() => {
                        setShowModal(false);
                        lukk();
                    }}
                />
            )}
        </>
    );
};
