import React, { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Alert, Loader } from '@navikt/ds-react';

import { Dag, Sykdomsdagtype, UberegnetPeriode } from '@io/graphql';
import { isNotReady } from '@state/selectors/period';
import { onLazyLoadFail } from '@utils/error';
import { getPeriodState } from '@utils/mapping';

import { Historikk } from '../historikk';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Venstremeny } from '../venstremeny/Venstremeny';

import styles from './PeriodeView.module.css';

const Utbetaling = React.lazy(() =>
    import('../utbetaling/Utbetaling.js').then((res) => ({ default: res.Utbetaling })).catch(onLazyLoadFail),
);

const containsOnly = (days: Array<Dag>, ...dayTypes: Array<Sykdomsdagtype>): boolean => {
    const weekends = [Sykdomsdagtype.SykHelgedag, Sykdomsdagtype.FriskHelgedag];
    return days.every((dag) => [...dayTypes, ...weekends].includes(dag.sykdomsdagtype));
};

const containsPayment = (days: Array<Dag>): boolean => {
    return days.some((day) => typeof day.utbetalingsinfo?.utbetaling === 'number');
};

const getErrorMessage = (period: UberegnetPeriode): ReactNode => {
    if (isNotReady(period)) {
        return (
            <Alert className={styles.Varsel} variant="info">
                Perioden har ingen utbetaling og er ikke beregnet.
            </Alert>
        );
    }

    if (containsOnly(period.tidslinje, Sykdomsdagtype.Feriedag)) {
        return (
            <Alert className={styles.Varsel} variant="info">
                Perioden inneholder kun ferie og er ikke beregnet.
            </Alert>
        );
    }

    if (containsOnly(period.tidslinje, Sykdomsdagtype.Permisjonsdag)) {
        return (
            <Alert className={styles.Varsel} variant="info">
                Perioden inneholder kun permisjon og er ikke beregnet.
            </Alert>
        );
    }

    if (!containsPayment(period.tidslinje)) {
        return (
            <Alert className={styles.Varsel} variant="info">
                Perioden har ingen utbetaling og er ikke beregnet.
            </Alert>
        );
    }

    return (
        <Alert className={styles.Varsel} variant="info">
            Perioden er ikke beregnet.
        </Alert>
    );
};

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
    const errorMelding = getErrorMessage(activePeriod);

    return (
        <>
            <Venstremeny />
            <div className={styles.Content}>
                {errorMelding}
                <Saksbildevarsler periodState={getPeriodState(activePeriod)} varsler={activePeriod.varsler} />
                <div className={styles.RouteContainer}>
                    <React.Suspense fallback={<UberegnetPeriodeViewLoader />}>
                        <Routes>
                            <Route path="utbetaling" element={<Utbetaling />} />
                        </Routes>
                    </React.Suspense>
                </div>
            </div>
            <Historikk />
        </>
    );
};

export default UberegnetPeriodeView;
