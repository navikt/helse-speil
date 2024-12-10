import classNames from 'classnames';
import React from 'react';

import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    CheckmarkCircleIcon,
    PaperplaneIcon,
    TimerPauseIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';

import styles from './HendelseIkon.module.css';

export const TotrinnsvurderingAttestertIkon = () => (
    <CheckmarkCircleIcon title="Sjekkmerkeikon" className={styles.ikon} />
);

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

export const StansAutomatiskBehandlingIkon = () => (
    <XMarkOctagonIcon title="Stoppikon" className={classNames(styles.ikon, styles.opphevStans)} />
);
