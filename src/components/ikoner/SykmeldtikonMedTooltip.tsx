import React from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Sykmeldtikon } from '@components/ikoner/Sykmeldtikon';

interface SykmeldtikonMedTooltipProps {
    className?: string;
}

export const SykmeldtikonMedTooltip = ({ className }: SykmeldtikonMedTooltipProps) => (
    <Tooltip content="Sykmeldt">
        <div role="img" className={className}>
            <Sykmeldtikon />
        </div>
    </Tooltip>
);
