import React, { ReactElement } from 'react';

import { HistorikkKildeSykmeldingIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DateString } from '@typer/shared';

type SykmeldingMottatthendelseProps = {
    timestamp: DateString;
};

export const SykmeldingMottatthendelse = ({ timestamp }: SykmeldingMottatthendelseProps): ReactElement => (
    <Historikkhendelse icon={<HistorikkKildeSykmeldingIkon />} title="Sykmelding mottatt" timestamp={timestamp} />
);
