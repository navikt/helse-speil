import classNames from 'classnames';
import React from 'react';

import { Cancel, Refresh, Send, Success } from '@navikt/ds-icons';

import { PeriodehistorikkType } from '@io/graphql';

import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Historikkhendelse.module.css';

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
            return <Success className={classNames(styles.Innrammet, styles.Attestert)} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingRetur: {
            return <Cancel className={classNames(styles.Innrammet)} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning: {
            return <Send className={classNames(styles.Innrammet, styles.TilGodkjenning)} />;
        }
        case PeriodehistorikkType.VedtaksperiodeReberegnet: {
            return <Refresh className={classNames(styles.Innrammet)} />;
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
