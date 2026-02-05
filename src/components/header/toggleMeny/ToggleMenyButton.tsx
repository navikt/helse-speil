'use client';

import React, { useState } from 'react';

import { InternalHeader, Theme } from '@navikt/ds-react';

import { ToggleMeny } from '@components/header/toggleMeny/ToggleMeny';
import { useResolvedTheme } from '@hooks/useResolvedTheme';

export const ToggleMenyButton = () => {
    const [showModal, setShowModal] = useState(false);
    const { themeValue, dataColor } = useResolvedTheme();

    return (
        <>
            <InternalHeader.Button onClick={() => setShowModal(true)}>Toggles</InternalHeader.Button>

            {showModal && (
                <Theme theme={themeValue} data-color={dataColor}>
                    <ToggleMeny closeModal={() => setShowModal(false)} showModal={showModal} />
                </Theme>
            )}
        </>
    );
};
