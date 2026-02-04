'use client';

import { useTheme } from 'next-themes';
import React, { useState } from 'react';

import { InternalHeader, Theme } from '@navikt/ds-react';

import { ToggleMeny } from '@components/header/toggleMeny/ToggleMeny';

export const ToggleMenyButton = () => {
    const [showModal, setShowModal] = useState(false);
    const { resolvedTheme } = useTheme();

    return (
        <>
            <InternalHeader.Button onClick={() => setShowModal(true)}>Toggles</InternalHeader.Button>

            {showModal && (
                <Theme theme={resolvedTheme as 'light' | 'dark'}>
                    <ToggleMeny closeModal={() => setShowModal(false)} showModal={showModal} />
                </Theme>
            )}
        </>
    );
};
