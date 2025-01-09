import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { HistorikkXMarkOctagonIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { AnnulleringhendelseObject } from '@typer/historikk';

type AnnulleringhendelseProps = Omit<AnnulleringhendelseObject, 'type' | 'id'>;

export const Annulleringhendelse = ({
    årsaker,
    begrunnelse,
    saksbehandler,
    timestamp,
}: AnnulleringhendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<HistorikkXMarkOctagonIkon />}
        title="Saken er annullert"
        timestamp={timestamp}
        saksbehandler={saksbehandler}
        aktiv={false}
    >
        <HistorikkSection tittel="Årsaker">
            {årsaker.map((årsak, index) => (
                <BodyShort key={index + årsak}>{årsak}</BodyShort>
            ))}
        </HistorikkSection>
        <HistorikkSection tittel="Begrunnelse">
            <BodyShort>{begrunnelse}</BodyShort>
        </HistorikkSection>
    </Historikkhendelse>
);
