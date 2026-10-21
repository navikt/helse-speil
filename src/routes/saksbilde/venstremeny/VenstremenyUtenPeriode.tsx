import React, { ReactElement } from 'react';

import { HarBeslutteroppgaver } from '@saksbilde/venstremeny/HarBeslutteroppgaver';
import { HarVurderbareVarsler } from '@saksbilde/venstremeny/HarVurderbareVarsler';
import { useFetchPersonQuery } from '@state/person';

import styles from './Venstremeny.module.css';

export const VenstremenyUtenPeriode = (): ReactElement | null => {
    const { data: currentPerson = null } = useFetchPersonQuery();

    if (!currentPerson) {
        return null;
    }

    return (
        <section className={styles.Venstremeny}>
            <HarBeslutteroppgaver person={currentPerson} />
            <HarVurderbareVarsler person={currentPerson} />
        </section>
    );
};
