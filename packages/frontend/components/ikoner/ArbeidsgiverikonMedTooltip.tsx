import React from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';

export const ArbeidsgiverikonMedTooltip = () => (
    <Tooltip content="Arbeidsgiver">
        <div>
            <Arbeidsgiverikon alt="Arbeidsgiver" />
        </div>
    </Tooltip>
);
