import React from 'react';

import { Back, Next } from '@navikt/ds-icons';

import styles from './ScrollButtons.module.css';

interface ScrollButtonsProps {
    navigateForwards: () => void;
    navigateBackwards: () => void;
    canNavigateForwards: boolean;
    canNavigateBackwards: boolean;
}

export const ScrollButtons: React.VFC<ScrollButtonsProps> = ({
    navigateForwards,
    navigateBackwards,
    canNavigateForwards,
    canNavigateBackwards,
}) => {
    return (
        <div className={styles.ScrollButtons}>
            <button className={styles.Button} onClick={navigateForwards} disabled={!canNavigateForwards}>
                <Back />
            </button>
            <button className={styles.Button} onClick={navigateBackwards} disabled={!canNavigateBackwards}>
                <Next />
            </button>
        </div>
    );
};
