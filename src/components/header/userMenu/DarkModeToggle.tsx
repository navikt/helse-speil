'use client';

import { useTheme } from 'next-themes';
import React, { ReactElement } from 'react';

import { MoonIcon, SunIcon } from '@navikt/aksel-icons';
import { ActionMenu } from '@navikt/ds-react/ActionMenu';

export function DarkModeToggle(): ReactElement {
    const { theme, setTheme } = useTheme();

    const isDark = theme === 'dark' || theme === 'infotrygd';
    const isRetroActive = theme === 'infotrygd';

    return (
        <>
            <ActionMenu.Item
                onSelect={() => setTheme(isDark ? 'light' : 'dark')}
                icon={isDark ? <SunIcon aria-hidden /> : <MoonIcon aria-hidden />}
            >
                {isDark ? 'Lys modus' : 'Mørk modus'}
            </ActionMenu.Item>
            {isDark && (
                <ActionMenu.Item onSelect={() => setTheme(isRetroActive ? 'dark' : 'infotrygd')}>
                    Toggle infotrygd-tema
                </ActionMenu.Item>
            )}
        </>
    );
}
