import React from 'react';
import { Hendelse } from './Hendelse';
import { PeriodehistorikkType } from '@io/graphql';

const getTitle = (type: PeriodehistorikkType): string => {
    switch (type) {
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning:
            return 'Sendt til godkjenning';
        case PeriodehistorikkType.TotrinnsvurderingRetur:
            return 'Returnert';
        case PeriodehistorikkType.TotrinnsvurderingAttestert:
            return 'Godkjent og utbetalt';
        default:
            return '';
    }
};

interface HistorikkhendelseProps extends Omit<HistorikkhendelseObject, 'type' | 'id'> {}

export const Historikkhendelse: React.FC<HistorikkhendelseProps> = ({ historikktype, saksbehandler, timestamp }) => {
    return <Hendelse title={getTitle(historikktype)} ident={saksbehandler} timestamp={timestamp} />;
};
