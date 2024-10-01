import React from 'react';

import { Alert } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';
import { ActivePeriod } from '@typer/shared';

import styles from './SharedViews.module.css';

type Props = {
    person: PersonFragment;
    activePeriod: ActivePeriod;
};

export const AnnullertPeriodeView = ({ person, activePeriod }: Props) => {
    return (
        <div className={styles.Content}>
            <Alert variant="info" className={styles.Varsel}>
                Utbetalingen er annullert
            </Alert>
            <SaksbildeMenu person={person} activePeriod={activePeriod} />
        </div>
    );
};
