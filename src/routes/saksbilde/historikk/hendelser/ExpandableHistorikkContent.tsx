import React, { PropsWithChildren, ReactElement, useState } from 'react';

import { AnimatedExpandableDiv } from '@components/AnimatedExpandableDiv';
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
    const [expanded, setExpanded] = useState(false);
    return (
        <Expandable
            expandable={true}
            expanded={expanded}
            setExpanded={setExpanded}
            expandText={openText}
            collapseText={closeText}
            className={className}
        >
            <AnimatedExpandableDiv expanded={expanded}>{children}</AnimatedExpandableDiv>
        </Expandable>
    );
};
