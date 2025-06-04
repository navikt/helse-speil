import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { isAnnullertBeregnetPeriode } from '@saksbilde/SaksbildeVarsel';
import { HistorikkXMarkOctagonIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { AnnulleringhendelseObject } from '@typer/historikk';
import { ActivePeriod } from '@typer/shared';

type AnnulleringhendelseProps = { aktivPeriode: ActivePeriod } & Omit<AnnulleringhendelseObject, 'type' | 'id'>;

export const Annulleringhendelse = ({
    aktivPeriode,
    årsaker,
    begrunnelse,
    saksbehandler,
    timestamp,
}: AnnulleringhendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<HistorikkXMarkOctagonIkon />}
        title={isAnnullertBeregnetPeriode(aktivPeriode) ? 'Saken er annullert' : 'Sendt til annullering'}
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
            <BodyShortWithPreWrap>{begrunnelse}</BodyShortWithPreWrap>
        </HistorikkSection>
    </Historikkhendelse>
);
