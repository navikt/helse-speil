import React from 'react';

import { Alert } from '@navikt/ds-react';

import { Historikk } from '../historikk';
import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';
import { Venstremeny } from '../venstremeny/Venstremeny';

import styles from './PeriodeView.module.css';

export const AnnullertPeriodeView: React.FC = () => {
    return (
        <>
            <Venstremeny />
            <div className={styles.Content}>
                <SaksbildeMenu />
                <Alert variant="info" className={styles.Varsel}>
                    Utbetalingen er annullert
                </Alert>
            </div>
            <Historikk />
        </>
    );
};
