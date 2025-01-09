import React, { ReactElement } from 'react';

import { Kilde } from '@components/Kilde';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DateString } from '@typer/shared';

type InntektHentetFraAordningenhendelseProps = {
    timestamp: DateString;
};

export const InntektHentetFraAordningenhendelse = ({
    timestamp,
}: InntektHentetFraAordningenhendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<Kilde type="InntektHentetFraAordningen">AO</Kilde>}
        title="Inntekt hentet fra A-ordningen"
        timestamp={timestamp}
    />
);
