import React, { ReactElement, useState } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { StansAutomatiskBehandlingModal } from '@saksbilde/stansAutomatiskBehandling/StansAutomatiskBehandlingModal';

interface StansAutomatiskBehandlingButtonProps {
    aktørId: string;
}

export function StansAutomatiskBehandlingButton({ aktørId }: StansAutomatiskBehandlingButtonProps): ReactElement {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <Dropdown.Menu.List.Item onClick={() => setShowModal(true)}>
                Stans automatisk behandling
            </Dropdown.Menu.List.Item>
            {showModal && (
                <StansAutomatiskBehandlingModal
                    aktørId={aktørId}
                    onClose={() => setShowModal(false)}
                    showModal={showModal}
                />
            )}
        </>
    );
}
