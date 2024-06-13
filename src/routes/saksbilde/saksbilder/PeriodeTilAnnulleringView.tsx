import React from 'react';

import { Alert } from '@navikt/ds-react';

import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';

import styles from './SharedViews.module.css';

type Props = {
    person: PersonFragment;
    activePeriod: BeregnetPeriodeFragment;
};

export const PeriodeTilAnnulleringView = ({ person, activePeriod }: Props) => {
    return (
        <div className={styles.Content}>
            <Alert variant="info" className={styles.Varsel}>
                Utbetalingen er sendt til annullering
            </Alert>
            <SaksbildeMenu person={person} activePeriod={activePeriod} />
        </div>
    );
};
