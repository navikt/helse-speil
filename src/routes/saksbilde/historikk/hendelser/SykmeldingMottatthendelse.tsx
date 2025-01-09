import React, { ReactElement } from 'react';

import { Kilde } from '@components/Kilde';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DateString } from '@typer/shared';

type SykmeldingMottatthendelseProps = {
    timestamp: DateString;
};

export const SykmeldingMottatthendelse = ({ timestamp }: SykmeldingMottatthendelseProps): ReactElement => (
    <Historikkhendelse icon={<Kilde type="Sykmelding">SM</Kilde>} title="Sykmelding mottatt" timestamp={timestamp} />
);
