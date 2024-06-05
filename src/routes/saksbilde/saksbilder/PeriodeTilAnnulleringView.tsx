import React from 'react';

import { Alert } from '@navikt/ds-react';

import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';

import styles from './SharedViews.module.css';

export const PeriodeTilAnnulleringView: React.FC = () => {
    return (
        <div className={styles.Content}>
            <Alert variant="info" className={styles.Varsel}>
                Utbetalingen er sendt til annullering
            </Alert>
            <SaksbildeMenu />
        </div>
    );
};
