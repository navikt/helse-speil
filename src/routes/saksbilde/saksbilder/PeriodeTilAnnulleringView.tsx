import React from 'react';

import { Alert } from '@navikt/ds-react';

import { BeregnetPeriodeFragment } from '@io/graphql';

import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';

import styles from './SharedViews.module.css';

type Props = {
    activePeriod: BeregnetPeriodeFragment;
};

export const PeriodeTilAnnulleringView = ({ activePeriod }: Props) => {
    return (
        <div className={styles.Content}>
            <Alert variant="info" className={styles.Varsel}>
                Utbetalingen er sendt til annullering
            </Alert>
            <SaksbildeMenu activePeriod={activePeriod} />
        </div>
    );
};
