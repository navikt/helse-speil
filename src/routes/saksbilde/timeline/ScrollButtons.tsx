import React, { ReactElement } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';

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
                <ChevronLeftIcon title="Back-left-icon" fontSize="1.25rem" />
            </button>
            <button
                className={styles.Button}
                onClick={navigateBackwards}
                disabled={!canNavigateBackwards}
                aria-label="Navigate backwards"
            >
                <ChevronRightIcon title="Next-right-icon" fontSize="1.25rem" />
            </button>
        </div>
    );
};
