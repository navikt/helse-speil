import React from 'react';

import { Alert } from '@navikt/ds-react';

import { ActivePeriod } from '@/types/shared';

import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';

import styles from './SharedViews.module.css';

type Props = {
    activePeriod: ActivePeriod;
};

export const AnnullertPeriodeView = ({ activePeriod }: Props) => {
    return (
        <div className={styles.Content}>
            <SaksbildeMenu activePeriod={activePeriod} />
            <Alert variant="info" className={styles.Varsel}>
                Utbetalingen er annullert
            </Alert>
        </div>
    );
};
