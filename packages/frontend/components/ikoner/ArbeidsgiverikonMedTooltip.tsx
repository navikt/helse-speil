import React, { PropsWithChildren } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';

interface ArbeidsgiverikonMedTooltipProps {
    className?: string;
}

export const ArbeidsgiverikonMedTooltip = ({
    className,
    children,
}: PropsWithChildren<ArbeidsgiverikonMedTooltipProps>) => (
    <Tooltip content="Arbeidsgiver">
        <div className={className}>
            <Arbeidsgiverikon alt="Arbeidsgiver" />
            {children}
        </div>
    </Tooltip>
);
