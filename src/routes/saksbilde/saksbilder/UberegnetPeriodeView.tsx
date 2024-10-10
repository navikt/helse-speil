import { usePathname } from 'next/navigation';
import React from 'react';
import { last } from 'remeda';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import { PersonFragment, UberegnetPeriodeFragment } from '@io/graphql';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';

import styles from './SharedViews.module.css';

type UberegnetPeriodeViewProps = {
    person: PersonFragment;
    activePeriod: UberegnetPeriodeFragment;
};

export const UberegnetPeriodeView = ({ person, activePeriod }: UberegnetPeriodeViewProps) => {
    const tab = last(usePathname().split('/'));
    useNavigateOnMount(Fane.Utbetaling);

    return (
        <div className={styles.RouteContainer}>
            {tab === 'dagoversikt' && <Utbetaling person={person} periode={activePeriod} />}
        </div>
    );
};
