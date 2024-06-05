import React, { PropsWithChildren } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Sykmeldtikon } from '@components/ikoner/Sykmeldtikon';

interface SykmeldtikonMedTooltipProps {
    className?: string;
}

export const SykmeldtikonMedTooltip = ({ className, children }: PropsWithChildren<SykmeldtikonMedTooltipProps>) => (
    <Tooltip content="Sykmeldt">
        <div className={className}>
            <Sykmeldtikon alt="Sykmeldt" />
            {children}
        </div>
    </Tooltip>
);
