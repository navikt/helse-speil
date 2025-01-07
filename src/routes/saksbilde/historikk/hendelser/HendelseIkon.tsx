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

import { NotatType } from '@typer/notat';

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

interface NotatIkonProps {
    notattype: NotatType;
}

export const NotatIkon = ({ notattype }: NotatIkonProps): ReactElement => {
    switch (notattype) {
        case 'OpphevStans':
            return <CheckmarkCircleIcon title="Sjekkmerke ikon" className={styles.ikon} />;
        case 'PaaVent':
            return <TimerPauseIcon title="Timer ikon" className={classNames(styles.ikon, styles.påVent)} />;
        case 'Retur':
            return <PaperplaneIcon title="Papirfly ikon" className={classNames(styles.ikon, styles.retur)} />;
        case 'Generelt':
            return <ChatIcon title="Chat ikon" className={styles.ikon} />;
    }
};
