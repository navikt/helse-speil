import React from 'react';
import { Loader } from '@navikt/ds-react';

import { Varsel } from '@components/Varsel';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { GhostPeriodeView } from './GhostPeriodeView';
import { UberegnetPeriodeView } from './UberegnetPeriodeView';
import { BeregnetPeriodeView } from './BeregnetPeriodeView';

import styles from './PeriodeView.module.css';

const PeriodeViewContainer: React.VFC = () => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!activePeriod || !currentPerson || !currentArbeidsgiver) {
        return null;
    } else if (isBeregnetPeriode(activePeriod)) {
        return (
            <BeregnetPeriodeView
                activePeriod={activePeriod}
                currentArbeidsgiver={currentArbeidsgiver}
                currentPerson={currentPerson}
            />
        );
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

const PeriodeViewError: React.FC = ({ children }) => {
    return (
        <Varsel variant="feil" className={styles.Error}>
            {children}
        </Varsel>
    );
};

export const PeriodeView: React.VFC = () => {
    return (
        <React.Suspense fallback={<PeriodeViewSkeleton />}>
            <ErrorBoundary fallback={(error) => <PeriodeViewError>{error.message}</PeriodeViewError>}>
                <PeriodeViewContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};
