import React, { ReactElement, useState } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { StansAutomatiskBehandlingModal } from '@saksbilde/stansAutomatiskBehandling/StansAutomatiskBehandlingModal';

interface StansAutomatiskBehandlingButtonProps {
    fødselsnummer: string;
}

export function StansAutomatiskBehandlingButton({ fødselsnummer }: StansAutomatiskBehandlingButtonProps): ReactElement {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <Dropdown.Menu.List.Item onClick={() => setShowModal(true)}>
                Stans automatisk behandling
            </Dropdown.Menu.List.Item>
            {showModal && (
                <StansAutomatiskBehandlingModal
                    fødselsnummer={fødselsnummer}
                    closeModal={() => setShowModal(false)}
                    showModal={showModal}
                />
            )}
        </>
    );
}
