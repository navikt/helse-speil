import dynamic from 'next/dynamic';
import React from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Periodetilstand } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { LazyLoadPendingError, onLazyLoadFail } from '@utils/error';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { Historikk } from '../historikk';
import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';
import { Venstremeny } from '../venstremeny/Venstremeny';
import { AnnullertPeriodeView } from './AnnullertPeriodeView';
import { PeriodeTilAnnulleringView } from './PeriodeTilAnnulleringView';

import styles from './PeriodeView.module.css';

const GhostPeriodeView = dynamic(() =>
    import('./GhostPeriodeView').then((res) => ({ default: res.GhostPeriodeView })).catch(onLazyLoadFail),
);
const UberegnetPeriodeView = dynamic(() =>
    import('./UberegnetPeriodeView').then((res) => ({ default: res.UberegnetPeriodeView })).catch(onLazyLoadFail),
);
const BeregnetPeriodeView = dynamic(() =>
    import('./BeregnetPeriodeView').then((res) => ({ default: res.BeregnetPeriodeView })).catch(onLazyLoadFail),
);

const PeriodeViewContainer: React.FC = () => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();

    if (!activePeriod || !currentPerson) {
        return <PeriodeViewSkeleton />;
    } else if (isBeregnetPeriode(activePeriod)) {
        switch (activePeriod.periodetilstand) {
            case Periodetilstand.Annullert:
                return <AnnullertPeriodeView />;
            case Periodetilstand.TilAnnullering:
                return <PeriodeTilAnnulleringView />;
            default:
                return <BeregnetPeriodeView period={activePeriod} person={currentPerson} />;
        }
    } else if (isGhostPeriode(activePeriod)) {
        return <GhostPeriodeView activePeriod={activePeriod} />;
    } else if (isUberegnetPeriode(activePeriod)) {
        return <UberegnetPeriodeView activePeriod={activePeriod} />;
    } else {
        return null;
    }
};

const PeriodeViewSkeleton = () => {
    return (
        <>
            <Venstremeny />
            <div className={styles.Content}>
                <SaksbildeMenu />
            </div>
            <Historikk />
        </>
    );
};

interface PeriodeViewErrorProps {
    error: Error;
}

const PeriodeViewError: React.FC<PeriodeViewErrorProps> = ({ error }) => {
    if (error instanceof LazyLoadPendingError) {
        return <PeriodeViewSkeleton />;
    }

    return (
        <Alert variant="error" size="small" className={styles.Error}>
            {error.message}
        </Alert>
    );
};

export const PeriodeView: React.FC = () => {
    return (
        <React.Suspense fallback={<PeriodeViewSkeleton />}>
            <ErrorBoundary fallback={(error) => <PeriodeViewError error={error} />}>
                <PeriodeViewContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};
