import React, { ReactElement } from 'react';

import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    ChatIcon,
    CheckmarkCircleIcon,
    PaperplaneIcon,
    TimerPauseIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';

import styles from './HendelseIkon.module.css';

export const HistorikkCheckmarkCircleIkon = (): ReactElement => <CheckmarkCircleIcon className={styles.ikon} />;

export const TotrinnsvurderingReturIkon = (): ReactElement => <ArrowUndoIcon className={styles.ikon} />;

export const TotrinnsvurderingTilGodkjenningIkon = (): ReactElement => <PaperplaneIcon className={styles.ikon} />;

export const VedtaksperiodeReberegnetIkon = (): ReactElement => <ArrowsSquarepathIcon className={styles.ikon} />;

export const PåVentIkon = (): ReactElement => <TimerPauseIcon className={styles.ikon} />;

export const HistorikkXMarkOctagonIkon = (): ReactElement => <XMarkOctagonIcon className={styles.ikon} />;

interface NotatIkonProps {
    erOpphevStans: boolean;
}

export const NotatIkon = ({ erOpphevStans }: NotatIkonProps): ReactElement => {
    if (erOpphevStans) {
        return <CheckmarkCircleIcon className={styles.ikon} />;
    } else {
        return <ChatIcon className={styles.ikon} />;
    }
};
