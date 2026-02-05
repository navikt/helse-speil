'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export const ThemeSync = () => {
    const { theme } = useTheme();

    useEffect(() => {
        const html = document.documentElement;

        const syncTheme = () => {
            if (theme === 'infotrygd') {
                html.classList.remove('infotrygd');
                html.classList.add('dark');
                html.setAttribute('data-color', 'infotrygd');
            } else {
                html.removeAttribute('data-color');
            }
        };

        // Run immediately and after next paint to catch next-themes updates
        syncTheme();
        requestAnimationFrame(syncTheme);
    }, [theme]);

    return null;
};
