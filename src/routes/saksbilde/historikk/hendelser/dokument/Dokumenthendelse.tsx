import React, { ReactElement } from 'react';

import { Kilde } from '@components/Kilde';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { DateString } from '@typer/shared';

import { getKildetekst, getKildetype } from './dokument';

type DokumenthendelseProps = {
    dokumenttype: 'Sykmelding' | 'InntektHentetFraAordningen';
    timestamp: DateString;
};

export const Dokumenthendelse = ({ dokumenttype, timestamp }: DokumenthendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<Kilde type={getKildetype(dokumenttype)}>{getKildetekst(dokumenttype)}</Kilde>}
        title={
            dokumenttype === 'InntektHentetFraAordningen' ? 'Inntekt hentet fra A-ordningen' : dokumenttype + ' mottatt'
        }
        timestamp={timestamp}
    />
);
