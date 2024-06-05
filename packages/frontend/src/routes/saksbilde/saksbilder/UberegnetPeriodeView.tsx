import { useParams } from 'next/navigation';
import React from 'react';

import Utbetaling from '@/routes/saksbilde/utbetaling/Utbetaling';
import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import { UberegnetPeriode } from '@io/graphql';
import { getPeriodState } from '@utils/mapping';

import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';

import styles from './SharedViews.module.css';

interface UberegnetPeriodeViewProps {
    activePeriod: UberegnetPeriode;
}

export const UberegnetPeriodeView = ({ activePeriod }: UberegnetPeriodeViewProps) => {
    const { tab } = useParams<{ tab: string }>();
    useNavigateOnMount(Fane.Utbetaling);

    return (
        <div className={styles.Content}>
            <Saksbildevarsler periodState={getPeriodState(activePeriod)} varsler={activePeriod.varsler} />
            <SaksbildeMenu />
            <div className={styles.RouteContainer}>{tab === 'dagsoversikt' && <Utbetaling />}</div>
        </div>
    );
};

export default UberegnetPeriodeView;
