import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React from 'react';

import { Loader } from '@navikt/ds-react';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import { UberegnetPeriode } from '@io/graphql';
import { onLazyLoadFail } from '@utils/error';
import { getPeriodState } from '@utils/mapping';

import { Historikk } from '../historikk';
import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';

import styles from './PeriodeView.module.css';

const Utbetaling = dynamic(() =>
    import('../utbetaling/Utbetaling').then((res) => ({ default: res.Utbetaling })).catch(onLazyLoadFail),
);

const UberegnetPeriodeViewLoader: React.FC = () => {
    return (
        <div className={styles.Skeleton}>
            <Loader size="xlarge" />
        </div>
    );
};

interface UberegnetPeriodeViewProps {
    activePeriod: UberegnetPeriode;
}

export const UberegnetPeriodeView = ({ activePeriod }: UberegnetPeriodeViewProps) => {
    const { tab } = useParams<{ tab: string }>();
    useNavigateOnMount(Fane.Utbetaling);

    return (
        <>
            <Venstremeny />
            <div className={styles.Content}>
                <Saksbildevarsler periodState={getPeriodState(activePeriod)} varsler={activePeriod.varsler} />
                <SaksbildeMenu />
                <div className={styles.RouteContainer}>
                    <React.Suspense fallback={<UberegnetPeriodeViewLoader />}>
                        {tab === 'dagsoversikt' && <Utbetaling />}
                    </React.Suspense>
                </div>
            </div>
            <Historikk />
        </>
    );
};

export default UberegnetPeriodeView;
