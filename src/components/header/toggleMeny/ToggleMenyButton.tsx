import React, { useState } from 'react';

import { InternalHeader } from '@navikt/ds-react';

import { ToggleMeny } from '@components/header/toggleMeny/ToggleMeny';

export const ToggleMenyButton = () => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <InternalHeader.Button onClick={() => setShowModal(!showModal)}>Toggles</InternalHeader.Button>
            {showModal && <ToggleMeny onClose={() => setShowModal(false)} showModal={showModal} />}
        </>
    );
};
