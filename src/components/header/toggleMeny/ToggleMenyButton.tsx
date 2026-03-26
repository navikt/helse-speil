'use client';

import { useTheme } from 'next-themes';
import React, { ReactElement, useState } from 'react';

import { Dialog, InternalHeader, Theme } from '@navikt/ds-react';

import { ToggleMeny } from '@components/header/toggleMeny/ToggleMeny';

export function ToggleMenyButton(): ReactElement {
    const [open, setOpen] = useState(false);
    const { resolvedTheme } = useTheme();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <InternalHeader.Button>Toggles</InternalHeader.Button>
            </Dialog.Trigger>

            {/* Dette ser kanskje litt teit ut, men ble gjort sånn for å omgå hydreringsfeil */}
            {/* (resolvedTheme er undefined på serveren). */}
            {open && (
                <Theme theme={resolvedTheme as 'light' | 'dark'}>
                    <ToggleMeny />
                </Theme>
            )}
        </Dialog>
    );
}
