import React from 'react';

import { Alert } from '@navikt/ds-react';

import { Historikk } from '../historikk';
import { Venstremeny } from '../venstremeny/Venstremeny';

import styles from './PeriodeView.module.css';

export const PeriodeTilAnnulleringView: React.VFC = () => {
    return (
        <>
            <Venstremeny />
            <div className={styles.Content}>
                <Alert variant="info" className={styles.Varsel}>
                    Utbetalingen er sendt til annullering
                </Alert>
            </div>
            <Historikk />
        </>
    );
};
