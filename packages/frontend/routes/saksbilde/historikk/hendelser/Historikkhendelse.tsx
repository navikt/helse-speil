import React from 'react';
import { Cancel, Refresh, Send, Success } from '@navikt/ds-icons';
import { Hendelse } from './Hendelse';
import { PeriodehistorikkType } from '@io/graphql';
import { HendelseDate } from './HendelseDate';

const getTitle = (type: PeriodehistorikkType): string => {
    switch (type) {
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning:
            return 'Sendt til godkjenning';
        case PeriodehistorikkType.TotrinnsvurderingRetur:
            return 'Returnert';
        case PeriodehistorikkType.TotrinnsvurderingAttestert:
            return 'Godkjent og utbetalt';
        case PeriodehistorikkType.VedtaksperiodeReberegnet:
            return 'Periode reberegnet';
        default:
            return '';
    }
};

const getIcon = (type: PeriodehistorikkType): ReactNode => {
    switch (type) {
        case PeriodehistorikkType.TotrinnsvurderingAttestert: {
            return <Success height={20} width={20} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingRetur: {
            return <Cancel height={20} width={20} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning: {
            return <Send height={20} width={20} />;
        }
        case PeriodehistorikkType.VedtaksperiodeReberegnet: {
            return <Refresh height={20} width={20} />;
        }
    }
};

interface HistorikkhendelseProps extends Omit<HistorikkhendelseObject, 'type' | 'id'> {}

export const Historikkhendelse: React.FC<HistorikkhendelseProps> = ({ historikktype, saksbehandler, timestamp }) => {
    return (
        <Hendelse title={getTitle(historikktype)} icon={getIcon(historikktype)}>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};
