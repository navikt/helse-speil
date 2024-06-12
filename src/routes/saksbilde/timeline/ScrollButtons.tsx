import React, { ReactElement } from 'react';

import { Back, Next } from '@navikt/ds-icons';

import styles from './ScrollButtons.module.css';

interface ScrollButtonsProps {
    navigateForwards: () => void;
    navigateBackwards: () => void;
    canNavigateForwards: boolean;
    canNavigateBackwards: boolean;
}

export const ScrollButtons = ({
    navigateForwards,
    navigateBackwards,
    canNavigateForwards,
    canNavigateBackwards,
}: ScrollButtonsProps): ReactElement => {
    return (
        <div className={styles.ScrollButtons}>
            <button
                className={styles.Button}
                onClick={navigateForwards}
                disabled={!canNavigateForwards}
                aria-label="Navigate forwards"
            >
                <Back title="Back-icon" />
            </button>
            <button
                className={styles.Button}
                onClick={navigateBackwards}
                disabled={!canNavigateBackwards}
                aria-label="Navigate backwards"
            >
                <Next title="Next-icon" />
            </button>
        </div>
    );
};
