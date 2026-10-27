'use client';

import { useTheme } from 'next-themes';
import React, { ReactElement } from 'react';

import { Theme, Tooltip, TooltipProps } from '@navikt/ds-react';

// InternalHeader er alltid mørk, og Tooltip arver temaet via Portal.
// Theme med asChild legger temaet på selve tooltipen, ikke på knappen.
export function HeaderTooltip(props: TooltipProps): ReactElement {
    const { resolvedTheme } = useTheme();

    return (
        <Theme theme={resolvedTheme as 'light' | 'dark' | undefined} asChild>
            <Tooltip {...props} />
        </Theme>
    );
}
