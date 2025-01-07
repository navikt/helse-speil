import React, { ReactElement } from 'react';

import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { DateString } from '@typer/shared';

interface EnkelHendelseProps {
    icon: ReactElement;
    title: string;
    timestamp: DateString;
    saksbehandler?: string;
}

export const EnkelHendelse = ({ icon, title, timestamp, saksbehandler }: EnkelHendelseProps): ReactElement => (
    <Historikkhendelse icon={icon} title={title} timestamp={timestamp} saksbehandler={saksbehandler} />
);
