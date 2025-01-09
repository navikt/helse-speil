import classNames from 'classnames';
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

export const HistorikkCheckmarkCircleIkon = () => <CheckmarkCircleIcon className={styles.ikon} />;

export const TotrinnsvurderingReturIkon = () => <ArrowUndoIcon title="Pil tilbakeikon" className={styles.ikon} />;

export const TotrinnsvurderingTilGodkjenningIkon = () => (
    <PaperplaneIcon title="Papirflyikon" className={styles.ikon} />
);

export const VedtaksperiodeReberegnetIkon = () => (
    <ArrowsSquarepathIcon title="Piler Firkantstiikon" className={styles.ikon} />
);

export const PåVentIkon = () => (
    <TimerPauseIcon title="Timer-ikon" className={classNames(styles.ikon, styles.påVent)} />
);

export const HistorikkXMarkOctagonIkon = () => <XMarkOctagonIcon className={classNames(styles.ikon)} />;

interface NotatIkonProps {
    erOpphevStans: boolean;
}

export const NotatIkon = ({ erOpphevStans }: NotatIkonProps): ReactElement => {
    if (erOpphevStans) {
        return <CheckmarkCircleIcon title="Sjekkmerke ikon" className={styles.ikon} />;
    } else {
        return <ChatIcon title="Chat ikon" className={styles.ikon} />;
    }
};
