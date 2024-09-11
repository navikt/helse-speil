import { usePathname } from 'next/navigation';
import React from 'react';
import { last } from 'remeda';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import { PersonFragment, UberegnetPeriodeFragment } from '@io/graphql';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';
import { Saksbildevarsler } from '@saksbilde/varsler/Saksbildevarsler';
import { getPeriodState } from '@utils/mapping';

import styles from './SharedViews.module.css';

type UberegnetPeriodeViewProps = {
    person: PersonFragment;
    activePeriod: UberegnetPeriodeFragment;
};

export const UberegnetPeriodeView = ({ person, activePeriod }: UberegnetPeriodeViewProps) => {
    const tab = last(usePathname().split('/'));
    useNavigateOnMount(Fane.Utbetaling);

    return (
        <div className={styles.Content}>
            <Saksbildevarsler periodState={getPeriodState(activePeriod)} varsler={activePeriod.varsler} />
            <SaksbildeMenu person={person} activePeriod={activePeriod} />
            <div className={styles.RouteContainer}>{tab === 'dagoversikt' && <Utbetaling person={person} />}</div>
        </div>
    );
};
