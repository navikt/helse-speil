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

export const HistorikkArrowSquarepathIkon = (): ReactElement => <ArrowsSquarepathIcon className={styles.ikon} />;

export const HistorikkArrowUndoIkon = (): ReactElement => <ArrowUndoIcon className={styles.ikon} />;

export const HistorikkChatIkon = (): ReactElement => <ChatIcon className={styles.ikon} />;

export const HistorikkCheckmarkCircleIkon = (): ReactElement => <CheckmarkCircleIcon className={styles.ikon} />;

export const HistorikkPaperplaneIkon = (): ReactElement => <PaperplaneIcon className={styles.ikon} />;

export const HistorikkTimerPauseIkon = (): ReactElement => <TimerPauseIcon className={styles.ikon} />;

export const HistorikkXMarkOctagonIkon = (): ReactElement => <XMarkOctagonIcon className={styles.ikon} />;
