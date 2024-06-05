import React from 'react';

import { Alert } from '@navikt/ds-react';

import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';

import styles from './SharedViews.module.css';

export const AnnullertPeriodeView: React.FC = () => {
    return (
        <div className={styles.Content}>
            <SaksbildeMenu />
            <Alert variant="info" className={styles.Varsel}>
                Utbetalingen er annullert
            </Alert>
        </div>
    );
};
