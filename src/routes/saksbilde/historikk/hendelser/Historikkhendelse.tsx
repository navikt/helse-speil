import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';

import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    CheckmarkCircleIcon,
    PaperplaneIcon,
    TimerPauseIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';

import { PeriodehistorikkType } from '@io/graphql';
import { HistorikkhendelseUtenInnholdObject } from '@typer/historikk';

import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Historikkhendelse.module.css';

export const getTitle = (type: PeriodehistorikkType): string => {
    switch (type) {
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning:
            return 'Sendt til godkjenning';
        case PeriodehistorikkType.TotrinnsvurderingRetur:
            return 'Returnert';
        case PeriodehistorikkType.TotrinnsvurderingAttestert:
            return 'Godkjent og utbetalt';
        case PeriodehistorikkType.VedtaksperiodeReberegnet:
            return 'Periode reberegnet';
        case PeriodehistorikkType.LeggPaVent:
            return 'Lagt på vent';
        case PeriodehistorikkType.FjernFraPaVent:
            return 'Fjernet fra på vent';
        case PeriodehistorikkType.StansAutomatiskBehandling:
            return 'Automatisk behandling stanset';
        default:
            return '';
    }
};

export const getIcon = (type: PeriodehistorikkType): ReactNode => {
    switch (type) {
        case PeriodehistorikkType.TotrinnsvurderingAttestert: {
            return <CheckmarkCircleIcon title="Sjekkmerke ikon" className={styles.Innrammet} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingRetur: {
            return <ArrowUndoIcon title="Pil tilbake ikon" className={classNames(styles.Innrammet)} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning: {
            return <PaperplaneIcon title="Papirfly ikon" className={styles.Innrammet} />;
        }
        case PeriodehistorikkType.VedtaksperiodeReberegnet: {
            return <ArrowsSquarepathIcon title="Piler Firkantsti ikon" className={classNames(styles.Innrammet)} />;
        }
        case PeriodehistorikkType.LeggPaVent:
        case PeriodehistorikkType.FjernFraPaVent: {
            return <TimerPauseIcon title="Timer ikon" className={classNames(styles.Innrammet, styles.pavent)} />;
        }
        case PeriodehistorikkType.StansAutomatiskBehandling: {
            return <XMarkOctagonIcon title="Stopp ikon" className={classNames(styles.Innrammet, styles.opphevstans)} />;
        }
    }
};

type HistorikkhendelseProps = Omit<HistorikkhendelseUtenInnholdObject, 'type' | 'id'>;

export const Historikkhendelse = ({
    historikktype,
    saksbehandler,
    timestamp,
}: HistorikkhendelseProps): ReactElement => (
    <Hendelse title={getTitle(historikktype)} icon={getIcon(historikktype)}>
        <HendelseDate timestamp={timestamp} ident={saksbehandler} />
    </Hendelse>
);
