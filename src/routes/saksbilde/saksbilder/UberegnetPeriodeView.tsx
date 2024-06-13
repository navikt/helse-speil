import { usePathname } from 'next/navigation';
import React from 'react';
import { last } from 'remeda';

import { Utbetaling } from '@/routes/saksbilde/utbetaling/Utbetaling';
import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import { PersonFragment, UberegnetPeriodeFragment } from '@io/graphql';
import { getPeriodState } from '@utils/mapping';

import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';

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
            <div className={styles.RouteContainer}>{tab === 'dagoversikt' && <Utbetaling />}</div>
        </div>
    );
};
