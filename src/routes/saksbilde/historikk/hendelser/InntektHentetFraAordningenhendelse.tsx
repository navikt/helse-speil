import React, { ReactElement } from 'react';

import { HistorikkKildeInntektHentetFraAordningenIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DateString } from '@typer/shared';

type InntektHentetFraAordningenhendelseProps = {
    timestamp: DateString;
};

export const InntektHentetFraAordningenhendelse = ({
    timestamp,
}: InntektHentetFraAordningenhendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<HistorikkKildeInntektHentetFraAordningenIkon />}
        title="Inntekt hentet fra A-ordningen"
        timestamp={timestamp}
    />
);
