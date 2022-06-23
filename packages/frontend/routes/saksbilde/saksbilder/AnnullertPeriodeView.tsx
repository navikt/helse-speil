import React from 'react';
import { Alert } from '@navikt/ds-react';

import { Venstremeny } from '../venstremeny/Venstremeny';
import { Historikk } from '../historikk/Historikk';

import styles from './PeriodeView.module.css';

export const AnnullertPeriodeView: React.VFC = () => {
    return (
        <>
            <Venstremeny />
            <div className={styles.Content}>
                <Alert variant="info" className={styles.Varsel}>
                    Utbetalingen er annullert
                </Alert>
            </div>
            <Historikk />
        </>
    );
};
