import React from 'react';

import { Alert } from '@navikt/ds-react';

import { ActivePeriod } from '@/types/shared';
import { PersonFragment } from '@io/graphql';

import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';

import styles from './SharedViews.module.css';

type Props = {
    person: PersonFragment;
    activePeriod: ActivePeriod;
};

export const AnnullertPeriodeView = ({ person, activePeriod }: Props) => {
    return (
        <div className={styles.Content}>
            <SaksbildeMenu person={person} activePeriod={activePeriod} />
            <Alert variant="info" className={styles.Varsel}>
                Utbetalingen er annullert
            </Alert>
        </div>
    );
};
