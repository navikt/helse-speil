import React from 'react';

import { Maybe, PersonFragment } from '@io/graphql';
import { SaksbildeVarsel } from '@saksbilde/SaksbildeVarsel';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';
import { PeriodeViewError } from '@saksbilde/saksbilder/PeriodeViewError';
import { PeriodeViewSkeleton } from '@saksbilde/saksbilder/PeriodeViewSkeleton';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';

import styles from './saksbilder/SharedViews.module.css';

interface SaksbildeProps {
    children?: React.ReactNode;
}

export const Saksbilde = ({ children }: SaksbildeProps) => {
    const { loading, data, error } = useFetchPersonQuery();

    const person: Maybe<PersonFragment> = data?.person ?? null;
    const activePeriod = useActivePeriod(person);

    if (loading) {
        return <PeriodeViewSkeleton />;
    }

    if (error || !activePeriod || !person) {
        return <PeriodeViewError />;
    }

    return (
        <div className={styles.Content}>
            <SaksbildeVarsel person={person} periode={activePeriod} />
            <SaksbildeMenu person={person} activePeriod={activePeriod} />
            {children}
        </div>
    );
};
