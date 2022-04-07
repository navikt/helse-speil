import React, { useContext, useState } from 'react';

import { DropdownButton, DropdownContext } from '@components/dropdown/Dropdown';
import { Utbetaling, Utbetalingstatus } from '@io/graphql';

import { Annulleringsmodal } from '../annullering/Annulleringsmodal';
import { useArbeidsgiveroppdrag } from '../../utbetalingshistorikk/state';

export interface AnnulleringDropdownMenuButtonProps {
    utbetaling: Utbetaling;
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
}

export const AnnulleringDropdownMenuButton = ({
    utbetaling,
    aktørId,
    fødselsnummer,
    organisasjonsnummer,
}: AnnulleringDropdownMenuButtonProps) => {
    const [showModal, setShowModal] = useState(false);

    const oppdrag = useArbeidsgiveroppdrag(fødselsnummer, utbetaling.arbeidsgiverFagsystemId);

    const { lukk } = useContext(DropdownContext);

    if (!oppdrag?.arbeidsgiveroppdrag || utbetaling.status === Utbetalingstatus.Annullert) {
        return null;
    }

    return (
        <>
            <DropdownButton onClick={() => setShowModal(true)}>Annuller</DropdownButton>
            {showModal && (
                <Annulleringsmodal
                    fødselsnummer={fødselsnummer}
                    aktørId={aktørId}
                    organisasjonsnummer={organisasjonsnummer}
                    fagsystemId={utbetaling.arbeidsgiverFagsystemId}
                    linjer={oppdrag.arbeidsgiveroppdrag.linjer}
                    onClose={() => {
                        setShowModal(false);
                        lukk();
                    }}
                />
            )}
        </>
    );
};
