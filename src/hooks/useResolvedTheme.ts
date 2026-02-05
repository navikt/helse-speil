import { useTheme } from 'next-themes';

import { AkselColor } from '@navikt/ds-react/types/theme';

export const useResolvedTheme = () => {
    const { resolvedTheme, theme, setTheme } = useTheme();

    return {
        theme,
        setTheme,
        themeValue: (resolvedTheme === 'infotrygd' ? 'dark' : resolvedTheme) as 'light' | 'dark',
        dataColor: (resolvedTheme === 'infotrygd' ? 'infotrygd' : undefined) as AkselColor,
    };
};
