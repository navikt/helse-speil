import React from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Sykmeldtikon } from '@components/ikoner/Sykmeldtikon';

export const SykmeldtikonMedTooltip = () => (
    <Tooltip content="Sykmeldt">
        <div>
            <Sykmeldtikon alt="Sykmeldt" />
        </div>
    </Tooltip>
);
