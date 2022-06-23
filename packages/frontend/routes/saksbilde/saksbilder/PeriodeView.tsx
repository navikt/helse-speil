import React from 'react';
import { Loader } from '@navikt/ds-react';

import { Varsel } from '@components/Varsel';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Periodetilstand } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { LazyLoadPendingError, onLazyLoadFail } from '@utils/error';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { AnnullertPeriodeView } from './AnnullertPeriodeView';
import { PeriodeTilAnnulleringView } from './PeriodeTilAnnulleringView';

import styles from './PeriodeView.module.css';

const GhostPeriodeView = React.lazy(() => import('./GhostPeriodeView').catch(onLazyLoadFail));
const UberegnetPeriodeView = React.lazy(() => import('./UberegnetPeriodeView').catch(onLazyLoadFail));
const BeregnetPeriodeView = React.lazy(() => import('./BeregnetPeriodeView').catch(onLazyLoadFail));

const PeriodeViewContainer: React.VFC = () => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!activePeriod || !currentPerson || !currentArbeidsgiver) {
        return null;
    } else if (isBeregnetPeriode(activePeriod)) {
        switch (activePeriod.periodetilstand) {
            case Periodetilstand.Annullert:
                return <AnnullertPeriodeView />;
            case Periodetilstand.TilAnnullering:
                return <PeriodeTilAnnulleringView />;
            default:
                return (
                    <BeregnetPeriodeView
                        activePeriod={activePeriod}
                        currentPerson={currentPerson}
                        currentArbeidsgiver={currentArbeidsgiver}
                    />
                );
        }
    } else if (isGhostPeriode(activePeriod)) {
        return (
            <GhostPeriodeView
                activePeriod={activePeriod}
                currentPerson={currentPerson}
                currentArbeidsgiver={currentArbeidsgiver}
            />
        );
    } else if (isUberegnetPeriode(activePeriod)) {
        return <UberegnetPeriodeView activePeriod={activePeriod} />;
    } else {
        return null;
    }
};

const PeriodeViewSkeleton = () => {
    return (
        <div className={styles.Skeleton}>
            <Loader size="xlarge" />
        </div>
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
        <Varsel variant="feil" className={styles.Error}>
            {error.message}
        </Varsel>
    );
};

export const PeriodeView: React.VFC = () => {
    return (
        <React.Suspense fallback={<PeriodeViewSkeleton />}>
            <ErrorBoundary fallback={(error) => <PeriodeViewError error={error} />}>
                <PeriodeViewContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};
