import React, { ReactElement } from 'react';

import { Kilde } from '@components/Kilde';
import { EnkelHendelse } from '@saksbilde/historikk/hendelser/EnkelHendelse';
import { DateString } from '@typer/shared';

import { getKildetekst, getKildetype } from './dokument';

type DokumenthendelseProps = {
    dokumenttype: 'Sykmelding' | 'InntektHentetFraAordningen';
    timestamp: DateString;
};

export const Dokumenthendelse = ({ dokumenttype, timestamp }: DokumenthendelseProps): ReactElement => (
    <EnkelHendelse
        title={
            dokumenttype === 'InntektHentetFraAordningen' ? 'Inntekt hentet fra A-ordningen' : dokumenttype + ' mottatt'
        }
        icon={<Kilde type={getKildetype(dokumenttype)}>{getKildetekst(dokumenttype)}</Kilde>}
        timestamp={timestamp}
    />
);
