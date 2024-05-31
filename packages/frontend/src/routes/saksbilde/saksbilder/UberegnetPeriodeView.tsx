import dynamic from 'next/dynamic';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from '@navikt/ds-react';

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

export const UberegnetPeriodeView = ({ activePeriod }: UberegnetPeriodeViewProps) => (
    <>
        <Venstremeny />
        <div className={styles.Content}>
            <Saksbildevarsler periodState={getPeriodState(activePeriod)} varsler={activePeriod.varsler} />
            <SaksbildeMenu />
            <div className={styles.RouteContainer}>
                <React.Suspense fallback={<UberegnetPeriodeViewLoader />}>
                    <Routes>
                        <Route path="dagoversikt" element={<Utbetaling />} />
                    </Routes>
                </React.Suspense>
            </div>
        </div>
        <Historikk />
    </>
);

export default UberegnetPeriodeView;
