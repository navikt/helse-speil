import React, { PropsWithChildren, ReactElement } from 'react';

import { Expandable } from '@saksbilde/historikk/hendelser/Expandable';

interface ExpandableHistorikkContentProps extends PropsWithChildren {
    openText?: string;
    closeText?: string;
    className?: string;
}

export const ExpandableHistorikkContent = ({
    openText = 'Åpne',
    closeText = 'Lukk',
    className,
    children,
}: ExpandableHistorikkContentProps): ReactElement => {
    return (
        <Expandable expandText={openText} collapseText={closeText} className={className}>
            {children}
        </Expandable>
    );
};
